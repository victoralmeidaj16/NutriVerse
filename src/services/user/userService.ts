/**
 * User service for TDEE calculation, macro targets, and progress tracking
 */

import { UserProfile, UserGoal, ActivityLevel } from '../../types/user';
import { MacroTargets, DailyProgress, NutritionInfo } from '../../types/nutrition';
import storageService from '../storage/storage';

// Activity level multipliers for TDEE calculation
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 */
function calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female' | 'other'): number {
  // For 'other', use average of male and female
  const baseBMR = gender === 'male' 
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : gender === 'female'
    ? 10 * weight + 6.25 * height - 5 * age - 161
    : (10 * weight + 6.25 * height - 5 * age + 5 + 10 * weight + 6.25 * height - 5 * age - 161) / 2;
  
  return baseBMR;
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female' | 'other',
  activityLevel: ActivityLevel
): number {
  const bmr = calculateBMR(weight, height, age, gender);
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  return Math.round(bmr * multiplier);
}

/**
 * Calculate macro targets based on TDEE and goal
 */
export function calculateMacroTargets(tdee: number, goal: UserGoal): MacroTargets {
  let proteinRatio: number;
  let carbRatio: number;
  let fatRatio: number;

  switch (goal) {
    case 'lose_weight':
      // Higher protein, moderate carbs, lower fat
      proteinRatio = 0.35; // 35% protein
      carbRatio = 0.35; // 35% carbs
      fatRatio = 0.30; // 30% fat
      // Create slight deficit
      tdee = Math.round(tdee * 0.85); // 15% deficit
      break;
    case 'gain_mass':
      // Higher protein and carbs, moderate fat
      proteinRatio = 0.30; // 30% protein
      carbRatio = 0.45; // 45% carbs
      fatRatio = 0.25; // 25% fat
      // Create surplus
      tdee = Math.round(tdee * 1.15); // 15% surplus
      break;
    case 'general_health':
    default:
      // Balanced macros
      proteinRatio = 0.25; // 25% protein
      carbRatio = 0.45; // 45% carbs
      fatRatio = 0.30; // 30% fat
      break;
  }

  // Convert percentages to grams
  // Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
  const protein = Math.round((tdee * proteinRatio) / 4);
  const carbs = Math.round((tdee * carbRatio) / 4);
  const fats = Math.round((tdee * fatRatio) / 9);
  const fiber = Math.round(protein * 0.5); // Rough estimate: 0.5g fiber per 1g protein

  return {
    calories: tdee,
    protein,
    carbohydrates: carbs,
    fats,
    fiber,
  };
}

/**
 * Get daily progress (mock implementation)
 */
export async function getDailyProgress(date?: string): Promise<DailyProgress | null> {
  // In real implementation, this would fetch from API
  // For now, return mock data
  const today = date || new Date().toISOString().split('T')[0];
  
  const profile = await storageService.getUserProfile();
  if (!profile || !profile.weight || !profile.height || !profile.age || !profile.gender || !profile.activityLevel) {
    return null;
  }

  const tdee = calculateTDEE(
    profile.weight,
    profile.height,
    profile.age,
    profile.gender,
    profile.activityLevel
  );

  const targets = calculateMacroTargets(tdee, profile.preferences.goal);

  // Mock consumed values (in real app, this would come from logged meals)
  const consumed: NutritionInfo = {
    calories: Math.round(targets.calories * 0.45), // 45% consumed
    protein: Math.round(targets.protein * 0.50),
    carbohydrates: Math.round(targets.carbohydrates * 0.40),
    fats: Math.round(targets.fats * 0.55),
    fiber: Math.round((targets.fiber || 0) * 0.35),
  };

  const remaining: NutritionInfo = {
    calories: targets.calories - consumed.calories,
    protein: targets.protein - consumed.protein,
    carbohydrates: targets.carbohydrates - consumed.carbohydrates,
    fats: targets.fats - consumed.fats,
    fiber: (targets.fiber || 0) - (consumed.fiber || 0),
  };

  return {
    date: today,
    consumed,
    targets,
    remaining,
    percentage: {
      calories: (consumed.calories / targets.calories) * 100,
      protein: (consumed.protein / targets.protein) * 100,
      carbohydrates: (consumed.carbohydrates / targets.carbohydrates) * 100,
      fats: (consumed.fats / targets.fats) * 100,
    },
  };
}

/**
 * Get user profile with calculated TDEE and macro targets
 */
export async function getUserWithTargets(): Promise<{
  profile: UserProfile | null;
  tdee: number | null;
  macroTargets: MacroTargets | null;
}> {
  const profile = await storageService.getUserProfile();
  
  if (!profile || !profile.weight || !profile.height || !profile.age || !profile.gender || !profile.activityLevel) {
    return {
      profile,
      tdee: null,
      macroTargets: null,
    };
  }

  const tdee = calculateTDEE(
    profile.weight,
    profile.height,
    profile.age,
    profile.gender,
    profile.activityLevel
  );

  const macroTargets = calculateMacroTargets(tdee, profile.preferences.goal);

  return {
    profile,
    tdee,
    macroTargets,
  };
}

