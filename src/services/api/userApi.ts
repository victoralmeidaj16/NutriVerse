/**
 * User API - User/profile related API calls
 * Currently uses mock implementations
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import { UserProfile, UserPreferences } from '../../types/user';
import { DailyProgress, MacroTargets } from '../../types/nutrition';
import { ApiResponse } from '../../types/api';

export const userApi = {
  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    // Mock implementation - uses local storage
    throw new Error('Use storageService.getUserProfile() instead');
    
    // Real implementation:
    // return apiClient.get<ApiResponse<UserProfile>>(API_ENDPOINTS.user.profile)
    //   .then(res => res.data);
  },

  /**
   * Update user profile
   */
  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    // Mock implementation
    throw new Error('Not implemented');
    
    // Real implementation:
    // return apiClient.put<ApiResponse<UserProfile>>(API_ENDPOINTS.user.profile, profile)
    //   .then(res => res.data);
  },

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    // Mock implementation - uses local storage
    throw new Error('Use storageService.getUserPreferences() instead');
    
    // Real implementation:
    // return apiClient.get<ApiResponse<UserPreferences>>(API_ENDPOINTS.user.preferences)
    //   .then(res => res.data);
  },

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    // Mock implementation
    throw new Error('Not implemented');
    
    // Real implementation:
    // return apiClient.put<ApiResponse<UserPreferences>>(API_ENDPOINTS.user.preferences, preferences)
    //   .then(res => res.data);
  },

  /**
   * Get daily progress
   */
  async getDailyProgress(date?: string): Promise<DailyProgress> {
    // Mock implementation
    throw new Error('Not implemented');
    
    // Real implementation:
    // const endpoint = date 
    //   ? API_ENDPOINTS.user.dailyProgress(date)
    //   : API_ENDPOINTS.user.progress;
    // return apiClient.get<ApiResponse<DailyProgress>>(endpoint)
    //   .then(res => res.data);
  },
};

