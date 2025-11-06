/**
 * OpenAI Image Generation Service
 * Generate images using DALL-E API
 */

import { API_KEYS } from '../../config/apiKeys';

const OPENAI_API_KEY = API_KEYS.OPENAI_API_KEY;

/**
 * Generate an image using DALL-E
 */
export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return null;
    }

    const data = await response.json();
    return data.data[0]?.url || null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

/**
 * Generate a recipe illustration prompt
 */
export function generateRecipePrompt(recipeTitle?: string): string {
  if (recipeTitle) {
    return `Beautiful, appetizing food photography of ${recipeTitle}, professional food styling, dark background, vibrant colors, high quality, restaurant quality, minimalist composition, focus on the food`;
  }
  return `Beautiful, appetizing food photography, professional food styling, dark background, vibrant colors, high quality, restaurant quality, minimalist composition, focus on healthy nutritious food, NutriVerse brand style`;
}

