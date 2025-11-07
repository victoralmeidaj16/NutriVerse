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
const RECIPES_PER_GOAL = 5;

// Recipe ideas for each goal
const RECIPE_IDEAS = {
  lose_weight: [
    'Salada de quinoa com frango grelhado e vegetais',
    'Sopa de legumes com proteína magra',
    'Bowl de salmão com abacate e vegetais',
    'Omelete de claras com espinafre e cogumelos',
    'Frango grelhado com batata doce e brócolis',
  ],
  gain_mass: [
    'Frango com arroz integral e feijão',
    'Macarrão integral com carne moída e molho',
    'Bowl de frango, batata doce e quinoa',
    'Peito de peru com batata e vegetais',
    'Salmão com arroz e legumes',
  ],
  general_health: [
    'Salmão grelhado com quinoa e vegetais',
    'Frango ao curry com arroz integral',
    'Bowl mediterrâneo com grão-de-bico',
    'Peixe assado com batata doce e salada',
    'Risotto de cogumelos com proteína',
  ],
};

async function generateRecipeForGoal(goal, recipeTitle) {
  console.log(`  → Generating: "${recipeTitle}"`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-base-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goal,
        recipeTitle,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate recipe');
    }

    const data = await response.json();
    const recipeData = data.recipes[0];

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
          recipe: recipeData,
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
    };

    return recipe;
  } catch (error) {
    console.error(`  ❌ Error generating recipe "${recipeTitle}":`, error.message);
    throw error;
  }
}

async function generateAllBaseRecipes() {
  console.log('🚀 Starting base recipes generation...\n');

  for (const goal of GOALS) {
    console.log(`📝 Generating recipes for goal: ${goal}`);
    const recipeIdeas = RECIPE_IDEAS[goal];

    for (let i = 0; i < RECIPES_PER_GOAL; i++) {
      const recipeTitle = recipeIdeas[i];

      try {
        const recipe = await generateRecipeForGoal(goal, recipeTitle);

        // Save to Firebase
        const recipeRef = ref(database, `recipes/${goal}/${recipe.id}`);
        await set(recipeRef, recipe);

        console.log(`  ✅ Saved: ${recipe.id}\n`);

        // Wait a bit to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`  ❌ Failed: ${recipeTitle}`, error.message);
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  console.log('✨ Base recipes generation complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   - ${GOALS.length} goals`);
  console.log(`   - ${RECIPES_PER_GOAL} recipes per goal`);
  console.log(`   - Total: ${GOALS.length * RECIPES_PER_GOAL} recipes`);
}

// Run if executed directly
if (require.main === module) {
  generateAllBaseRecipes().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generateAllBaseRecipes };

