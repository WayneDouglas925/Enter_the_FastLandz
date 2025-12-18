import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PublicLandingPage } from './components/PublicLandingPage';
import { WelcomePage } from './components/WelcomePage';
import { AuthModal } from './components/AuthModal';
import { Onboarding } from './components/Onboarding';
import { useAuth } from './contexts/AuthContext';
import { useOnboarding } from './lib/hooks/useOnboarding';
import { ProtectedRoute, MainAppRoute } from './components/routes';

const App: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleOnboardingComplete } = useOnboarding();

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route
        path="/"
        element={
          <PublicLandingPage />
        }
      />

      {/* Welcome Page - Shows after signup */}
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomePage onContinue={() => navigate('/onboarding')} />
          </ProtectedRoute>
        }
      />

      {/* Onboarding - 3-step setup */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding
              username={user?.user_metadata?.username || user?.email?.split('@')[0] || 'Survivor'}
              onComplete={handleOnboardingComplete}
            />
          </ProtectedRoute>
        }
      />

      {/* Main App */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <MainAppRoute />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
