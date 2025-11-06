/**
 * Mock Recipes Data
 */

import { Recipe, ParsedRecipe } from '../../types/recipe';

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'recipe_1',
    original: {
      id: 'original_1',
      title: 'Frango ao pesto com abobrinha e quinoa',
      description: 'Uma receita deliciosa e nutritiva',
      ingredients: [
        { id: '1', name: 'Peito de frango', amount: 200, unit: 'g' },
        { id: '2', name: 'Quinoa', amount: 100, unit: 'g' },
        { id: '3', name: 'Abobrinha', amount: 2, unit: 'un' },
        { id: '4', name: 'Pesto', amount: 50, unit: 'g' },
      ],
      steps: [
        { id: '1', order: 1, instruction: 'Cozinhar o frango', duration: 600 },
        { id: '2', order: 2, instruction: 'Preparar a quinoa', duration: 900 },
        { id: '3', order: 3, instruction: 'Grelhar a abobrinha', duration: 300 },
      ],
      servings: 2,
      prepTime: 15,
      cookTime: 25,
      totalTime: 40,
    },
    variants: [],
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_PARSED_RECIPES: ParsedRecipe[] = MOCK_RECIPES.map(r => r.original);

