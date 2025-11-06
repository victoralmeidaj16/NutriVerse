/**
 * API-related type definitions
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiEndpoints {
  recipes: {
    search: string;
    getById: (id: string) => string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
  };
  user: {
    profile: string;
    goals: string;
    preferences: string;
    progress: string;
  };
  fitswap: {
    transform: string;
    parseRecipe: string;
    generateSwaps: string;
  };
}

