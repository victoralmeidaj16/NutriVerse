/**
 * Nutrition-related type definitions
 */

export interface MacroTargets {
  calories: number;
  protein: number; // in grams
  carbohydrates: number; // in grams
  fats: number; // in grams
  fiber?: number; // in grams
}

export interface NutritionInfo {
  calories: number;
  protein: number; // in grams
  carbohydrates: number; // in grams
  fats: number; // in grams
  fiber?: number; // in grams
  sodium?: number; // in mg
  sugar?: number; // in grams
  saturatedFat?: number; // in grams
}

export interface DailyProgress {
  date: string;
  consumed: NutritionInfo;
  targets: MacroTargets;
  remaining: NutritionInfo;
  percentage: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fats: number;
  };
}

export interface WeeklyProgress {
  weekStart: string;
  weekEnd: string;
  dailyProgress: DailyProgress[];
  averages: NutritionInfo;
  goalsMet: number; // days where goals were met
}

export interface HealthScore {
  value: number; // 0-100
  factors: {
    nutritionalDensity: number;
    macroBalance: number;
    sodiumLevel: number;
    addedSugar: number;
    processedFoods: number;
  };
}

export interface CostScore {
  value: number; // 0-100
  costPerPortion: number; // in local currency
  affordability: 'low' | 'medium' | 'high';
}

