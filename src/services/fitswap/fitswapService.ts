/**
 * FitSwap Service - Main service for recipe transformation
 */

import { ParsedRecipe, Recipe, RecipeVariant, Swap } from '../../types/recipe';
import { UserGoal, UserPreferences } from '../../types/user';
import { NutritionInfo, HealthScore, CostScore } from '../../types/nutrition';
import { parseRecipeFromText } from './recipeParser';
import { calculateRecipeNutrition, calculateHealthScore, calculateCostScore } from './nutritionCalculator';
import { generateSwaps, applySwaps } from './swapEngine';

/**
 * Transform a recipe based on user goal and preferences
 */
export async function transformRecipe(
  recipeText: string,
  goal: UserGoal,
  preferences?: UserPreferences
): Promise<Recipe> {
  // Parse recipe from text
  const parsedRecipe = parseRecipeFromText(recipeText);
  
  // Calculate original nutrition
  const originalNutrition = calculateRecipeNutrition(parsedRecipe.ingredients);
  const originalHealthScore = calculateHealthScore(originalNutrition);
  const originalCostScore = calculateCostScore(parsedRecipe.ingredients, preferences?.budgetPerPortion);
  
  // Create original variant
  const originalVariant: RecipeVariant = {
    id: 'original',
    name: 'Original',
    recipe: parsedRecipe,
    swaps: [],
    nutrition: originalNutrition,
    healthScore: originalHealthScore,
    costScore: originalCostScore,
  };
  
  // Generate variants based on goal
  const variants: RecipeVariant[] = [originalVariant];
  
  // Generate swaps for different goals
  if (goal === 'lose_weight') {
    const leanSwaps = generateSwaps(parsedRecipe.ingredients, 'lose_weight');
    const leanIngredients = applySwaps(parsedRecipe.ingredients, leanSwaps);
    const leanNutrition = calculateRecipeNutrition(leanIngredients);
    
    variants.push({
      id: 'lean',
      name: 'Lean',
      recipe: {
        ...parsedRecipe,
        ingredients: leanIngredients,
      },
      swaps: leanSwaps,
      nutrition: leanNutrition,
      healthScore: calculateHealthScore(leanNutrition),
      costScore: calculateCostScore(leanIngredients, preferences?.budgetPerPortion),
      explanation: 'Versão otimizada para perda de peso com menos calorias e mais proteína.',
    });
  }
  
  if (goal === 'gain_mass') {
    const highProteinSwaps = generateSwaps(parsedRecipe.ingredients, 'gain_mass');
    const highProteinIngredients = applySwaps(parsedRecipe.ingredients, highProteinSwaps);
    const highProteinNutrition = calculateRecipeNutrition(highProteinIngredients);
    
    variants.push({
      id: 'high_protein',
      name: 'High-Protein',
      recipe: {
        ...parsedRecipe,
        ingredients: highProteinIngredients,
      },
      swaps: highProteinSwaps,
      nutrition: highProteinNutrition,
      healthScore: calculateHealthScore(highProteinNutrition),
      costScore: calculateCostScore(highProteinIngredients, preferences?.budgetPerPortion),
      explanation: 'Versão rica em proteína para ganho de massa muscular.',
    });
  }
  
  // Budget variant (if budget preference exists)
  if (preferences?.budgetPerPortion) {
    const budgetSwaps = generateSwaps(parsedRecipe.ingredients, 'general_health');
    const budgetIngredients = applySwaps(parsedRecipe.ingredients, budgetSwaps);
    const budgetNutrition = calculateRecipeNutrition(budgetIngredients);
    
    variants.push({
      id: 'budget',
      name: 'Budget',
      recipe: {
        ...parsedRecipe,
        ingredients: budgetIngredients,
      },
      swaps: budgetSwaps,
      nutrition: budgetNutrition,
      healthScore: calculateHealthScore(budgetNutrition),
      costScore: calculateCostScore(budgetIngredients, preferences.budgetPerPortion),
      explanation: 'Versão otimizada para orçamento.',
    });
  }
  
  return {
    id: `recipe_${Date.now()}`,
    original: parsedRecipe,
    variants,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Transform recipe from image (placeholder for future implementation)
 */
export async function transformRecipeFromImage(
  imageUri: string,
  goal: UserGoal,
  preferences?: UserPreferences
): Promise<Recipe> {
  // In real implementation, this would use OpenAI Vision API
  // For now, return a mock recipe
  const mockRecipeText = 'Receita detectada da imagem\n\nIngredientes:\n- 200g de frango\n- 100g de arroz\n- 50g de legumes\n\nModo de preparo:\n1. Cozinhar o frango\n2. Preparar o arroz\n3. Refogar os legumes';
  
  return transformRecipe(mockRecipeText, goal, preferences);
}

