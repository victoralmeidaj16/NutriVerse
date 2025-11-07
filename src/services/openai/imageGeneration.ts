/**
 * OpenAI Image Generation Service
 * Generate images using backend API (proxy to protect API key)
 */

// Use environment variable or default to localhost for development
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Generate an image using DALL-E via backend API
 */
export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API error:', error);
      return null;
    }

    const data = await response.json();
    return data.url || null;
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
