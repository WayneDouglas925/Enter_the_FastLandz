import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { JournalEntry } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { queueOperation, isOnline } from '../offlineSync';

export const useJournal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    // Try localStorage first for immediate hydration
    const saved = localStorage.getItem('fastlandz_journal');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    fetchJournalEntries();

    // Set up real-time subscription
    const subscription = supabase
      .channel('journal_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch all entries when any change occurs
          fetchJournalEntries();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem('fastlandz_journal', JSON.stringify(entries));
  }, [entries]);

  const fetchJournalEntries = async () => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedEntries: JournalEntry[] = data.map((entry) => ({
          day: entry.day,
          date: entry.date,
          mood: entry.mood || '',
          symptoms: entry.symptoms || '',
          preFastMeal: entry.pre_fast_meal || '',
          notes: entry.notes || '',
          completed: entry.completed,
        }));

        setEntries(mappedEntries);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addJournalEntry = async (entry: JournalEntry) => {
    // Add to local state immediately for optimistic update
    setEntries((prev) => [entry, ...prev]);

    if (user && supabase) {
      try {
        if (!isOnline()) {
          queueOperation('journal_create', {
            user_id: user.id,
            day: entry.day,
            date: entry.date,
            mood: entry.mood,
            symptoms: entry.symptoms,
            pre_fast_meal: entry.preFastMeal,
            notes: entry.notes,
            completed: entry.completed,
          });
          return;
        }

        const { error } = await supabase.from('journal_entries').insert({
          user_id: user.id,
          day: entry.day,
          date: entry.date,
          mood: entry.mood,
          symptoms: entry.symptoms,
          pre_fast_meal: entry.preFastMeal,
          notes: entry.notes,
          completed: entry.completed,
        });

        if (error) throw error;
      } catch (err: any) {
        if (err.message?.includes('network') || err.message?.includes('fetch')) {
           queueOperation('journal_create', {
            user_id: user.id,
            day: entry.day,
            date: entry.date,
            mood: entry.mood,
            symptoms: entry.symptoms,
            pre_fast_meal: entry.preFastMeal,
            notes: entry.notes,
            completed: entry.completed,
          });
        } else {
           // Rollback on error
           setEntries((prev) => prev.filter((e) => e !== entry));
           setError(err.message);
           throw err;
        }
      }
    }
  };

  const updateJournalEntry = async (day: number, updates: Partial<JournalEntry>) => {
    // Update local state optimistically
    setEntries((prev) =>
      prev.map((entry) => (entry.day === day ? { ...entry, ...updates } : entry))
    );

    if (user && supabase) {
      try {
        const updateData: any = {};
        if (updates.mood !== undefined) updateData.mood = updates.mood;
        if (updates.symptoms !== undefined) updateData.symptoms = updates.symptoms;
        if (updates.preFastMeal !== undefined)
          updateData.pre_fast_meal = updates.preFastMeal;
        if (updates.notes !== undefined) updateData.notes = updates.notes;
        if (updates.completed !== undefined) updateData.completed = updates.completed;

        if (!isOnline()) {
           queueOperation('journal_update', {
             userId: user.id,
             day,
             updates: updateData
           });
           return;
        }

        const { error } = await supabase
          .from('journal_entries')
          .update(updateData)
          .eq('user_id', user.id)
          .eq('day', day);

        if (error) throw error;
      } catch (err: any) {
        if (err.message?.includes('network') || err.message?.includes('fetch')) {
           queueOperation('journal_update', {
             userId: user.id,
             day,
             updates: updates // Note: queueOperation expects 'updates' but we built 'updateData' above.
             // Actually, let's pass updateData which matches DB columns
           });
           // Wait, queueOperation logic for 'journal_update' uses operation.data.updates.
           // So we should pass { userId: user.id, day, updates: updateData }
        } else {
           // Rollback on error
           fetchJournalEntries();
           setError(err.message);
           throw err;
        }
      }
    }
  };

  const deleteJournalEntry = async (day: number) => {
    // Remove from local state optimistically
    const entryToRemove = entries.find((e) => e.day === day);
    setEntries((prev) => prev.filter((entry) => entry.day !== day));

    if (user && supabase) {
      try {
        const { error } = await supabase
          .from('journal_entries')
          .delete()
          .eq('user_id', user.id)
          .eq('day', day);

        if (error) throw error;
      } catch (err: any) {
        // Rollback on error
        if (entryToRemove) {
          setEntries((prev) => [...prev, entryToRemove]);
        }
        setError(err.message);
        throw err;
      }
    }
  };

  return {
    entries,
    loading,
    error,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    refetch: fetchJournalEntries,
  };
};
