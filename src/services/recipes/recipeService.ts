/**
 * Recipe Service - Fetch recipes from Firebase
 */

import { firebaseService } from '../firebase/firebaseService';
import { Recipe } from '../../types/recipe';
import { UserGoal } from '../../types/user';

/**
 * Get base recipes for a specific goal
 */
export async function getBaseRecipesForGoal(goal: UserGoal): Promise<Recipe[]> {
  try {
    const recipesData = await firebaseService.getData(`recipes/${goal}`);
    
    if (!recipesData) {
      return [];
    }

    // Convert object to array
    const recipes: Recipe[] = Object.values(recipesData);
    
    // Sort by creation date (newest first)
    return recipes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching base recipes:', error);
    return [];
  }
}

/**
 * Get all base recipes (for admin/debugging)
 */
export async function getAllBaseRecipes(): Promise<Recipe[]> {
  const goals: UserGoal[] = ['lose_weight', 'gain_mass', 'general_health'];
  const allRecipes: Recipe[] = [];

  for (const goal of goals) {
    const recipes = await getBaseRecipesForGoal(goal);
    allRecipes.push(...recipes);
  }

  return allRecipes;
}

/**
 * Get a specific recipe by ID
 */
export async function getRecipeById(recipeId: string, goal?: UserGoal): Promise<Recipe | null> {
  try {
    if (goal) {
      const recipe = await firebaseService.getData(`recipes/${goal}/${recipeId}`);
      return recipe || null;
    }

    // Search across all goals
    const goals: UserGoal[] = ['lose_weight', 'gain_mass', 'general_health'];
    for (const g of goals) {
      const recipe = await firebaseService.getData(`recipes/${g}/${recipeId}`);
      if (recipe) return recipe;
    }

    return null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

/**
 * Get goal section title for display
 */
export function getGoalSectionTitle(goal: UserGoal): string {
  switch (goal) {
    case 'lose_weight':
      return 'Receitas para perder peso';
    case 'gain_mass':
      return 'Receitas para ganhar massa';
    case 'general_health':
    default:
      return 'Receitas saudáveis';
  }
}

