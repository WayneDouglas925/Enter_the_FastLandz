import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the supabase client; create the mock inside the factory to avoid hoisting errors
vi.mock('../../lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

import { markEasyModeComplete } from '../../lib/dayFeatures';
import { supabase } from '../../lib/supabase';

describe('markEasyModeComplete (RPC)', () => {
  beforeEach(() => {
    if ((supabase as any).rpc?.mockReset) {
      (supabase as any).rpc.mockReset();
    }
  });

  it('calls RPC with expected args and returns success on no error', async () => {
    (supabase as any).rpc.mockResolvedValue({ data: null, error: null });

    const res = await markEasyModeComplete('user-123');

    expect((supabase as any).rpc).toHaveBeenCalledWith('add_completed_difficulty', {
      p_user_id: 'user-123',
      p_diff: 'easy',
    });

    expect(res.success).toBe(true);
  });

  it('returns error when RPC returns an error', async () => {
    (supabase as any).rpc.mockResolvedValue({ data: null, error: { message: 'boom' } });

    const res = await markEasyModeComplete('user-456');

    expect(res.success).toBe(false);
    expect(res.error).toContain('boom');
  });
});
