import type { FastState } from '../types';

/**
 * Returns the remaining milliseconds for a fast, taking pauses into account.
 * Defensive: returns 0 if start/target are not set.
 */
export function getRemainingMs(fast: FastState, now = Date.now()): number {
  if (!fast.startTime || !fast.durationHours) return 0;
  const durationMs = fast.durationHours * 3600 * 1000;
  const elapsed = Math.max(0, now - fast.startTime - (fast.totalPausedTime || 0));
  return Math.max(0, durationMs - elapsed);
}

/**
 * Pause: set pausedAt (timestamp) if not already paused.
 */
export function pauseFast(fast: FastState, now = Date.now()): FastState {
  if (fast.isPaused) return fast;
  return {
    ...fast,
    isPaused: true,
    pausedAt: now,
  };
}

/**
 * Resume: update totalPausedTime and clear pausedAt/isPaused.
 */
export function resumeFast(fast: FastState, now = Date.now()): FastState {
  if (!fast.isPaused || !fast.pausedAt) return fast;
  const newTotalPaused = (fast.totalPausedTime || 0) + (now - fast.pausedAt);
  return {
    ...fast,
    isPaused: false,
    pausedAt: null,
    totalPausedTime: newTotalPaused,
  };
}
