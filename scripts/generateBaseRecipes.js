/**
 * Script to generate base recipes for each goal
 * Run: node scripts/generateBaseRecipes.js
 * 
 * This script generates 5 recipes for each goal (lose_weight, gain_mass, general_health)
 * and saves them to Firebase Database
 * 
 * Note: Requires Node.js 18+ for native fetch, or install node-fetch
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://nutriversee.onrender.com';

// Use native fetch if available (Node.js 18+), otherwise try to require node-fetch
let fetch;
if (typeof globalThis.fetch === 'function') {
  fetch = globalThis.fetch;
} else {
  try {
    fetch = require('node-fetch');
  } catch (e) {
    console.error('Error: fetch is not available. Please use Node.js 18+ or install node-fetch: npm install node-fetch');
    process.exit(1);
  }
}

// Import Firebase
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');

// Firebase config (same as in src/config/firebase.ts)
const firebaseConfig = {
  databaseURL: 'https://fitswap---nutriverse-default-rtdb.firebaseio.com',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const GOALS = ['lose_weight', 'gain_mass', 'general_health'];
const CATEGORIES = ['Café', 'Almoço rápido', 'Pré/Pós‑treino', 'Snacks'];
const RECIPES_PER_CATEGORY_PER_GOAL = 1; // 1 recipe per category per goal = 4 recipes per goal

// Recipe ideas for each goal and category
const RECIPE_IDEAS = {
  lose_weight: {
    'Café': [
      'Omelete de claras com espinafre e cogumelos',
      'Aveia com frutas e proteína',
      'Panqueca de banana e aveia sem açúcar',
    ],
    'Almoço rápido': [
      'Salada de quinoa com frango grelhado e vegetais',
      'Sopa de legumes com proteína magra',
      'Bowl de salmão com abacate e vegetais',
    ],
    'Pré/Pós‑treino': [
      'Frango grelhado com batata doce e brócolis',
      'Salmão com batata doce e vegetais',
      'Peito de peru com quinoa e vegetais',
    ],
    'Snacks': [
      'Iogurte grego com frutas e granola',
      'Mix de castanhas e frutas secas',
      'Barra de proteína caseira',
    ],
  },
  gain_mass: {
    'Café': [
      'Omelete completa com pão integral e queijo',
      'Aveia com whey protein e frutas',
      'Panqueca de banana com mel e proteína',
    ],
    'Almoço rápido': [
      'Frango com arroz integral e feijão',
      'Macarrão integral com carne moída e molho',
      'Bowl de frango, batata doce e quinoa',
    ],
    'Pré/Pós‑treino': [
      'Peito de peru com batata e vegetais',
      'Salmão com arroz e legumes',
      'Carne moída com batata doce e vegetais',
    ],
    'Snacks': [
      'Shake de proteína com banana e aveia',
      'Sanduíche de frango com pão integral',
      'Iogurte grego com granola e mel',
    ],
  },
  general_health: {
    'Café': [
      'Omelete com vegetais e pão integral',
      'Aveia com frutas e sementes',
      'Panqueca de banana e aveia',
    ],
    'Almoço rápido': [
      'Salmão grelhado com quinoa e vegetais',
      'Frango ao curry com arroz integral',
      'Bowl mediterrâneo com grão-de-bico',
    ],
    'Pré/Pós‑treino': [
      'Peixe assado com batata doce e salada',
      'Frango grelhado com quinoa e vegetais',
      'Salmão com batata doce e legumes',
    ],
    'Snacks': [
      'Iogurte com frutas e granola',
      'Mix de castanhas e frutas',
      'Hummus com vegetais',
    ],
  },
};

/**
 * Generate image for recipe
 */
async function generateRecipeImage(recipeTitle, category) {
  try {
    const prompt = `Beautiful appetizing food photography, professional food styling, soft diffused light, 50mm lens, minimalist composition, restaurant quality, background off-white, brand accent emerald #10B981, ${recipeTitle}`;
    
    const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        size: '1024x1024',
        quality: 'standard',
        background: 'transparent',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn(`    ⚠️  Image generation failed: ${error.error || 'Unknown error'}`);
      return null;
    }

    const data = await response.json();
    return data.url || null;
  } catch (error) {
    console.warn(`    ⚠️  Image generation error: ${error.message}`);
    return null;
  }
}

async function generateRecipeForGoal(goal, recipeTitle, category) {
  console.log(`  → Generating: "${recipeTitle}" (${category})`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-base-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goal,
        recipeTitle,
        category,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate recipe');
    }

    const data = await response.json();
    const recipeData = data.recipes[0];

    // Generate image for the recipe
    console.log(`    🖼️  Generating image...`);
    const imageUrl = await generateRecipeImage(recipeData.title || recipeTitle, category);

    // Format to Recipe structure
    const recipe = {
      id: `base_${goal}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      original: {
        id: `orig_${Date.now()}`,
        title: recipeData.title || recipeTitle,
        description: recipeData.description || '',
        servings: recipeData.servings || 4,
        prepTime: recipeData.prepTime || 0,
        cookTime: recipeData.cookTime || 0,
        totalTime: (recipeData.prepTime || 0) + (recipeData.cookTime || 0),
        imageUrl: imageUrl || undefined, // Add image URL if generated
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
      },
      variants: [
        {
          id: 'original',
          name: 'Original',
          recipe: {
            ...recipeData,
            imageUrl: imageUrl || undefined, // Add image URL to variant too
          },
          swaps: [],
          nutrition: recipeData.nutrition || {
            calories: 0,
            protein: 0,
            carbohydrates: 0,
            fats: 0,
          },
          healthScore: { value: 75, max: 100 },
          costScore: { value: 70, max: 100 },
        },
      ],
      createdAt: new Date().toISOString(),
      goal,
      category: category || null,
      restrictions: recipeData.restrictions || [], // Restrictions this recipe contains
    };

    return recipe;
  } catch (error) {
    console.error(`  ❌ Error generating recipe "${recipeTitle}":`, error.message);
    throw error;
  }
}

async function generateAllBaseRecipes() {
  console.log('🚀 Starting base recipes generation...\n');

  let totalRecipes = 0;

  for (const goal of GOALS) {
    console.log(`\n📝 Generating recipes for goal: ${goal}`);
    const goalRecipes = RECIPE_IDEAS[goal];

    for (const category of CATEGORIES) {
      console.log(`\n  📂 Category: ${category}`);
      const categoryRecipes = goalRecipes[category] || [];

      for (let i = 0; i < RECIPES_PER_CATEGORY_PER_GOAL && i < categoryRecipes.length; i++) {
        const recipeTitle = categoryRecipes[i];

        try {
          const recipe = await generateRecipeForGoal(goal, recipeTitle, category);

          // Save to Firebase
          const recipeRef = ref(database, `recipes/${goal}/${recipe.id}`);
          await set(recipeRef, recipe);

          console.log(`    ✅ Saved: ${recipe.id}${recipe.original.imageUrl ? ' (with image)' : ' (no image)'}`);
          totalRecipes++;

          // Wait a bit to avoid rate limiting (longer delay for image generation)
          await new Promise((resolve) => setTimeout(resolve, 3000));
        } catch (error) {
          console.error(`    ❌ Failed: ${recipeTitle}`, error.message);
          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    }
  }

  console.log('\n✨ Base recipes generation complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   - ${GOALS.length} goals`);
  console.log(`   - ${CATEGORIES.length} categories per goal`);
  console.log(`   - ${RECIPES_PER_CATEGORY_PER_GOAL} recipe(s) per category`);
  console.log(`   - Total: ${totalRecipes} recipes generated`);
}

// Run if executed directly
if (require.main === module) {
  generateAllBaseRecipes().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generateAllBaseRecipes };

