/**
 * Navigation type definitions
 */

export type RootStackParamList = {
  OnboardingStack: undefined;
  MainTabs: undefined;
  FitSwapModal?: { inputType?: 'text' | 'photo' | 'link'; initialValue?: string };
  RecipeDetailModal?: { recipeId: string };
  CookingModeModal?: { recipeId: string; variantId?: string };
  PantryModeModal?: undefined;
  PreferencesModal?: undefined;
  GoalsModal?: undefined;
  WeeklyPlanModal?: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Objectives: undefined;
  Restrictions: undefined;
  Preferences: undefined;
  HealthConnect: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Explore: undefined;
  Community: undefined;
  Profile: undefined;
};

