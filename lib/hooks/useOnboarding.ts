import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../supabase';
import { OnboardingData } from '../../components/Onboarding';

export interface UseOnboardingReturn {
  needsOnboarding: boolean;
  isCheckingOnboarding: boolean;
  handleOnboardingComplete: (data: OnboardingData) => Promise<void>;
}

export function useOnboarding(): UseOnboardingReturn {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (user && supabase) {
        setIsCheckingOnboarding(true);
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single();

          if (profile && !profile.onboarding_completed) {
            setNeedsOnboarding(true);
          } else {
            setNeedsOnboarding(false);
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          setNeedsOnboarding(false);
        } finally {
          setIsCheckingOnboarding(false);
        }
      } else {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, [user]);

  const handleOnboardingComplete = useCallback(async (data: OnboardingData) => {
    if (user && supabase) {
      await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_data: data,
        })
        .eq('id', user.id);

      setNeedsOnboarding(false);
      navigate('/app');
    }
  }, [user, navigate]);

  return {
    needsOnboarding,
    isCheckingOnboarding,
    handleOnboardingComplete
  };
}
