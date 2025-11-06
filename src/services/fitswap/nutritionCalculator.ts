/**
 * Nutrition Calculator - Calculate nutritional values for recipes
 */

import { Ingredient } from '../../types/recipe';
import { NutritionInfo, HealthScore, CostScore } from '../../types/nutrition';

// Mock nutrition database (in real app, this would be a comprehensive database)
const NUTRITION_DB: Record<string, { calories: number; protein: number; carbs: number; fats: number; fiber?: number; sodium?: number }> = {
  'frango': { calories: 165, protein: 31, carbs: 0, fats: 3.6, sodium: 74 },
  'peito de frango': { calories: 165, protein: 31, carbs: 0, fats: 3.6, sodium: 74 },
  'salmão': { calories: 208, protein: 20, carbs: 0, fats: 12, sodium: 44 },
  'ovo': { calories: 155, protein: 13, carbs: 1.1, fats: 11, sodium: 124 },
  'ovos': { calories: 155, protein: 13, carbs: 1.1, fats: 11, sodium: 124 },
  'arroz': { calories: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4, sodium: 1 },
  'quinoa': { calories: 120, protein: 4.4, carbs: 22, fats: 1.9, fiber: 2.8, sodium: 7 },
  'batata': { calories: 77, protein: 2, carbs: 17, fats: 0.1, fiber: 2.2, sodium: 6 },
  'batata doce': { calories: 86, protein: 1.6, carbs: 20, fats: 0.1, fiber: 3, sodium: 54 },
  'aveia': { calories: 389, protein: 17, carbs: 66, fats: 7, fiber: 11, sodium: 2 },
  'abobrinha': { calories: 17, protein: 1.2, carbs: 3.4, fats: 0.2, fiber: 1, sodium: 8 },
  'tomate': { calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, fiber: 1.2, sodium: 5 },
  'cebola': { calories: 40, protein: 1.1, carbs: 9.3, fats: 0.1, fiber: 1.7, sodium: 4 },
  'alho': { calories: 149, protein: 6.4, carbs: 33, fats: 0.5, fiber: 2.1, sodium: 17 },
  'azeite': { calories: 884, protein: 0, carbs: 0, fats: 100, sodium: 2 },
  'azeite de oliva': { calories: 884, protein: 0, carbs: 0, fats: 100, sodium: 2 },
  'creme de leite': { calories: 292, protein: 2.8, carbs: 3, fats: 30, sodium: 40 },
  'iogurte grego': { calories: 59, protein: 10, carbs: 3.6, fats: 0.4, sodium: 36 },
  'leite': { calories: 42, protein: 3.4, carbs: 5, fats: 1, sodium: 44 },
  'queijo': { calories: 113, protein: 7, carbs: 1, fats: 9, sodium: 621 },
  'pão': { calories: 265, protein: 9, carbs: 49, fats: 3.2, fiber: 2.7, sodium: 491 },
  'massa': { calories: 131, protein: 5, carbs: 25, fats: 1.1, fiber: 1.8, sodium: 1 },
  'macarrão': { calories: 131, protein: 5, carbs: 25, fats: 1.1, fiber: 1.8, sodium: 1 },
};

/**
 * Calculate nutrition for a single ingredient
 */
function calculateIngredientNutrition(ingredient: Ingredient): Partial<NutritionInfo> {
  const name = ingredient.name.toLowerCase();
  
  // Try to find in database
  let nutrition = NUTRITION_DB[name];
  
  // Try partial matches
  if (!nutrition) {
    const key = Object.keys(NUTRITION_DB).find(k => name.includes(k) || k.includes(name));
    if (key) nutrition = NUTRITION_DB[key];
  }
  
  // Default values if not found
  if (!nutrition) {
    nutrition = { calories: 100, protein: 5, carbs: 15, fats: 3 };
  }
  
  // Convert to per 100g basis, then multiply by amount
  const multiplier = ingredient.unit === 'g' || ingredient.unit === 'ml' 
    ? ingredient.amount / 100 
    : ingredient.amount; // For units like 'un', 'xícara', etc.
  
  return {
    calories: Math.round(nutrition.calories * multiplier),
    protein: Math.round(nutrition.protein * multiplier * 10) / 10,
    carbohydrates: Math.round(nutrition.carbs * multiplier * 10) / 10,
    fats: Math.round(nutrition.fats * multiplier * 10) / 10,
    fiber: nutrition.fiber ? Math.round(nutrition.fiber * multiplier * 10) / 10 : undefined,
    sodium: nutrition.sodium ? Math.round(nutrition.sodium * multiplier) : undefined,
  };
}

/**
 * Calculate total nutrition for a recipe
 */
export function calculateRecipeNutrition(ingredients: Ingredient[]): NutritionInfo {
  const total: NutritionInfo = {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fats: 0,
  };
  
  ingredients.forEach(ingredient => {
    const nutrition = calculateIngredientNutrition(ingredient);
    total.calories += nutrition.calories || 0;
    total.protein += nutrition.protein || 0;
    total.carbohydrates += nutrition.carbohydrates || 0;
    total.fats += nutrition.fats || 0;
    if (nutrition.fiber) total.fiber = (total.fiber || 0) + nutrition.fiber;
    if (nutrition.sodium) total.sodium = (total.sodium || 0) + nutrition.sodium;
  });
  
  return {
    calories: Math.round(total.calories),
    protein: Math.round(total.protein * 10) / 10,
    carbohydrates: Math.round(total.carbohydrates * 10) / 10,
    fats: Math.round(total.fats * 10) / 10,
    fiber: total.fiber ? Math.round(total.fiber * 10) / 10 : undefined,
    sodium: total.sodium ? Math.round(total.sodium) : undefined,
  };
}

/**
 * Calculate Health Score (0-100)
 */
export function calculateHealthScore(nutrition: NutritionInfo): HealthScore {
  let score = 50; // Base score
  
  // Nutritional density (protein + fiber bonus)
  const proteinScore = Math.min(nutrition.protein / 2, 20); // Max 20 points
  const fiberScore = Math.min((nutrition.fiber || 0) * 2, 10); // Max 10 points
  score += proteinScore + fiberScore;
  
  // Macro balance
  const totalMacros = nutrition.protein + nutrition.carbohydrates + (nutrition.fats * 9);
  if (totalMacros > 0) {
    const proteinRatio = (nutrition.protein * 4) / totalMacros;
    const carbRatio = (nutrition.carbohydrates * 4) / totalMacros;
    const fatRatio = (nutrition.fats * 9) / totalMacros;
    
    // Ideal ratios: 25% protein, 45% carbs, 30% fat
    const balanceScore = 10 - (
      Math.abs(proteinRatio - 0.25) * 20 +
      Math.abs(carbRatio - 0.45) * 10 +
      Math.abs(fatRatio - 0.30) * 10
    );
    score += Math.max(0, balanceScore);
  }
  
  // Sodium penalty (lower is better)
  if (nutrition.sodium) {
    const sodiumPenalty = Math.min(nutrition.sodium / 50, 15); // Max 15 point penalty
    score -= sodiumPenalty;
  }
  
  // Calorie density (lower calories per gram is better)
  const calorieDensity = nutrition.calories / Math.max(nutrition.protein + nutrition.carbohydrates + nutrition.fats, 1);
  if (calorieDensity < 3) score += 5; // Bonus for low calorie density
  
  return {
    value: Math.max(0, Math.min(100, Math.round(score))),
    factors: {
      nutritionalDensity: Math.round(proteinScore + fiberScore),
      macroBalance: Math.round(score - (proteinScore + fiberScore) - 50),
      sodiumLevel: nutrition.sodium ? Math.max(0, 15 - Math.round(nutrition.sodium / 50)) : 15,
      addedSugar: 10, // Would need sugar data
      processedFoods: 5, // Would need processing level data
    },
  };
}

/**
 * Calculate Cost Score (0-100)
 */
export function calculateCostScore(ingredients: Ingredient[], costPerPortion?: number): CostScore {
  // Mock cost calculation
  // In real app, this would use actual ingredient prices
  
  if (costPerPortion !== undefined) {
    let affordability: 'low' | 'medium' | 'high' = 'medium';
    if (costPerPortion < 10) affordability = 'low';
    else if (costPerPortion > 25) affordability = 'high';
    
    // Score based on affordability (lower cost = higher score, but not too low)
    const score = Math.max(0, Math.min(100, 100 - (costPerPortion * 2)));
    
    return {
      value: Math.round(score),
      costPerPortion,
      affordability,
    };
  }
  
  // Estimate cost based on ingredients
  const estimatedCost = ingredients.length * 3; // Rough estimate
  
  return {
    value: 75, // Default score
    costPerPortion: estimatedCost,
    affordability: 'medium',
  };
}

