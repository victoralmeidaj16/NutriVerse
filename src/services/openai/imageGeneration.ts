/**
 * OpenAI Image Generation Service
 * Generate images using backend API (proxy to protect API key)
 * Uses gpt-image-1 for high-quality recipe illustrations
 */

// Use environment variable or default to Render backend
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://nutriversee.onrender.com';

export type GenerateImageOptions = {
  size?: '1024x1024' | '512x512' | '256x256'; // gpt-image-1 supports square sizes
  quality?: 'low' | 'medium' | 'high' | 'auto'; // gpt-image-1 quality options
  background?: 'transparent' | 'white';
};

/**
 * Generate an image using OpenAI Images API (gpt-image-1) via backend API
 */
export async function generateImage(
  prompt: string,
  options: GenerateImageOptions = {}
): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, ...options }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API error:', error);
      return null;
    }

    const data = await response.json();
    return data.url || null; // data URL (base64) ou URL pública
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

/**
 * Generate a recipe illustration prompt
 * Prompt helper (ajustado p/ brand)
 */
export function generateRecipePrompt(recipeTitle?: string): string {
  const brand = 'emerald #10B981';
  const base =
    'Beautiful appetizing food photography, professional food styling, soft diffused light, 50mm lens, minimalist composition, restaurant quality, background off-white, brand accent ' +
    brand;
  return recipeTitle
    ? `${base}, ${recipeTitle}`
    : `${base}, focus on healthy nutritious food, NutriVerse brand style`;
}
