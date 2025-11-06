/**
 * User-related type definitions
 */

export type UserGoal = 'lose_weight' | 'gain_mass' | 'general_health';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type Restriction = 
  | 'peanut'
  | 'gluten'
  | 'lactose'
  | 'soy'
  | 'egg'
  | 'fish'
  | 'shellfish'
  | 'tree_nut'
  | 'vegetarian'
  | 'vegan'
  | 'keto'
  | 'paleo';

export interface UserPreferences {
  goal: UserGoal;
  restrictions: Restriction[];
  budgetPerPortion?: number; // in local currency
  averageCookingTime?: number; // in minutes
  healthAppConnected?: boolean;
  healthAppType?: 'apple_health' | 'google_fit';
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  weight?: number; // in kg
  height?: number; // in cm
  age?: number;
  gender?: 'male' | 'female' | 'other';
  activityLevel?: ActivityLevel;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  profile: UserProfile;
  tdee?: number; // Total Daily Energy Expenditure
  macroTargets?: MacroTargets;
}

