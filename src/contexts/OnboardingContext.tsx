/**
 * Onboarding Context - Manages onboarding data across screens
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserGoal, Restriction } from '../types/user';
import { saveOnboardingData, OnboardingData } from '../services/user/onboardingService';

interface OnboardingContextType {
  goal: UserGoal | null;
  restrictions: Restriction[];
  setGoal: (goal: UserGoal) => void;
  setRestrictions: (restrictions: Restriction[]) => void;
  saveData: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [goal, setGoal] = useState<UserGoal | null>(null);
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);

  const saveData = async () => {
    const data: OnboardingData = {
      goal: goal || undefined,
      restrictions: restrictions.length > 0 ? restrictions : undefined,
    };
    await saveOnboardingData(data);
  };

  return (
    <OnboardingContext.Provider
      value={{
        goal,
        restrictions,
        setGoal,
        setRestrictions,
        saveData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}

