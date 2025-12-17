import { getRemainingMs, pauseFast, resumeFast } from '../../lib/timer';
import type { FastState } from '../../types';

describe('timer helpers', () => {
  it('calculates remaining time and handles pause/resume correctly', () => {
    const start = 1_700_000_000_000; // deterministic timestamp
    const durationHours = 1; // 1 hour = 3600000 ms
    let fast: FastState = {
      isActive: true,
      startTime: start,
      targetEndTime: start + durationHours * 3600 * 1000,
      durationHours,
      isPaused: false,
      pausedAt: null,
      totalPausedTime: 0,
    };

    // after 10 minutes
    const now1 = start + 10 * 60 * 1000;
    expect(getRemainingMs(fast, now1)).toBe(50 * 60 * 1000);

    // pause at now1
    fast = pauseFast(fast, now1);
    expect(fast.isPaused).toBe(true);
    expect(fast.pausedAt).toBe(now1);

    // resume after 5 minutes pause
    const now2 = now1 + 5 * 60 * 1000;
    fast = resumeFast(fast, now2);
    expect(fast.isPaused).toBe(false);
    expect(fast.totalPausedTime).toBe(5 * 60 * 1000);

    // remaining immediately after resume should still be 50 minutes because pause excluded
    const now3 = now2;
    expect(getRemainingMs(fast, now3)).toBe(50 * 60 * 1000);
  });
});
