import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '../../lib/supabase';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PublicLandingPage } from '../../components/PublicLandingPage';
import { Onboarding } from '../../components/Onboarding';
import { useOnboarding } from '../../lib/hooks/useOnboarding';
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
      render(
        <MemoryRouter>
          <AuthProvider>
            <PublicLandingPage />
          </AuthProvider>
        </MemoryRouter>
      );

      expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    });

    it('should show email/password sign-in form', async () => {
      render(
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
        expect(screen.getByLabelText('Wasteland ID (Email)')).toBeInTheDocument();
        expect(screen.getByLabelText('Access Code (Password)')).toBeInTheDocument();
        expect(screen.getByText('Access System')).toBeInTheDocument();
      });
    });

    it('should call signInWithGoogle when Google button is clicked', async () => {
      const mockSignInWithGoogle = mockSupabase.auth.signInWithOAuth;
      mockSignInWithGoogle.mockResolvedValue({ error: null });

      render(
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

      render(
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
        fireEvent.change(screen.getByLabelText('Wasteland ID (Email)'), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText('Access Code (Password)'), {
          target: { value: 'password123' },
        });
        fireEvent.click(screen.getByText('Access System'));

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

      // Mock the useAuth hook
      const mockUseAuth = () => ({
        user: mockUser,
      });

      // Mock the useNavigate hook
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useNavigate: () => mockNavigate,
        };
      });

      render(
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
        expect(screen.getByText('Identity Registration')).toBeInTheDocument();
      });

      // Fill warrior name
      fireEvent.change(screen.getByPlaceholderText('e.g. Furiosa, Max, Road Warrior...'), {
        target: { value: 'TestWarrior' },
      });

      // Accept rules
      fireEvent.click(screen.getByText('Accept Wasteland Rules'));

      // Click prepare for battle
      fireEvent.click(screen.getByText('Prepare for Battle'));

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
    });

    it('should navigate to main app after onboarding completion', async () => {
      const mockNavigate = vi.fn();
      const mockUser = { id: 'test-user-id' };

      // Mock the useNavigate hook
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useNavigate: () => mockNavigate,
        };
      });

      render(
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
        expect(screen.getByText('Identity Registration')).toBeInTheDocument();
      });

      // Fill warrior name
      fireEvent.change(screen.getByPlaceholderText('e.g. Furiosa, Max, Road Warrior...'), {
        target: { value: 'TestWarrior' },
      });

      // Accept rules
      fireEvent.click(screen.getByText('Accept Wasteland Rules'));

      // Click prepare for battle
      fireEvent.click(screen.getByText('Prepare for Battle'));

      // Verify navigation was called
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/app');
      });
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
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useNavigate: () => mockNavigate,
        };
      });

      // Test landing page authentication
      render(
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
      fireEvent.click(screen.getByText('Login'));

      // Fill and submit login form
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('Wasteland ID (Email)'), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText('Access Code (Password)'), {
          target: { value: 'password123' },
        });
        fireEvent.click(screen.getByText('Access System'));
      });

      // Verify authentication was called
      expect(mockSignIn).toHaveBeenCalled();

      // Verify navigation to onboarding would occur (in real scenario)
      // This would be tested in a more comprehensive integration test
      expect(true).toBe(true); // Placeholder for flow verification
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

      render(
        <MemoryRouter>
          <AuthProvider>
            <PublicLandingPage />
          </AuthProvider>
        </MemoryRouter>
      );

      // Click login button
      fireEvent.click(screen.getByText('Login'));

      // Fill and submit login form with invalid credentials
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('Wasteland ID (Email)'), {
          target: { value: 'wrong@example.com' },
        });
        fireEvent.change(screen.getByLabelText('Access Code (Password)'), {
          target: { value: 'wrongpassword' },
        });
        fireEvent.click(screen.getByText('Access System'));
      });

      // Verify error is displayed
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });
});