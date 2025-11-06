/**
 * NutriVerse Design System - Spacing Tokens
 * Consistent spacing scale for padding, margins, gaps
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

// Common spacing values
export const SPACING = spacing.base; // 16px default

export type SpacingKey = keyof typeof spacing;

