/**
 * NutriVerse Backend API
 * Proxy server to protect OpenAI API key
 */

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'NutriVerse API is running' });
});

/**
 * POST /api/generate-image
 * Generate image using DALL-E
 */
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    res.json({
      success: true,
      url: response.data[0]?.url || null,
    });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate image',
    });
  }
});

/**
 * POST /api/parse-recipe
 * Parse recipe from text using OpenAI
 */
app.post('/api/parse-recipe', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Recipe text is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a recipe parser. Extract ingredients, steps, and metadata from recipe text.
          Return a JSON object with the following structure:
          {
            "title": "Recipe title",
            "description": "Recipe description",
            "ingredients": [{"name": "ingredient name", "amount": 200, "unit": "g"}],
            "steps": [{"order": 1, "instruction": "step instruction", "duration": 300}],
            "servings": 4,
            "prepTime": 15,
            "cookTime": 25
          }`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const parsedRecipe = JSON.parse(response.choices[0].message.content);

    res.json({
      success: true,
      recipe: parsedRecipe,
    });
  } catch (error) {
    console.error('Error parsing recipe:', error);
    res.status(500).json({
      error: error.message || 'Failed to parse recipe',
    });
  }
});

/**
 * POST /api/parse-recipe-image
 * Parse recipe from image using OpenAI Vision
 */
app.post('/api/parse-recipe-image', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: `You are a recipe parser. Extract ingredients, steps, and metadata from recipe images.
          Return a JSON object with the following structure:
          {
            "title": "Recipe title",
            "description": "Recipe description",
            "ingredients": [{"name": "ingredient name", "amount": 200, "unit": "g"}],
            "steps": [{"order": 1, "instruction": "step instruction", "duration": 300}],
            "servings": 4,
            "prepTime": 15,
            "cookTime": 25
          }`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract the recipe from this image and return it as JSON.',
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    });

    const parsedRecipe = JSON.parse(response.choices[0].message.content);

    res.json({
      success: true,
      recipe: parsedRecipe,
    });
  } catch (error) {
    console.error('Error parsing recipe image:', error);
    res.status(500).json({
      error: error.message || 'Failed to parse recipe from image',
    });
  }
});

/**
 * POST /api/generate-swaps
 * Generate ingredient swaps using OpenAI
 */
app.post('/api/generate-swaps', async (req, res) => {
  try {
    const { recipe, goal, preferences } = req.body;

    if (!recipe) {
      return res.status(400).json({ error: 'Recipe is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const goalDescription = {
      lose_weight: 'weight loss (lower calories, maintain protein)',
      gain_muscle: 'muscle gain (higher protein, balanced macros)',
      general_health: 'general health (balanced nutrition)',
    }[goal] || 'general health';

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a nutrition expert that creates healthy ingredient swaps for recipes.
          Goal: ${goalDescription}
          Return a JSON array of swaps with this structure:
          [{
            "originalIngredient": {"name": "original", "amount": 200, "unit": "g"},
            "swappedIngredient": {"name": "replacement", "amount": 200, "unit": "g"},
            "reason": "explanation of why this swap is better"
          }]`,
        },
        {
          role: 'user',
          content: `Given this recipe: ${JSON.stringify(recipe)}, suggest healthy ingredient swaps for ${goalDescription}.`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const swapsData = JSON.parse(response.choices[0].message.content);
    const swaps = Array.isArray(swapsData.swaps) ? swapsData.swaps : swapsData.swaps || [];

    res.json({
      success: true,
      swaps: swaps,
    });
  } catch (error) {
    console.error('Error generating swaps:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate swaps',
    });
  }
});

/**
 * POST /api/explain-swap
 * Get detailed explanation of a swap using OpenAI
 */
app.post('/api/explain-swap', async (req, res) => {
  try {
    const { swap } = req.body;

    if (!swap) {
      return res.status(400).json({ error: 'Swap is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a nutrition expert. Explain why ingredient swaps are beneficial for health.',
        },
        {
          role: 'user',
          content: `Explain why replacing ${swap.originalIngredient?.name} with ${swap.swappedIngredient?.name} is beneficial: ${swap.reason}`,
        },
      ],
      max_tokens: 200,
    });

    const explanation = response.choices[0].message.content;

    res.json({
      success: true,
      explanation: explanation,
    });
  } catch (error) {
    console.error('Error explaining swap:', error);
    res.status(500).json({
      error: error.message || 'Failed to explain swap',
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 NutriVerse API server running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not set. OpenAI features will not work.');
  }
});

