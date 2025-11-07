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
 * Generate image using OpenAI Images API (DALL-E 3 - latest version)
 */
app.post('/api/generate-image', async (req, res) => {
  try {
    const {
      prompt,
      size = '1024x1024',
      quality = 'standard',      // 'standard' | 'hd' (DALL-E 3)
      style = 'vivid',           // 'vivid' | 'natural' (DALL-E 3)
    } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // DALL-E 3 supports: '1024x1024', '1792x1024', '1024x1792'
    // Map old sizes to DALL-E 3 compatible sizes
    let dallE3Size = '1024x1024';
    if (size === '512x512') {
      dallE3Size = '1024x1024';
    } else if (size === '2048x2048') {
      dallE3Size = '1792x1024';
    } else {
      dallE3Size = size;
    }

    const opts = {
      model: 'dall-e-3', // Latest DALL-E 3 model
      prompt,
      size: dallE3Size,
      quality: quality === 'high' ? 'hd' : 'standard', // DALL-E 3 uses 'hd' instead of 'high'
      style: style || 'vivid', // 'vivid' for more saturated, 'natural' for more realistic
      n: 1, // DALL-E 3 only supports n=1
    };

    const result = await openai.images.generate(opts);

    // DALL-E 3 returns URL directly (no b64_json option)
    const imageUrl = result.data?.[0]?.url;
    if (!imageUrl) {
      return res.status(502).json({ error: 'No image returned' });
    }

    // For DALL-E 3, we return the URL directly
    // Optionally, we could fetch and convert to base64 if needed
    return res.json({ url: imageUrl });
  } catch (error) {
    console.error('OpenAI error:', error?.response?.data || error);
    res.status(500).json({
      error: error.message || 'Image generation failed',
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
      model: 'gpt-4o',
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
      model: 'gpt-4o',
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
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a nutrition expert that creates healthy ingredient swaps for recipes.
          Goal: ${goalDescription}
          Return a JSON object with a "swaps" array with this structure:
          {
            "swaps": [{
              "originalIngredient": {"name": "original", "amount": 200, "unit": "g"},
              "swappedIngredient": {"name": "replacement", "amount": 200, "unit": "g"},
              "reason": "explanation of why this swap is better"
            }]
          }`,
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
 * POST /api/parse-pantry
 * Parse ingredients from pantry image using OpenAI Vision
 */
app.post('/api/parse-pantry', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Identifique todos os ingredientes e alimentos visíveis nesta imagem de despensa/geladeira. Retorne um JSON array com objetos no formato: [{"name": "nome do ingrediente", "qty": "quantidade se visível", "confidence": 0.9}]. Seja específico e liste todos os itens que você conseguir identificar.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    let items = [];

    try {
      // Try to parse JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        items = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: extract ingredient names from text
        const lines = content.split('\n').filter(line => line.trim());
        items = lines.map((line, idx) => ({
          name: line.replace(/^[-•*]\s*/, '').trim(),
          confidence: 0.7,
        }));
      }
    } catch (parseError) {
      console.error('Error parsing ingredients:', parseError);
      // Fallback: return empty array
      items = [];
    }

    res.json({
      success: true,
      items: items,
    });
  } catch (error) {
    console.error('Error parsing pantry:', error);
    res.status(500).json({
      error: error.message || 'Failed to parse pantry',
    });
  }
});

/**
 * POST /api/generate-recipes-from-pantry
 * Generate recipes from pantry ingredients with filters
 */
app.post('/api/generate-recipes-from-pantry', async (req, res) => {
  try {
    const {
      ingredients = [],
      image,
      filters = {},
      goal = 'general_health',
      restrictions = [],
    } = req.body;

    if (ingredients.length === 0 && !image) {
      return res.status(400).json({ error: 'Ingredients or image is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Build ingredients list
    let ingredientsList = ingredients.join(', ');
    
    // If image provided, parse it first
    if (image) {
      try {
        const parseResponse = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Liste todos os ingredientes e alimentos visíveis nesta imagem. Retorne apenas uma lista separada por vírgulas.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
        });
        
        const detectedIngredients = parseResponse.choices[0].message.content;
        ingredientsList = ingredients.length > 0
          ? `${ingredientsList}, ${detectedIngredients}`
          : detectedIngredients;
      } catch (parseError) {
        console.error('Error parsing image:', parseError);
        // Continue with manual ingredients only
      }
    }

    // Build prompt with filters
    const tasteFilter = filters.taste || 'ambos';
    const alignedWithGoal = filters.alignedWithGoal !== false;
    const fitnessLevel = filters.fitnessLevel || 3;

    const goalDescription = {
      lose_weight: 'perda de peso (menos calorias, mais proteína)',
      gain_mass: 'ganho de massa (mais proteína, calorias balanceadas)',
      general_health: 'saúde geral (nutrição balanceada)',
    }[goal] || 'saúde geral';

    const restrictionsText = restrictions.length > 0
      ? `Restrições alimentares: ${restrictions.join(', ')}. `
      : '';

    const fitnessDescription = {
      1: 'básico (receitas simples e rápidas)',
      2: 'iniciante (receitas fáceis com ingredientes comuns)',
      3: 'intermediário (receitas balanceadas)',
      4: 'avançado (receitas com técnicas e ingredientes específicos)',
      5: 'expert (receitas complexas e otimizadas)',
    }[fitnessLevel] || 'intermediário';

    const tasteDescription = {
      salgado: 'receitas salgadas',
      doce: 'receitas doces',
      ambos: 'receitas salgadas ou doces',
    }[tasteFilter] || 'receitas salgadas ou doces';

    const prompt = `Crie uma receita completa e saudável usando APENAS os seguintes ingredientes disponíveis: ${ingredientsList}.

${restrictionsText}
Requisitos:
- Tipo: ${tasteDescription}
- ${alignedWithGoal ? `Alinhada com objetivo de ${goalDescription}.` : 'Sem restrições de objetivo.'}
- Nível fitness: ${fitnessDescription}
- Use apenas os ingredientes listados (pode sugerir substituições mínimas se necessário)
- Inclua instruções passo a passo detalhadas
- Calcule valores nutricionais aproximados (calorias, proteínas, carboidratos, gorduras)

Retorne um JSON no formato:
{
  "title": "Nome da receita",
  "description": "Breve descrição",
  "servings": 4,
  "prepTime": 15,
  "cookTime": 30,
  "ingredients": [
    {"name": "ingrediente", "amount": 200, "unit": "g"}
  ],
  "steps": [
    {"order": 1, "instruction": "instrução detalhada", "duration": 5}
  ],
  "nutrition": {
    "calories": 350,
    "protein": 25,
    "carbohydrates": 40,
    "fats": 10
  }
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um chef nutricionista especializado em criar receitas saudáveis e saborosas. Sempre retorne JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    });

    const recipeData = JSON.parse(response.choices[0].message.content);
    
    // Format recipe to match frontend structure
    const recipe = {
      id: `pantry_${Date.now()}`,
      title: recipeData.title || 'Receita da Despensa',
      description: recipeData.description,
      servings: recipeData.servings || 4,
      prepTime: recipeData.prepTime || 0,
      cookTime: recipeData.cookTime || 0,
      totalTime: (recipeData.prepTime || 0) + (recipeData.cookTime || 0),
      ingredients: (recipeData.ingredients || []).map((ing, idx) => ({
        id: `ing_${idx}`,
        name: ing.name,
        amount: ing.amount || 0,
        unit: ing.unit || 'g',
        category: 'other',
      })),
      steps: (recipeData.steps || []).map((step, idx) => ({
        id: `step_${idx}`,
        order: step.order || idx + 1,
        instruction: step.instruction,
        duration: step.duration || 0,
      })),
      nutrition: recipeData.nutrition || {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fats: 0,
      },
    };

    res.json({
      success: true,
      recipes: [recipe],
    });
  } catch (error) {
    console.error('Error generating recipes from pantry:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate recipes',
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
      model: 'gpt-4o',
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

/**
 * POST /api/generate-base-recipe
 * Generate a base recipe for a specific goal (used by script)
 */
app.post('/api/generate-base-recipe', async (req, res) => {
  try {
    const { goal, recipeTitle, category, customPrompt } = req.body;

    if (!goal || !recipeTitle) {
      return res.status(400).json({ error: 'Goal and recipeTitle are required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const goalDescription = {
      lose_weight: 'perda de peso (menos calorias, mais proteína, baixo carboidrato)',
      gain_mass: 'ganho de massa (mais calorias, alta proteína, carboidratos balanceados)',
      general_health: 'saúde geral (nutrição balanceada, ingredientes saudáveis)',
    }[goal] || 'saúde geral';

    // Category-specific instructions
    const categoryInstructions = {
      'Café': 'Receita para café da manhã, deve ser nutritiva e energética para começar o dia',
      'Almoço rápido': 'Receita para almoço, deve ser completa e satisfatória',
      'Pré/Pós‑treino': 'Receita ideal para pré ou pós-treino, rica em proteína e carboidratos',
      'Snacks': 'Receita para lanche/snack, deve ser prática e nutritiva',
    }[category] || '';

    const prompt = customPrompt || `Crie uma receita completa e saudável: "${recipeTitle}".

Objetivo: ${goalDescription}
${category ? `Categoria: ${categoryInstructions}` : ''}

Requisitos:
- Receita completa com ingredientes, quantidades, passos detalhados
- Calcule valores nutricionais precisos (calorias, proteínas, carboidratos, gorduras)
- Inclua tempo de preparo e cozimento
- Receita prática e saborosa
- Use ingredientes comuns e acessíveis
- Receita deve ser otimizada para o objetivo: ${goalDescription}
${category ? `- Receita deve ser adequada para: ${categoryInstructions}` : ''}
- IMPORTANTE: Analise os ingredientes e identifique todas as restrições alimentares que esta receita contém.
- Retorne um campo "restrictions" com um array das restrições detectadas.
- Use apenas os valores exatos: "gluten", "lactose", "soy", "egg", "fish", "shellfish", "peanut", "tree_nut", "vegetarian", "vegan", "keto", "paleo"
- Exemplos:
  * Se contém trigo, farinha de trigo, pão, macarrão → adicione "gluten"
  * Se contém leite, queijo, manteiga, iogurte → adicione "lactose"
  * Se contém ovos → adicione "egg"
  * Se contém peixe → adicione "fish"
  * Se contém frutos do mar → adicione "shellfish"
  * Se contém soja → adicione "soy"
  * Se contém amendoim → adicione "peanut"
  * Se contém castanhas, nozes, amêndoas → adicione "tree_nut"
  * Se não contém carne mas contém ovos/laticínios → adicione "vegetarian"
  * Se não contém nenhum produto animal → adicione "vegan"

Retorne um JSON no formato:
{
  "title": "Nome da receita",
  "description": "Breve descrição",
  "servings": 4,
  "prepTime": 15,
  "cookTime": 30,
  "ingredients": [
    {"name": "ingrediente", "amount": 200, "unit": "g", "category": "protein"}
  ],
  "steps": [
    {"order": 1, "instruction": "instrução detalhada", "duration": 5}
  ],
  "nutrition": {
    "calories": 350,
    "protein": 25,
    "carbohydrates": 40,
    "fats": 10
  },
  "restrictions": ["gluten", "lactose"] // Array de restrições que a receita contém (use apenas os valores exatos listados acima)
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um chef nutricionista especializado em criar receitas saudáveis e saborosas. Sempre retorne JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    });

    const recipeData = JSON.parse(response.choices[0].message.content);
    
    // Format recipe
    const recipe = {
      id: `base_${goal}_${Date.now()}`,
      title: recipeData.title || recipeTitle,
      description: recipeData.description,
      servings: recipeData.servings || 4,
      prepTime: recipeData.prepTime || 0,
      cookTime: recipeData.cookTime || 0,
      totalTime: (recipeData.prepTime || 0) + (recipeData.cookTime || 0),
      ingredients: (recipeData.ingredients || []).map((ing, idx) => ({
        id: `ing_${idx}`,
        name: ing.name,
        amount: ing.amount || 0,
        unit: ing.unit || 'g',
        category: ing.category || 'other',
      })),
      steps: (recipeData.steps || []).map((step, idx) => ({
        id: `step_${idx}`,
        order: step.order || idx + 1,
        instruction: step.instruction,
        duration: step.duration || 0,
      })),
      nutrition: recipeData.nutrition || {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fats: 0,
      },
      restrictions: recipeData.restrictions || [], // Array of restrictions this recipe contains
      category: category || null, // Category tag
    };

    res.json({
      success: true,
      recipes: [recipe],
    });
  } catch (error) {
    console.error('Error generating base recipe:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate recipe',
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

