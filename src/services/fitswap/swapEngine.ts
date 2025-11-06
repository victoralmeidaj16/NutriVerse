/**
 * Swap Engine - Generate ingredient substitutions based on goals
 */

import { Ingredient, Swap } from '../../types/recipe';
import { UserGoal } from '../../types/user';

// Swap database - maps original ingredients to alternatives
const SWAP_DATABASE: Record<string, Array<{ name: string; reason: string; goal?: UserGoal }>> = {
  'creme de leite': [
    { name: 'iogurte grego + azeite', reason: 'Menos gordura saturada, mais proteína', goal: 'lose_weight' },
    { name: 'leite de coco', reason: 'Opção vegana, sabor similar', goal: 'general_health' },
  ],
  'manteiga': [
    { name: 'azeite de oliva', reason: 'Gorduras mais saudáveis', goal: 'general_health' },
    { name: 'abacate amassado', reason: 'Gorduras boas, mais nutrientes', goal: 'lose_weight' },
  ],
  'açúcar': [
    { name: 'mel', reason: 'Mais natural, menor índice glicêmico', goal: 'general_health' },
    { name: 'stevia', reason: 'Zero calorias', goal: 'lose_weight' },
    { name: 'banana amassada', reason: 'Adoça naturalmente, adiciona nutrientes', goal: 'gain_mass' },
  ],
  'farinha branca': [
    { name: 'farinha de aveia', reason: 'Mais proteína e fibra', goal: 'lose_weight' },
    { name: 'farinha de amêndoa', reason: 'Mais proteína, menos carboidratos', goal: 'gain_mass' },
    { name: 'farinha integral', reason: 'Mais fibra e nutrientes', goal: 'general_health' },
  ],
  'arroz branco': [
    { name: 'quinoa', reason: 'Mais proteína e nutrientes', goal: 'gain_mass' },
    { name: 'arroz integral', reason: 'Mais fibra', goal: 'lose_weight' },
    { name: 'couve-flor ralada', reason: 'Menos calorias, mais volume', goal: 'lose_weight' },
  ],
  'macarrão': [
    { name: 'macarrão integral', reason: 'Mais fibra', goal: 'lose_weight' },
    { name: 'macarrão de grão-de-bico', reason: 'Mais proteína', goal: 'gain_mass' },
    { name: 'abobrinha em espiral', reason: 'Menos calorias', goal: 'lose_weight' },
  ],
  'óleo': [
    { name: 'azeite de oliva', reason: 'Gorduras mais saudáveis', goal: 'general_health' },
    { name: 'spray de azeite', reason: 'Menos gordura total', goal: 'lose_weight' },
  ],
  'queijo amarelo': [
    { name: 'queijo cottage', reason: 'Mais proteína, menos gordura', goal: 'lose_weight' },
    { name: 'queijo parmesão', reason: 'Mais sabor, menos quantidade necessária', goal: 'general_health' },
  ],
};

/**
 * Generate swaps for a recipe based on goal
 */
export function generateSwaps(
  ingredients: Ingredient[],
  goal: UserGoal
): Swap[] {
  const swaps: Swap[] = [];
  
  ingredients.forEach((ingredient, index) => {
    const ingredientName = ingredient.name.toLowerCase();
    
    // Find potential swaps
    const swapOptions = SWAP_DATABASE[ingredientName] || 
      Object.keys(SWAP_DATABASE).find(key => 
        ingredientName.includes(key) || key.includes(ingredientName)
      ) ? SWAP_DATABASE[Object.keys(SWAP_DATABASE).find(key => 
        ingredientName.includes(key) || key.includes(ingredientName)
      )!] : null;
    
    if (swapOptions) {
      // Filter by goal preference
      const goalSwaps = swapOptions.filter(s => !s.goal || s.goal === goal);
      const preferredSwap = goalSwaps.length > 0 ? goalSwaps[0] : swapOptions[0];
      
      if (preferredSwap) {
        // Create swapped ingredient
        const swappedIngredient: Ingredient = {
          id: `swapped_${ingredient.id}`,
          name: preferredSwap.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        };
        
        // Calculate impact (mock - in real app would use nutrition calculator)
        const impact = calculateSwapImpact(ingredient, swappedIngredient);
        
        swaps.push({
          id: `swap_${Date.now()}_${index}`,
          originalIngredient: ingredient,
          swappedIngredient,
          reason: preferredSwap.reason,
          impact,
        });
      }
    }
  });
  
  return swaps;
}

/**
 * Calculate nutritional impact of a swap
 */
function calculateSwapImpact(original: Ingredient, swapped: Ingredient): {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
} {
  // Mock calculation - in real app would use nutrition calculator
  // For now, return estimated differences based on common swaps
  
  const originalName = original.name.toLowerCase();
  const swappedName = swapped.name.toLowerCase();
  
  // Common swap impacts
  if (originalName.includes('creme de leite') && swappedName.includes('iogurte')) {
    return { calories: -150, protein: 8, carbohydrates: -2, fats: -20 };
  }
  
  if (originalName.includes('açúcar') && swappedName.includes('stevia')) {
    return { calories: -400, protein: 0, carbohydrates: -100, fats: 0 };
  }
  
  if (originalName.includes('farinha branca') && swappedName.includes('aveia')) {
    return { calories: -50, protein: 5, carbohydrates: -10, fats: 2 };
  }
  
  if (originalName.includes('arroz branco') && swappedName.includes('quinoa')) {
    return { calories: -10, protein: 4, carbohydrates: -5, fats: 1 };
  }
  
  // Default: small improvement
  return { calories: -20, protein: 2, carbohydrates: -5, fats: -2 };
}

/**
 * Apply swaps to ingredients list
 */
export function applySwaps(ingredients: Ingredient[], swaps: Swap[]): Ingredient[] {
  const swapMap = new Map(swaps.map(s => [s.originalIngredient.id, s.swappedIngredient]));
  
  return ingredients.map(ingredient => {
    const swapped = swapMap.get(ingredient.id);
    return swapped || ingredient;
  });
}

