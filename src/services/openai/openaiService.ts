/**
 * OpenAI Service - Integration points for OpenAI API
 * Currently uses mock implementations, ready for API integration
 */

import { ParsedRecipe } from '../../types/recipe';
import { Swap } from '../../types/recipe';
import { API_KEYS } from '../../config/apiKeys';

const USE_MOCK = false; // Set to false when API key is configured
const OPENAI_API_KEY = API_KEYS.OPENAI_API_KEY;

/**
 * Parse recipe from text using OpenAI
 */
export async function parseRecipeFromText(text: string): Promise<ParsedRecipe> {
  if (USE_MOCK || !OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    // Use local parser as fallback
    const { parseRecipeFromText: localParse } = await import('../fitswap/recipeParser');
    return localParse(text);
  }
  
  // TODO: Implement OpenAI API call
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     model: 'gpt-4',
  //     messages: [{
  //       role: 'system',
  //       content: 'You are a recipe parser. Extract ingredients, steps, and metadata from recipe text.',
  //     }, {
  //       role: 'user',
  //       content: text,
  //     }],
  //   }),
  // });
  
  throw new Error('OpenAI API not yet implemented');
}

/**
 * Parse recipe from image using OpenAI Vision
 */
export async function parseRecipeFromImage(imageUri: string): Promise<ParsedRecipe> {
  if (USE_MOCK || !OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    // Return mock recipe
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
  
  // TODO: Implement OpenAI Vision API call
  throw new Error('OpenAI Vision API not yet implemented');
}

/**
 * Generate swaps using OpenAI
 */
export async function generateSwaps(
  recipe: ParsedRecipe,
  goal: string
): Promise<Swap[]> {
  if (USE_MOCK || !OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    // Use local swap engine as fallback
    const { generateSwaps: localGenerate } = await import('../fitswap/swapEngine');
    return localGenerate(recipe.ingredients, goal as any);
  }
  
  // TODO: Implement OpenAI API call for intelligent swaps
  throw new Error('OpenAI swaps generation not yet implemented');
}

/**
 * Explain a swap using OpenAI
 */
export async function explainSwap(swap: Swap): Promise<string> {
  if (USE_MOCK || !OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    return swap.reason || 'Esta troca melhora o perfil nutricional da receita.';
  }
  
  // TODO: Implement OpenAI API call for detailed explanations
  throw new Error('OpenAI explanation not yet implemented');
}

