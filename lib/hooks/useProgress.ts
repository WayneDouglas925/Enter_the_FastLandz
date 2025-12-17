import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { UserProgress } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { queueOperation, isOnline } from '../offlineSync';

export const useProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !supabase) {
      // Fallback to localStorage if not authenticated
      const saved = localStorage.getItem('fastlandz_progress');
      if (saved) {
        setProgress(JSON.parse(saved));
      } else {
        setProgress({
          currentDay: 1,
          unlockedDays: 1,
          completedDays: [],
          failedDays: [],
        });
      }
      setLoading(false);
      return;
    }

    fetchProgress();

    // Set up real-time subscription
    const subscription = supabase
      .channel('user_progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new) {
            const data = payload.new as any;
            setProgress({
              currentDay: data.current_day,
              unlockedDays: data.unlocked_days,
              completedDays: data.completed_days,
              failedDays: data.failed_days,
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchProgress = async () => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProgress({
          currentDay: data.current_day,
          unlockedDays: data.unlocked_days,
          completedDays: data.completed_days,
          failedDays: data.failed_days,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (updatedProgress: Partial<UserProgress>) => {
    if (!user || !supabase) {
      // Fallback to localStorage
      const newProgress = { ...progress!, ...updatedProgress };
      setProgress(newProgress);
      localStorage.setItem('fastlandz_progress', JSON.stringify(newProgress));
      return;
    }

    // Optimistic update
    setProgress((prev) => ({ ...prev!, ...updatedProgress }));

    try {
      if (!isOnline()) {
        queueOperation('progress_update', {
          userId: user.id,
          updates: {
            current_day: updatedProgress.currentDay,
            unlocked_days: updatedProgress.unlockedDays,
            completed_days: updatedProgress.completedDays,
            failed_days: updatedProgress.failedDays,
          }
        });
        return;
      }

      const { error } = await supabase
        .from('user_progress')
        .update({
          current_day: updatedProgress.currentDay,
          unlocked_days: updatedProgress.unlockedDays,
          completed_days: updatedProgress.completedDays,
          failed_days: updatedProgress.failedDays,
        })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (err: any) {
      // If network error, queue it
      if (err.message?.includes('network') || err.message?.includes('fetch')) {
        queueOperation('progress_update', {
          userId: user.id,
          updates: {
            current_day: updatedProgress.currentDay,
            unlocked_days: updatedProgress.unlockedDays,
            completed_days: updatedProgress.completedDays,
            failed_days: updatedProgress.failedDays,
          }
        });
      } else {
        setError(err.message);
        // Rollback optimistic update if it's a real error
        fetchProgress();
        throw err;
      }
    }
  };

  return { progress, loading, error, updateProgress, refetch: fetchProgress };
};
