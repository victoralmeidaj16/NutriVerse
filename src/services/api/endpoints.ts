/**
 * API Endpoints - Centralized endpoint definitions
 */

export const API_ENDPOINTS = {
  // Recipes
  recipes: {
    search: '/recipes/search',
    getById: (id: string) => `/recipes/${id}`,
    create: '/recipes',
    update: (id: string) => `/recipes/${id}`,
    delete: (id: string) => `/recipes/${id}`,
    favorites: '/recipes/favorites',
  },
  
  // User
  user: {
    profile: '/user/profile',
    goals: '/user/goals',
    preferences: '/user/preferences',
    progress: '/user/progress',
    dailyProgress: (date: string) => `/user/progress/${date}`,
  },
  
  // FitSwap
  fitswap: {
    transform: '/fitswap/transform',
    parseRecipe: '/fitswap/parse',
    generateSwaps: '/fitswap/swaps',
  },
  
  // Community
  community: {
    feed: '/community/feed',
    challenges: '/community/challenges',
    posts: '/community/posts',
    createPost: '/community/posts',
  },
} as const;

