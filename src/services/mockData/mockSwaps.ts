/**
 * Mock Swaps Data - Example ingredient substitutions
 */

import { Swap } from '../../types/recipe';

export const MOCK_SWAPS: Swap[] = [
  {
    id: 'swap_1',
    originalIngredient: {
      id: '1',
      name: 'Creme de leite',
      amount: 200,
      unit: 'ml',
    },
    swappedIngredient: {
      id: 'swapped_1',
      name: 'Iogurte grego + azeite',
      amount: 150,
      unit: 'ml',
    },
    reason: 'Menos gordura saturada, mais proteína',
    impact: {
      calories: -150,
      protein: 8,
      carbohydrates: -2,
      fats: -20,
    },
  },
];

