export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Pragmatic client-side validation — keep strict validation on the server.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
};
