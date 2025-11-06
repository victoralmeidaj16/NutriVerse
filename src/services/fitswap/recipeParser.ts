/**
 * Recipe Parser - Parse recipe text into structured format
 */

import { ParsedRecipe, Ingredient, CookingStep } from '../../types/recipe';

/**
 * Parse recipe from plain text
 */
export function parseRecipeFromText(text: string): ParsedRecipe {
  // Mock implementation - in real app, this would use OpenAI or NLP
  const lines = text.split('\n').filter(line => line.trim());
  
  // Extract title (usually first line or after "Receita:")
  let title = 'Receita sem título';
  let description = '';
  let ingredients: Ingredient[] = [];
  let steps: CookingStep[] = [];
  let servings = 4;
  let prepTime = 15;
  let cookTime = 30;

  // Simple heuristic parsing
  let currentSection: 'title' | 'description' | 'ingredients' | 'steps' = 'title';
  
  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase().trim();
    
    if (lowerLine.includes('receita') || lowerLine.includes('ingredientes')) {
      currentSection = 'ingredients';
      return;
    }
    
    if (lowerLine.includes('modo') || lowerLine.includes('preparo') || lowerLine.includes('instruções')) {
      currentSection = 'steps';
      return;
    }
    
    if (lowerLine.includes('porções') || lowerLine.includes('serve')) {
      const servingsMatch = line.match(/\d+/);
      if (servingsMatch) servings = parseInt(servingsMatch[0]);
      return;
    }
    
    if (lowerLine.includes('tempo') || lowerLine.includes('minutos')) {
      const timeMatch = line.match(/\d+/);
      if (timeMatch) cookTime = parseInt(timeMatch[0]);
      return;
    }

    if (index === 0 && currentSection === 'title') {
      title = line.trim();
      currentSection = 'description';
    } else if (currentSection === 'ingredients') {
      // Parse ingredient line
      const ingredient = parseIngredientLine(line);
      if (ingredient) ingredients.push(ingredient);
    } else if (currentSection === 'steps') {
      // Parse step line
      const step = parseStepLine(line, steps.length + 1);
      if (step) steps.push(step);
    }
  });

  // If no ingredients/steps found, create mock data
  if (ingredients.length === 0) {
    ingredients = [
      { id: '1', name: 'Ingrediente 1', amount: 100, unit: 'g' },
      { id: '2', name: 'Ingrediente 2', amount: 2, unit: 'un' },
    ];
  }

  if (steps.length === 0) {
    steps = [
      { id: '1', order: 1, instruction: 'Preparar os ingredientes', duration: 300 },
      { id: '2', order: 2, instruction: 'Cozinhar conforme instruções', duration: 1800 },
    ];
  }

  return {
    id: `recipe_${Date.now()}`,
    title,
    description,
    ingredients,
    steps,
    servings,
    prepTime,
    cookTime,
    totalTime: prepTime + cookTime,
    source: 'Texto colado',
  };
}

/**
 * Parse a single ingredient line
 */
function parseIngredientLine(line: string): Ingredient | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('-') || trimmed.startsWith('*')) {
    // Remove bullet points
    const clean = trimmed.replace(/^[-*]\s*/, '');
    if (!clean) return null;
    
    // Try to extract amount and unit
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      const amountStr = parts[0];
      const unit = parts[1];
      const amount = parseFloat(amountStr) || 1;
      const name = parts.slice(2).join(' ') || 'Ingrediente';
      
      return {
        id: `ing_${Date.now()}_${Math.random()}`,
        name,
        amount,
        unit,
      };
    }
    
    return {
      id: `ing_${Date.now()}_${Math.random()}`,
      name: clean,
      amount: 1,
      unit: 'un',
    };
  }
  
  return null;
}

/**
 * Parse a single step line
 */
function parseStepLine(line: string, order: number): CookingStep | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  
  // Remove step numbers
  const clean = trimmed.replace(/^\d+[\.\)]\s*/, '').trim();
  if (!clean) return null;
  
  // Check for timer mentions
  const timerMatch = clean.match(/(\d+)\s*(min|minutos|seg|segundos)/i);
  const duration = timerMatch ? parseInt(timerMatch[1]) * (timerMatch[2].toLowerCase().includes('min') ? 60 : 1) : undefined;
  
  return {
    id: `step_${Date.now()}_${order}`,
    order,
    instruction: clean,
    duration,
    timerRequired: !!duration,
  };
}

/**
 * Extract ingredients from text using simple patterns
 */
export function extractIngredients(text: string): Ingredient[] {
  const ingredients: Ingredient[] = [];
  const lines = text.split('\n');
  
  lines.forEach(line => {
    const ingredient = parseIngredientLine(line);
    if (ingredient) ingredients.push(ingredient);
  });
  
  return ingredients;
}

