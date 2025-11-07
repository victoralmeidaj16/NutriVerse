/**
 * Storage service using AsyncStorage
 * Handles persistence of user data, preferences, and app state
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, UserPreferences } from '../../types/user';
import { Recipe } from '../../types/recipe';

const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: '@nutriverse:onboarding_complete',
  USER_PROFILE: '@nutriverse:user_profile',
  USER_PREFERENCES: '@nutriverse:user_preferences',
  FAVORITE_RECIPES: '@nutriverse:favorite_recipes',
  RECENT_SEARCHES: '@nutriverse:recent_searches',
  GENERATED_RECIPES_HISTORY: '@nutriverse:generated_recipes_history',
  DAILY_PROGRESS: '@nutriverse:daily_progress',
  FITZAR_IMAGE_URL: '@nutriverse:fitzar_image_url',
  FITZAR_IMAGE_TIMESTAMP: '@nutriverse:fitzar_image_timestamp',
} as const;

class StorageService {
  // Onboarding
  async setOnboardingComplete(complete: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, JSON.stringify(complete));
    } catch (error) {
      console.error('Error setting onboarding complete:', error);
      throw error;
    }
  }

  async getOnboardingComplete(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
      return value ? JSON.parse(value) : false;
    } catch (error) {
      console.error('Error getting onboarding complete:', error);
      return false;
    }
  }

  // User Profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // User Preferences
  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }

  async getUserPreferences(): Promise<UserPreferences | null> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }

  // Favorite Recipes
  async getFavoriteRecipes(): Promise<string[]> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITE_RECIPES);
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting favorite recipes:', error);
      return [];
    }
  }

  async addFavoriteRecipe(recipeId: string): Promise<void> {
    try {
      const favorites = await this.getFavoriteRecipes();
      if (!favorites.includes(recipeId)) {
        favorites.push(recipeId);
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_RECIPES, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite recipe:', error);
      throw error;
    }
  }

  async removeFavoriteRecipe(recipeId: string): Promise<void> {
    try {
      const favorites = await this.getFavoriteRecipes();
      const filtered = favorites.filter(id => id !== recipeId);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_RECIPES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing favorite recipe:', error);
      throw error;
    }
  }

  // Recent Searches
  async getRecentSearches(): Promise<string[]> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting recent searches:', error);
      return [];
    }
  }

  async addRecentSearch(query: string): Promise<void> {
    try {
      const searches = await this.getRecentSearches();
      const filtered = searches.filter(s => s !== query);
      const updated = [query, ...filtered].slice(0, 10); // Keep last 10
      await AsyncStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
    } catch (error) {
      console.error('Error adding recent search:', error);
      throw error;
    }
  }

  // Generated Recipes History
  async getGeneratedRecipesHistory(): Promise<Recipe[]> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.GENERATED_RECIPES_HISTORY);
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting generated recipes history:', error);
      return [];
    }
  }

  async addGeneratedRecipe(recipe: Recipe, searchQuery: string): Promise<void> {
    try {
      const history = await this.getGeneratedRecipesHistory();
      const recipeWithMetadata = {
        ...recipe,
        searchQuery,
        generatedAt: new Date().toISOString(),
      };
      // Remove if already exists (by id)
      const filtered = history.filter(r => r.id !== recipe.id);
      // Add to beginning and keep last 50
      const updated = [recipeWithMetadata, ...filtered].slice(0, 50);
      await AsyncStorage.setItem(STORAGE_KEYS.GENERATED_RECIPES_HISTORY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error adding generated recipe:', error);
      throw error;
    }
  }

  async clearGeneratedRecipesHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.GENERATED_RECIPES_HISTORY);
    } catch (error) {
      console.error('Error clearing generated recipes history:', error);
      throw error;
    }
  }

  // Fitzar Image Cache
  async getFitzarImage(): Promise<string | null> {
    try {
      const url = await AsyncStorage.getItem(STORAGE_KEYS.FITZAR_IMAGE_URL);
      const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.FITZAR_IMAGE_TIMESTAMP);
      
      if (url && timestamp) {
        const imageAge = Date.now() - parseInt(timestamp, 10);
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        
        // Return cached image if less than 1 week old
        if (imageAge < oneWeek) {
          return url;
        } else {
          // Clear expired cache
          await this.clearFitzarImage();
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting fitzar image:', error);
      return null;
    }
  }

  async saveFitzarImage(imageUrl: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FITZAR_IMAGE_URL, imageUrl);
      await AsyncStorage.setItem(STORAGE_KEYS.FITZAR_IMAGE_TIMESTAMP, Date.now().toString());
    } catch (error) {
      console.error('Error saving fitzar image:', error);
      throw error;
    }
  }

  async clearFitzarImage(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.FITZAR_IMAGE_URL,
        STORAGE_KEYS.FITZAR_IMAGE_TIMESTAMP,
      ]);
    } catch (error) {
      console.error('Error clearing fitzar image:', error);
      throw error;
    }
  }

  // Clear all data (for logout/reset)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
export default storageService;

