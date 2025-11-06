/**
 * FitSwap API - FitSwap transformation API calls
 * Currently uses mock implementations
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import { Recipe } from '../../types/recipe';
import { UserGoal } from '../../types/user';
import { ApiResponse } from '../../types/api';

export const fitswapApi = {
  /**
   * Transform recipe
   */
  async transform(
    recipeText: string,
    goal: UserGoal,
    preferences?: unknown
  ): Promise<Recipe> {
    // Mock implementation - uses local service
    throw new Error('Use fitswapService.transformRecipe() instead');
    
    // Real implementation:
    // return apiClient.post<ApiResponse<Recipe>>(
    //   API_ENDPOINTS.fitswap.transform,
    //   { recipeText, goal, preferences }
    // ).then(res => res.data);
  },

  /**
   * Parse recipe from text
   */
  async parseRecipe(text: string): Promise<unknown> {
    // Mock implementation
    throw new Error('Not implemented');
    
    // Real implementation:
    // return apiClient.post(API_ENDPOINTS.fitswap.parseRecipe, { text })
    //   .then(res => res.data);
  },
};

