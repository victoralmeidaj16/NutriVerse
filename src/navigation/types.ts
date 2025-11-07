/**
 * Navigation type definitions
 */

export type RootStackParamList = {
  AuthStack: undefined;
  Login: undefined;
  SignUp: undefined;
  OnboardingStack: undefined;
  MainTabs: undefined;
  FitSwapModal?: { inputType?: 'text' | 'photo' | 'link'; initialValue?: string };
  RecipeDetailModal?: { recipeId: string; recipe?: any; nutrition?: any };
  CookingModeModal?: { recipeId: string; variantId?: string };
  PantryModeModal?: undefined;
  PreferencesModal?: undefined;
  GoalsModal?: undefined;
  RecipesHomeModal?: undefined;
  AIGeneratedRecipeModal?: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Objectives: undefined;
  Restrictions: undefined;
  SignUp: undefined;
  Login: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Explore?: { focusSearch?: boolean; initialQuery?: string };
  Profile: undefined;
};

