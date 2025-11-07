/**
 * Onboarding Service - Save onboarding data to Firebase
 */

import { firebaseService } from '../firebase/firebaseService';
import { auth } from '../../config/firebase';
import { UserPreferences, UserGoal, Restriction } from '../../types/user';

export interface OnboardingData {
  goal?: UserGoal;
  restrictions?: Restriction[];
  budgetPerPortion?: number;
  averageCookingTime?: number;
  healthAppConnected?: boolean;
  healthAppType?: 'apple_health' | 'google_fit';
}

/**
 * Save onboarding data to Firebase
 */
export async function saveOnboardingData(data: OnboardingData): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('User not authenticated, cannot save onboarding data');
      // Don't throw error, just return - user will need to authenticate first
      return;
    }

    const userPath = `users/${user.uid}`;
    
    // Get existing profile or create new one
    const existingProfile = await firebaseService.getData(`${userPath}/profile`);
    
    const preferences: UserPreferences = {
      goal: data.goal || existingProfile?.preferences?.goal || 'general_health',
      restrictions: data.restrictions || existingProfile?.preferences?.restrictions || [],
      // Removed budgetPerPortion and averageCookingTime - no longer collected
      // Removed healthAppConnected and healthAppType - no longer collected
    };

    // Update profile with preferences
    const profileData = {
      ...existingProfile,
      preferences,
      updatedAt: new Date().toISOString(),
    };

    await firebaseService.setData(`${userPath}/profile`, profileData);
    
    // Mark onboarding as complete
    await firebaseService.setData(`${userPath}/onboardingComplete`, true);
    
    console.log('Onboarding data saved successfully');
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    throw error;
  }
}

/**
 * Get user onboarding data from Firebase
 */
export async function getOnboardingData(): Promise<OnboardingData | null> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    const profile = await firebaseService.getData(`users/${user.uid}/profile`);
    if (!profile || !profile.preferences) {
      return null;
    }

    return {
      goal: profile.preferences.goal,
      restrictions: profile.preferences.restrictions || [],
      budgetPerPortion: profile.preferences.budgetPerPortion,
      averageCookingTime: profile.preferences.averageCookingTime,
      healthAppConnected: profile.preferences.healthAppConnected,
      healthAppType: profile.preferences.healthAppType,
    };
  } catch (error) {
    console.error('Error getting onboarding data:', error);
    return null;
  }
}

/**
 * Check if onboarding is complete
 */
export async function isOnboardingComplete(): Promise<boolean> {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log('isOnboardingComplete: No user, returning false');
      return false;
    }

    const complete = await firebaseService.getData(`users/${user.uid}/onboardingComplete`);
    console.log(`isOnboardingComplete: User ${user.uid}, onboardingComplete value:`, complete);
    
    // If onboardingComplete is explicitly true, return true
    if (complete === true) {
      return true;
    }
    
    // If onboardingComplete is false or null, check if user has a profile
    // If user has a profile, they likely completed onboarding but the flag wasn't set
    const profile = await firebaseService.getData(`users/${user.uid}/profile`);
    if (profile && profile.name) {
      console.log(`isOnboardingComplete: User has profile but onboardingComplete is ${complete}, marking as complete`);
      // Mark as complete if user has profile
      await firebaseService.setData(`users/${user.uid}/onboardingComplete`, true);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

