import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { TrendingUp, Clock, Target, Flame, Calendar, Award, Zap } from 'lucide-react';

interface Stats {
  totalFasts: number;
  completedFasts: number;
  failedFasts: number;
  successRate: number;
  totalHoursFasted: number;
  longestFast: number;
  currentStreak: number;
  bestStreak: number;
  averageFastDuration: number;
}

export const StatsView: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalFasts: 0,
    completedFasts: 0,
    failedFasts: 0,
    successRate: 0,
    totalHoursFasted: 0,
    longestFast: 0,
    currentStreak: 0,
    bestStreak: 0,
    averageFastDuration: 0,
  });
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (user && supabase) {
      fetchStats();
      fetchProgress();
    } else {
      // Fallback to localStorage calculations
      calculateLocalStats();
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user || !supabase) return;

    try {
      const { data } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProgress(data);
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    }
  };

  const fetchStats = async () => {
    if (!user || !supabase) return;

    try {
      // Fetch all fast sessions
      const { data: sessions, error } = await supabase
        .from('fast_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (sessions) {
        const completed = sessions.filter((s) => s.completed);
        const failed = sessions.filter((s) => s.failed);

        // Calculate total hours fasted
        const totalHours = completed.reduce((sum, s) => {
          const start = new Date(s.start_time).getTime();
          const end = s.actual_end_time
            ? new Date(s.actual_end_time).getTime()
            : new Date(s.target_end_time).getTime();
          const duration = (end - start - s.total_paused_time) / (1000 * 60 * 60);
          return sum + duration;
        }, 0);

        // Find longest fast
        const longest = completed.reduce((max, s) => {
          const start = new Date(s.start_time).getTime();
          const end = s.actual_end_time
            ? new Date(s.actual_end_time).getTime()
            : new Date(s.target_end_time).getTime();
          const duration = (end - start - s.total_paused_time) / (1000 * 60 * 60);
          return Math.max(max, duration);
        }, 0);

        // Calculate streaks
        const { current, best } = calculateStreaks(sessions);

        // Calculate average
        const avgDuration =
          completed.length > 0 ? totalHours / completed.length : 0;

        setStats({
          totalFasts: sessions.length,
          completedFasts: completed.length,
          failedFasts: failed.length,
          successRate:
            sessions.length > 0
              ? Math.round((completed.length / sessions.length) * 100)
              : 0,
          totalHoursFasted: Math.round(totalHours * 10) / 10,
          longestFast: Math.round(longest * 10) / 10,
          currentStreak: current,
          bestStreak: best,
          averageFastDuration: Math.round(avgDuration * 10) / 10,
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreaks = (sessions: any[]) => {
    const completed = sessions
      .filter((s) => s.completed)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    completed.forEach((session) => {
      const sessionDate = new Date(session.created_at);

      if (lastDate) {
        const daysDiff = Math.floor(
          (sessionDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff <= 1) {
          tempStreak++;
        } else {
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }

      lastDate = sessionDate;
    });

    bestStreak = Math.max(bestStreak, tempStreak);

    // Current streak is the last consecutive streak if it's recent
    if (lastDate) {
      const daysSinceLastFast = Math.floor(
        (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      currentStreak = daysSinceLastFast <= 1 ? tempStreak : 0;
    }

    return { current: currentStreak, best: bestStreak };
  };

  const calculateLocalStats = () => {
    // Fallback to localStorage
    const progressData = localStorage.getItem('fastlandz_progress');
    if (progressData) {
      const progress = JSON.parse(progressData);
      setStats({
        totalFasts: progress.completedDays.length + progress.failedDays.length,
        completedFasts: progress.completedDays.length,
        failedFasts: progress.failedDays.length,
        successRate:
          progress.completedDays.length + progress.failedDays.length > 0
            ? Math.round(
                (progress.completedDays.length /
                  (progress.completedDays.length + progress.failedDays.length)) *
                  100
              )
            : 0,
        totalHoursFasted: 0, // Can't calculate from localStorage
        longestFast: 0,
        currentStreak: progress.completedDays.length,
        bestStreak: progress.completedDays.length,
        averageFastDuration: 0,
      });
      setProgress(progress);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-8 pb-24 animate-fade-in">
        <div className="text-center text-stone-500 font-mono">
          <div className="animate-pulse">Calculating statistics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 pb-24 animate-fade-in">
      {/* Header */}
      <div className="border-l-4 border-dust pl-4 mb-8">
        <h2 className="font-display text-3xl md:text-4xl text-white uppercase">Statistics</h2>
        <p className="text-stone-400 font-body">Your Fasting Journey Analytics</p>
      </div>

      {/* Progress Summary */}
      {progress && (
        <div className="bg-stone-900/50 border border-stone-800 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl text-dust uppercase">Challenge Progress</h3>
            <span className="text-stone-600 text-xs font-mono">7-Day Journey</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isCompleted = progress.completed_days?.includes(day) || progress.completedDays?.includes(day);
              const isFailed = progress.failed_days?.includes(day) || progress.failedDays?.includes(day);
              const isCurrent = day === (progress.current_day || progress.currentDay);

              return (
                <div
                  key={day}
                  className={`aspect-square flex items-center justify-center font-display text-lg border-2 ${
                    isCompleted
                      ? 'bg-toxic/20 border-toxic text-toxic'
                      : isFailed
                      ? 'bg-blood/20 border-blood text-blood'
                      : isCurrent
                      ? 'bg-dust/20 border-dust text-dust'
                      : 'bg-stone-900 border-stone-800 text-stone-600'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Success Rate */}
        <div className="bg-stone-900/50 border border-stone-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-toxic" />
            <span className="text-xs text-stone-600 uppercase font-mono">Success Rate</span>
          </div>
          <div className="text-4xl font-display text-white mb-2">{stats.successRate}%</div>
          <p className="text-stone-500 text-sm">
            {stats.completedFasts} / {stats.totalFasts} fasts completed
          </p>
        </div>

        {/* Total Hours */}
        <div className="bg-stone-900/50 border border-stone-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-dust" />
            <span className="text-xs text-stone-600 uppercase font-mono">Total Hours</span>
          </div>
          <div className="text-4xl font-display text-white mb-2">{stats.totalHoursFasted}h</div>
          <p className="text-stone-500 text-sm">Time spent fasting</p>
        </div>

        {/* Longest Fast */}
        <div className="bg-stone-900/50 border border-stone-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-rust" />
            <span className="text-xs text-stone-600 uppercase font-mono">Longest Fast</span>
          </div>
          <div className="text-4xl font-display text-white mb-2">{stats.longestFast}h</div>
          <p className="text-stone-500 text-sm">Personal record</p>
        </div>

        {/* Current Streak */}
        <div className="bg-stone-900/50 border border-stone-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <Flame className="w-8 h-8 text-rust" />
            <span className="text-xs text-stone-600 uppercase font-mono">Current Streak</span>
          </div>
          <div className="text-4xl font-display text-white mb-2">{stats.currentStreak}</div>
          <p className="text-stone-500 text-sm">Days in a row</p>
        </div>

        {/* Best Streak */}
        <div className="bg-stone-900/50 border border-stone-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-toxic" />
            <span className="text-xs text-stone-600 uppercase font-mono">Best Streak</span>
          </div>
          <div className="text-4xl font-display text-white mb-2">{stats.bestStreak}</div>
          <p className="text-stone-500 text-sm">Longest consecutive</p>
        </div>

        {/* Average Duration */}
        <div className="bg-stone-900/50 border border-stone-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-dust" />
            <span className="text-xs text-stone-600 uppercase font-mono">Average Fast</span>
          </div>
          <div className="text-4xl font-display text-white mb-2">
            {stats.averageFastDuration}h
          </div>
          <p className="text-stone-500 text-sm">Typical duration</p>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-stone-900/50 border border-stone-800 p-6">
        <h3 className="font-display text-xl text-white uppercase mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* First Fast */}
          <div
            className={`p-4 border-2 text-center ${
              stats.completedFasts >= 1
                ? 'border-toxic bg-toxic/10'
                : 'border-stone-800 bg-stone-900 opacity-50'
            }`}
          >
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-xs uppercase font-bold text-stone-400">First Fast</p>
          </div>

          {/* Week Warrior */}
          <div
            className={`p-4 border-2 text-center ${
              stats.completedFasts >= 7
                ? 'border-toxic bg-toxic/10'
                : 'border-stone-800 bg-stone-900 opacity-50'
            }`}
          >
            <div className="text-3xl mb-2">⚔️</div>
            <p className="text-xs uppercase font-bold text-stone-400">Week Warrior</p>
          </div>

          {/* Streak Master */}
          <div
            className={`p-4 border-2 text-center ${
              stats.bestStreak >= 7
                ? 'border-toxic bg-toxic/10'
                : 'border-stone-800 bg-stone-900 opacity-50'
            }`}
          >
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-xs uppercase font-bold text-stone-400">Streak Master</p>
          </div>

          {/* 100 Hours */}
          <div
            className={`p-4 border-2 text-center ${
              stats.totalHoursFasted >= 100
                ? 'border-toxic bg-toxic/10'
                : 'border-stone-800 bg-stone-900 opacity-50'
            }`}
          >
            <div className="text-3xl mb-2">⏰</div>
            <p className="text-xs uppercase font-bold text-stone-400">100 Hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};
