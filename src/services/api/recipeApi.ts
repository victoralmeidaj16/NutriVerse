/**
 * Recipe API - Recipe-related API calls
 * Currently uses mock implementations
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import { Recipe, ParsedRecipe } from '../../types/recipe';
import { ApiResponse, PaginatedResponse } from '../../types/api';

export const recipeApi = {
  /**
   * Search recipes
   */
  async search(query: string, limit: number = 20): Promise<PaginatedResponse<Recipe>> {
    // Mock implementation
    return {
      data: [],
      pagination: {
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
    
    // Real implementation:
    // return apiClient.get<PaginatedResponse<Recipe>>(
    //   `${API_ENDPOINTS.recipes.search}?q=${encodeURIComponent(query)}&limit=${limit}`
    // );
  },

  /**
   * Get recipe by ID
   */
  async getById(id: string): Promise<Recipe> {
    // Mock implementation
    throw new Error('Recipe not found');
    
    // Real implementation:
    // return apiClient.get<ApiResponse<Recipe>>(API_ENDPOINTS.recipes.getById(id))
    //   .then(res => res.data);
  },

  /**
   * Create recipe
   */
  async create(recipe: Partial<Recipe>): Promise<Recipe> {
    // Mock implementation
    throw new Error('Not implemented');
    
    // Real implementation:
    // return apiClient.post<ApiResponse<Recipe>>(API_ENDPOINTS.recipes.create, recipe)
    //   .then(res => res.data);
  },

  /**
   * Get favorite recipes
   */
  async getFavorites(): Promise<Recipe[]> {
    // Mock implementation
    return [];
    
    // Real implementation:
    // return apiClient.get<ApiResponse<Recipe[]>>(API_ENDPOINTS.recipes.favorites)
    //   .then(res => res.data);
  },
};

