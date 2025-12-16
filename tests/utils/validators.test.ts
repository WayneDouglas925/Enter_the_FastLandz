import { describe, it, expect } from 'vitest';
import { isValidEmail } from '../../utils/validators';

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail(' user+tag@sub.domain.co ')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('no-at-symbol')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('   ')).toBe(false);
  });
});
