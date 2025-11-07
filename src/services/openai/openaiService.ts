/**
 * OpenAI Service - Integration with backend API
 * Uses backend proxy to protect API key
 */

import { ParsedRecipe } from '../../types/recipe';
import { Swap } from '../../types/recipe';

// Use environment variable or default to Render backend
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://nutriversee.onrender.com';

/**
 * Parse recipe from text using backend API
 */
export async function parseRecipeFromText(text: string): Promise<ParsedRecipe> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/parse-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to parse recipe');
    }

    const data = await response.json();
    
    // Transform backend response to ParsedRecipe format
    const recipe = data.recipe;
    return {
      id: `recipe_${Date.now()}`,
      title: recipe.title || 'Receita sem título',
      description: recipe.description,
      ingredients: recipe.ingredients?.map((ing: any, idx: number) => ({
        id: `ing_${idx}`,
        name: ing.name,
        amount: ing.amount || 0,
        unit: ing.unit || 'g',
        category: ing.category,
      })) || [],
      steps: recipe.steps?.map((step: any, idx: number) => ({
        id: `step_${idx}`,
        order: step.order || idx + 1,
        instruction: step.instruction,
        duration: step.duration,
        temperature: step.temperature,
        timerRequired: step.timerRequired,
      })) || [],
      servings: recipe.servings || 4,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: (recipe.prepTime || 0) + (recipe.cookTime || 0),
    };
  } catch (error) {
    console.error('Error parsing recipe from text:', error);
    // Fallback to local parser
    const { parseRecipeFromText: localParse } = await import('../fitswap/recipeParser');
    return localParse(text);
  }
}

/**
 * Parse recipe from image using backend API
 */
export async function parseRecipeFromImage(imageUri: string): Promise<ParsedRecipe> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/parse-recipe-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: imageUri }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to parse recipe from image');
    }

    const data = await response.json();
    
    // Transform backend response to ParsedRecipe format
    const recipe = data.recipe;
    return {
      id: `recipe_${Date.now()}`,
      title: recipe.title || 'Receita detectada da imagem',
      description: recipe.description,
      ingredients: recipe.ingredients?.map((ing: any, idx: number) => ({
        id: `ing_${idx}`,
        name: ing.name,
        amount: ing.amount || 0,
        unit: ing.unit || 'g',
        category: ing.category,
      })) || [],
      steps: recipe.steps?.map((step: any, idx: number) => ({
        id: `step_${idx}`,
        order: step.order || idx + 1,
        instruction: step.instruction,
        duration: step.duration,
        temperature: step.temperature,
        timerRequired: step.timerRequired,
      })) || [],
      servings: recipe.servings || 4,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: (recipe.prepTime || 0) + (recipe.cookTime || 0),
    };
  } catch (error) {
    console.error('Error parsing recipe from image:', error);
    // Return mock recipe as fallback
    return {
      id: `recipe_${Date.now()}`,
      title: 'Receita detectada da imagem',
      ingredients: [
        { id: '1', name: 'Ingrediente 1', amount: 200, unit: 'g' },
        { id: '2', name: 'Ingrediente 2', amount: 100, unit: 'g' },
      ],
      steps: [
        { id: '1', order: 1, instruction: 'Preparar ingredientes' },
        { id: '2', order: 2, instruction: 'Cozinhar conforme imagem' },
      ],
      servings: 4,
    };
  }
}

/**
 * Generate swaps using backend API
 */
export async function generateSwaps(
  recipe: ParsedRecipe,
  goal: string
): Promise<Swap[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-swaps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipe,
        goal,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate swaps');
    }

    const data = await response.json();
    
    // Transform backend response to Swap format
    return data.swaps?.map((swap: any, idx: number) => ({
      id: `swap_${idx}`,
      originalIngredient: {
        id: `orig_${idx}`,
        name: swap.originalIngredient?.name || '',
        amount: swap.originalIngredient?.amount || 0,
        unit: swap.originalIngredient?.unit || 'g',
      },
      swappedIngredient: {
        id: `swapped_${idx}`,
        name: swap.swappedIngredient?.name || '',
        amount: swap.swappedIngredient?.amount || 0,
        unit: swap.swappedIngredient?.unit || 'g',
      },
      reason: swap.reason || 'Esta troca melhora o perfil nutricional da receita.',
      impact: {
        calories: 0, // TODO: Calculate from nutrition database
        protein: 0,
        carbohydrates: 0,
        fats: 0,
      },
    })) || [];
  } catch (error) {
    console.error('Error generating swaps:', error);
    // Fallback to local swap engine
    const { generateSwaps: localGenerate } = await import('../fitswap/swapEngine');
    return localGenerate(recipe.ingredients, goal as any);
  }
}

/**
 * Explain a swap using backend API
 */
export async function explainSwap(swap: Swap): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/explain-swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ swap }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to explain swap');
    }

    const data = await response.json();
    return data.explanation || swap.reason || 'Esta troca melhora o perfil nutricional da receita.';
  } catch (error) {
    console.error('Error explaining swap:', error);
    return swap.reason || 'Esta troca melhora o perfil nutricional da receita.';
  }
}
