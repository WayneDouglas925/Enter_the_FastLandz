import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { FastState } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

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

    setFastState(newFastState);

    if (user && supabase) {
      try {
        const { error } = await supabase.from('fast_sessions').insert({
          user_id: user.id,
          day,
          start_time: new Date(startTime).toISOString(),
          target_end_time: new Date(targetEndTime).toISOString(),
          duration_hours: durationHours,
          is_active: true,
          is_paused: false,
          total_paused_time: 0,
        });

        if (error) throw error;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    }
  };

  const updateFastSession = async (updates: Partial<FastState>) => {
    const newState = { ...fastState, ...updates };
    setFastState(newState);

    if (user && supabase && fastState.isActive) {
      try {
        // Find the active session
        const { data: sessions, error: fetchError } = await supabase
          .from('fast_sessions')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchError) throw fetchError;
        if (!sessions || sessions.length === 0) return;

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
          .eq('id', sessions[0].id);

        if (error) throw error;
      } catch (err: any) {
        setError(err.message);
        throw err;
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
      try {
        const { data: sessions, error: fetchError } = await supabase
          .from('fast_sessions')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchError) throw fetchError;
        if (!sessions || sessions.length === 0) return;

        const { error } = await supabase
          .from('fast_sessions')
          .update({
            is_active: false,
            completed: true,
            actual_end_time: new Date().toISOString(),
          })
          .eq('id', sessions[0].id);

        if (error) throw error;
      } catch (err: any) {
        setError(err.message);
        throw err;
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
      try {
        const { data: sessions, error: fetchError } = await supabase
          .from('fast_sessions')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchError) throw fetchError;
        if (!sessions || sessions.length === 0) return;

        const { error } = await supabase
          .from('fast_sessions')
          .update({
            is_active: false,
            failed: true,
            actual_end_time: new Date().toISOString(),
          })
          .eq('id', sessions[0].id);

        if (error) throw error;
      } catch (err: any) {
        setError(err.message);
        throw err;
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
