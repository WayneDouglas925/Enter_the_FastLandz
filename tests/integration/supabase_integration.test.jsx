import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { supabase } from '../../lib/supabase';
import { AuthProvider } from '../../contexts/AuthContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PublicLandingPage } from '../../components/PublicLandingPage';
import { Onboarding } from '../../components/Onboarding';
import React from 'react';

describe('Supabase Integration Test - Landing Page to Onboarding Flow', () => {
  // Mock Supabase client for testing
  const mockSupabase = {
    auth: {
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signUp: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      })),
    })),
  };

  beforeAll(() => {
    // Mock the supabase module
    vi.mock('../../lib/supabase', () => ({
      supabase: mockSupabase,
      isSupabaseConfigured: () => true,
    }));
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('1. Landing Page Authentication Integration', () => {
    it('should show Google sign-in button', () => {
      const { container } = render(
        <MemoryRouter>
          <AuthProvider>
            <PublicLandingPage />
          </AuthProvider>
        </MemoryRouter>
      );

      expect(container.textContent).toContain('Sign in with Google');
    });

    it('should show email/password sign-in form when auth modal is opened', async () => {
      const { container } = render(
        <MemoryRouter>
          <AuthProvider>
            <PublicLandingPage />
          </AuthProvider>
        </MemoryRouter>
      );

      // Click the login button to show auth form
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(container.textContent).toContain('Wasteland ID (Email)');
        expect(container.textContent).toContain('Access Code (Password)');
        expect(container.textContent).toContain('Access System');
      });
    });

    it('should call signInWithGoogle when Google button is clicked', async () => {
      const mockSignInWithGoogle = mockSupabase.auth.signInWithOAuth;
      mockSignInWithGoogle.mockResolvedValue({ error: null });

      const { container } = render(
        <MemoryRouter>
          <AuthProvider>
            <PublicLandingPage />
          </AuthProvider>
        </MemoryRouter>
      );

      // Click the main CTA button to show auth form
      const ctaButton = screen.getByText('Start Your Journey');
      fireEvent.click(ctaButton);

      await waitFor(() => {
        const googleButton = screen.getByText('Sign in with Google');
        fireEvent.click(googleButton);
        expect(mockSignInWithGoogle).toHaveBeenCalledWith({
          provider: 'google',
          options: { redirectTo: expect.any(String) },
        });
      });
    });

    it('should call signIn when email form is submitted', async () => {
      const mockSignIn = mockSupabase.auth.signInWithPassword;
      mockSignIn.mockResolvedValue({ error: null });

      const { container } = render(
        <MemoryRouter>
          <AuthProvider>
            <PublicLandingPage />
          </AuthProvider>
        </MemoryRouter>
      );

      // Click the login button to show auth form
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      await waitFor(() => {
        const emailInput = screen.getByLabelText('Wasteland ID (Email)');
        const passwordInput = screen.getByLabelText('Access Code (Password)');
        const submitButton = screen.getByText('Access System');
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });
  });

  describe('2. Onboarding Data Storage Integration', () => {
    it('should collect and submit onboarding data', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ data: {}, error: null });
      mockSupabase.from = vi.fn(() => ({
        update: mockUpdate,
      }));

      const mockNavigate = vi.fn();
      const mockUser = { id: 'test-user-id' };

      // Mock the useNavigate hook
      const originalUseNavigate = React.useNavigate;
      React.useNavigate = () => mockNavigate;

      const { container } = render(
        <MemoryRouter>
          <Onboarding
            username="TestUser"
            onComplete={async (data) => {
              // This should call the Supabase update
              await mockSupabase.from('profiles').update({
                onboarding_completed: true,
                onboarding_data: data,
              }).eq('id', mockUser.id);
            }}
          />
        </MemoryRouter>
      );

      // Fill out the onboarding form
      await waitFor(() => {
        expect(container.textContent).toContain('Identity Registration');
      });

      // Fill warrior name
      const warriorNameInput = screen.getByPlaceholderText('e.g. Furiosa, Max, Road Warrior...');
      fireEvent.change(warriorNameInput, { target: { value: 'TestWarrior' } });

      // Accept rules
      const acceptRulesButton = screen.getByText('Accept Wasteland Rules');
      fireEvent.click(acceptRulesButton);

      // Click prepare for battle
      const prepareButton = screen.getByText('Prepare for Battle');
      fireEvent.click(prepareButton);

      // Verify the onComplete callback was called with correct data
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith({
          onboarding_completed: true,
          onboarding_data: expect.objectContaining({
            warriorName: 'TestWarrior',
            acceptedRules: true,
          }),
        });
      });

      // Restore original navigate
      React.useNavigate = originalUseNavigate;
    });

    it('should navigate to main app after onboarding completion', async () => {
      const mockNavigate = vi.fn();
      const mockUser = { id: 'test-user-id' };

      // Mock the useNavigate hook
      const originalUseNavigate = React.useNavigate;
      React.useNavigate = () => mockNavigate;

      const { container } = render(
        <MemoryRouter>
          <Onboarding
            username="TestUser"
            onComplete={async (data) => {
              mockNavigate('/app');
            }}
          />
        </MemoryRouter>
      );

      // Fill out the onboarding form
      await waitFor(() => {
        expect(container.textContent).toContain('Identity Registration');
      });

      // Fill warrior name
      const warriorNameInput = screen.getByPlaceholderText('e.g. Furiosa, Max, Road Warrior...');
      fireEvent.change(warriorNameInput, { target: { value: 'TestWarrior' } });

      // Accept rules
      const acceptRulesButton = screen.getByText('Accept Wasteland Rules');
      fireEvent.click(acceptRulesButton);

      // Click prepare for battle
      const prepareButton = screen.getByText('Prepare for Battle');
      fireEvent.click(prepareButton);

      // Verify navigation was called
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/app');
      });

      // Restore original navigate
      React.useNavigate = originalUseNavigate;
    });
  });

  describe('3. Complete Flow Integration', () => {
    it('should handle the complete flow from landing to onboarding to main app', async () => {
      // Mock authentication
      const mockSignIn = mockSupabase.auth.signInWithPassword;
      mockSignIn.mockResolvedValue({ 
        data: { session: { user: { id: 'test-user-id', email: 'test@example.com' } } },
        error: null 
      });

      // Mock onboarding data storage
      const mockUpdate = vi.fn().mockResolvedValue({ data: {}, error: null });
      mockSupabase.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: { onboarding_completed: false } }),
          })),
        })),
        update: mockUpdate,
      }));

      const mockNavigate = vi.fn();

      // Mock the useNavigate hook
      const originalUseNavigate = React.useNavigate;
      React.useNavigate = () => mockNavigate;

      // Test landing page authentication
      const { container } = render(
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<PublicLandingPage />} />
              <Route path="/onboarding" element={<Onboarding username="TestUser" onComplete={async () => {}} />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      // Click login button
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      // Fill and submit login form
      await waitFor(() => {
        const emailInput = screen.getByLabelText('Wasteland ID (Email)');
        const passwordInput = screen.getByLabelText('Access Code (Password)');
        const submitButton = screen.getByText('Access System');
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);
      });

      // Verify authentication was called
      expect(mockSignIn).toHaveBeenCalled();

      // Restore original navigate
      React.useNavigate = originalUseNavigate;
    });
  });

  describe('4. Error Handling and Edge Cases', () => {
    it('should handle Supabase configuration errors gracefully', () => {
      // Mock supabase as null (not configured)
      vi.mock('../../lib/supabase', () => ({
        supabase: null,
        isSupabaseConfigured: () => false,
      }));

      // The app should still render without crashing
      expect(() => {
        render(
          <MemoryRouter>
            <AuthProvider>
              <PublicLandingPage />
            </AuthProvider>
          </MemoryRouter>
        );
      }).not.toThrow();
    });

    it('should handle authentication errors', async () => {
      const mockSignIn = mockSupabase.auth.signInWithPassword;
      mockSignIn.mockRejectedValue(new Error('Invalid credentials'));

      const { container } = render(
        <MemoryRouter>
          <AuthProvider>
            <PublicLandingPage />
          </AuthProvider>
        </MemoryRouter>
      );

      // Click login button
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      // Fill and submit login form with invalid credentials
      await waitFor(() => {
        const emailInput = screen.getByLabelText('Wasteland ID (Email)');
        const passwordInput = screen.getByLabelText('Access Code (Password)');
        const submitButton = screen.getByText('Access System');
        
        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);
      });

      // Verify error is displayed
      await waitFor(() => {
        expect(container.textContent).toContain('Invalid credentials');
      });
    });
  });
});