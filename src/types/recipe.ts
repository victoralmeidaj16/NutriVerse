/**
 * Recipe-related type definitions
 */

import { NutritionInfo, HealthScore, CostScore } from './nutrition';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string; // 'g', 'ml', 'cup', 'tbsp', etc.
  category?: string; // 'protein', 'carb', 'vegetable', etc.
}

export interface CookingStep {
  id: string;
  order: number;
  instruction: string;
  duration?: number; // in seconds
  temperature?: number; // in celsius
  timerRequired?: boolean;
}

export interface ParsedRecipe {
  id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  steps: CookingStep[];
  servings: number;
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  totalTime?: number; // in minutes
  source?: string; // URL or source name
  imageUrl?: string;
}

export interface Swap {
  id: string;
  originalIngredient: Ingredient;
  swappedIngredient: Ingredient;
  reason: string; // Why this swap was made
  impact: {
    calories: number; // difference
    protein: number; // difference
    carbohydrates: number; // difference
    fats: number; // difference
  };
}

export interface RecipeVariant {
  id: string;
  name: string; // 'Original', 'Lean', 'High-Protein', 'Budget'
  recipe: ParsedRecipe;
  swaps: Swap[];
  nutrition: NutritionInfo;
  healthScore: HealthScore;
  costScore: CostScore;
  explanation?: string; // Overall explanation of changes
}

export interface Recipe {
  id: string;
  original: ParsedRecipe;
  variants: RecipeVariant[];
  createdAt: string;
  userId?: string;
  favorited?: boolean;
}

