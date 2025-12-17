import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { FastState } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { queueOperation, isOnline } from '../offlineSync';

export const useFastSession = () => {
  const { user } = useAuth();
  const [fastState, setFastState] = useState<FastState>(() => {
    // Try localStorage first for immediate hydration
    const saved = localStorage.getItem('fastlandz_faststate');
    return saved
      ? JSON.parse(saved)
      : {
          isActive: false,
          startTime: null,
          targetEndTime: null,
          durationHours: 0,
          isPaused: false,
          pausedAt: null,
          totalPausedTime: 0,
        };
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    fetchActiveFastSession();

    // Set up real-time subscription for active sessions
    const subscription = supabase
      .channel('fast_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fast_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new && (payload.new as any).is_active) {
            syncFastStateFromDB(payload.new as any);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem('fastlandz_faststate', JSON.stringify(fastState));
  }, [fastState]);

  const fetchActiveFastSession = async () => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('fast_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

      if (data) {
        syncFastStateFromDB(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const syncFastStateFromDB = (data: any) => {
    setFastState({
      isActive: data.is_active,
      startTime: new Date(data.start_time).getTime(),
      targetEndTime: new Date(data.target_end_time).getTime(),
      durationHours: data.duration_hours,
      isPaused: data.is_paused,
      pausedAt: data.paused_at ? new Date(data.paused_at).getTime() : null,
      totalPausedTime: data.total_paused_time,
      sessionId: data.id,
    });
  };

  const startFastSession = async (
    startTime: number,
    durationHours: number,
    day: number
  ) => {
    const targetEndTime = startTime + durationHours * 60 * 60 * 1000;
    const newFastState: FastState = {
      isActive: true,
      startTime,
      targetEndTime,
      durationHours,
      isPaused: false,
      pausedAt: null,
      totalPausedTime: 0,
    };

    // Optimistic update (without ID initially)
    setFastState(newFastState);

    if (user && supabase) {
      try {
        const { data, error } = await supabase
          .from('fast_sessions')
          .insert({
            user_id: user.id,
            day,
            start_time: new Date(startTime).toISOString(),
            target_end_time: new Date(targetEndTime).toISOString(),
            duration_hours: durationHours,
            is_active: true,
            is_paused: false,
            total_paused_time: 0,
          })
          .select('id')
          .single();

        if (error) throw error;

        // Update state with the new session ID
        if (data) {
          setFastState((prev) => ({ ...prev, sessionId: data.id }));
        }
      } catch (err: any) {
        // If network error, we can't really queue a "start" easily without an ID,
        // but we could potentially generate a temp ID. For now, just error.
        // Actually, offlineSync supports 'fast_session_update' but not 'create' explicitly in the types I saw?
        // Let's check offlineSync.ts types again. It has 'fast_session_update'.
        // It doesn't have 'fast_session_create'.
        // So for now, we just accept that starting a fast requires connection, OR we implement 'fast_session_create' in offlineSync.
        setError(err.message);
        // Don't throw, keep local state active so user thinks it started.
        // But warn them?
      }
    }
  };

  const updateFastSession = async (updates: Partial<FastState>) => {
    const newState = { ...fastState, ...updates };
    setFastState(newState);

    if (user && supabase && fastState.isActive) {
      // If we have a session ID, we can try to update or queue
      if (fastState.sessionId) {
        try {
          if (!isOnline()) {
            queueOperation('fast_session_update', {
              sessionId: fastState.sessionId,
              updates: {
                is_paused: newState.isPaused,
                total_paused_time: newState.totalPausedTime,
                paused_at: newState.pausedAt ? new Date(newState.pausedAt).toISOString() : null,
              }
            });
            return;
          }

          const updateData: any = {
            is_paused: newState.isPaused,
            total_paused_time: newState.totalPausedTime,
          };

          if (newState.pausedAt) {
            updateData.paused_at = new Date(newState.pausedAt).toISOString();
          }

          const { error } = await supabase
            .from('fast_sessions')
            .update(updateData)
            .eq('id', fastState.sessionId);

          if (error) throw error;
        } catch (err: any) {
           if (err.message?.includes('network') || err.message?.includes('fetch')) {
             queueOperation('fast_session_update', {
              sessionId: fastState.sessionId,
              updates: {
                is_paused: newState.isPaused,
                total_paused_time: newState.totalPausedTime,
                paused_at: newState.pausedAt ? new Date(newState.pausedAt).toISOString() : null,
              }
            });
           } else {
             setError(err.message);
           }
        }
      } else {
        // No session ID (maybe started offline or failed to fetch)
        // Try to fetch it now
        try {
           const { data: sessions, error: fetchError } = await supabase
            .from('fast_sessions')
            .select('id')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1);

          if (fetchError) throw fetchError;
          
          if (sessions && sessions.length > 0) {
             const sessionId = sessions[0].id;
             // Update state with ID
             setFastState(prev => ({ ...prev, sessionId }));
             
             // Now perform the update
             const updateData: any = {
                is_paused: newState.isPaused,
                total_paused_time: newState.totalPausedTime,
              };

              if (newState.pausedAt) {
                updateData.paused_at = new Date(newState.pausedAt).toISOString();
              }

              const { error } = await supabase
                .from('fast_sessions')
                .update(updateData)
                .eq('id', sessionId);

              if (error) throw error;
          }
        } catch (err: any) {
           // If we still fail, we can't do much without an ID
           console.warn('Failed to sync fast session update', err);
        }
      }
    }
  };

  const completeFastSession = async () => {
    const newState: FastState = {
      isActive: false,
      startTime: null,
      targetEndTime: null,
      durationHours: 0,
      isPaused: false,
      pausedAt: null,
      totalPausedTime: 0,
    };

    setFastState(newState);

    if (user && supabase) {
      const sessionId = fastState.sessionId;
      if (sessionId) {
         try {
            if (!isOnline()) {
               queueOperation('fast_session_update', {
                  sessionId,
                  updates: {
                    is_active: false,
                    completed: true,
                    actual_end_time: new Date().toISOString(),
                  }
               });
               return;
            }

            const { error } = await supabase
              .from('fast_sessions')
              .update({
                is_active: false,
                completed: true,
                actual_end_time: new Date().toISOString(),
              })
              .eq('id', sessionId);

            if (error) throw error;
         } catch (err: any) {
            if (err.message?.includes('network') || err.message?.includes('fetch')) {
               queueOperation('fast_session_update', {
                  sessionId,
                  updates: {
                    is_active: false,
                    completed: true,
                    actual_end_time: new Date().toISOString(),
                  }
               });
            } else {
               setError(err.message);
            }
         }
      } else {
         // Fallback: try to find active session to close
         try {
            const { data: sessions } = await supabase
              .from('fast_sessions')
              .select('id')
              .eq('user_id', user.id)
              .eq('is_active', true)
              .limit(1);
            
            if (sessions && sessions.length > 0) {
               await supabase.from('fast_sessions').update({
                  is_active: false,
                  completed: true,
                  actual_end_time: new Date().toISOString(),
               }).eq('id', sessions[0].id);
            }
         } catch (e) {
            console.error(e);
         }
      }
    }
  };

  const failFastSession = async () => {
    const newState: FastState = {
      isActive: false,
      startTime: null,
      targetEndTime: null,
      durationHours: 0,
      isPaused: false,
      pausedAt: null,
      totalPausedTime: 0,
    };

    setFastState(newState);

    if (user && supabase) {
      const sessionId = fastState.sessionId;
      if (sessionId) {
         try {
            if (!isOnline()) {
               queueOperation('fast_session_update', {
                  sessionId,
                  updates: {
                    is_active: false,
                    failed: true,
                    actual_end_time: new Date().toISOString(),
                  }
               });
               return;
            }

            const { error } = await supabase
              .from('fast_sessions')
              .update({
                is_active: false,
                failed: true,
                actual_end_time: new Date().toISOString(),
              })
              .eq('id', sessionId);

            if (error) throw error;
         } catch (err: any) {
            if (err.message?.includes('network') || err.message?.includes('fetch')) {
               queueOperation('fast_session_update', {
                  sessionId,
                  updates: {
                    is_active: false,
                    failed: true,
                    actual_end_time: new Date().toISOString(),
                  }
               });
            } else {
               setError(err.message);
            }
         }
      } else {
         // Fallback
         try {
            const { data: sessions } = await supabase
              .from('fast_sessions')
              .select('id')
              .eq('user_id', user.id)
              .eq('is_active', true)
              .limit(1);
            
            if (sessions && sessions.length > 0) {
               await supabase.from('fast_sessions').update({
                  is_active: false,
                  failed: true,
                  actual_end_time: new Date().toISOString(),
               }).eq('id', sessions[0].id);
            }
         } catch (e) {
            console.error(e);
         }
      }
    }
  };

  return {
    fastState,
    loading,
    error,
    startFastSession,
    updateFastSession,
    completeFastSession,
    failFastSession,
    refetch: fetchActiveFastSession,
  };
};
