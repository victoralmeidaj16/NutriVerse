/**
 * NutriVerse Design System - Color Palette v3
 * Light-first rebranding with emerald green accent
 * Based on RecipesScreen design system
 */

export const colors = {
  // Primary Action/Emphasis (Brand Green)
  primary: '#059669', // emerald-600/700 - Brand accent color
  primaryLight: '#A7F3D0', // emerald-200 - For borders/rings
  primaryAmber: '#FBBF24', // Amber for ratings

  // Button
  button: '#171717', // neutral-900 - Deep black for buttons
  buttonText: '#FFFFFF', // White text on buttons

  // Backgrounds (Light theme)
  background: '#FAFAFA', // neutral-50 - Main app background
  card: '#FFFFFF', // White - Card/surface background
  cardElevated: '#FFFFFF', // White - Elevated card (same for light theme)

  // Borders
  border: '#E5E5E5', // neutral-200 - Standard border
  borderSoft: '#F0F0F0', // Very light border for subtle separation

  // Text Scale (dark on light)
  text: {
    primary: '#171717', // neutral-900 - Primary text (titles, labels)
    secondary: '#404040', // neutral-700 - Secondary text
    tertiary: '#525252', // neutral-600 - Tertiary text (greetings)
    quaternary: '#737373', // neutral-500 - Quaternary text (metadados)
    muted: '#9CA3AF', // neutral-400 - Muted text (disabled icons)
    disabled: '#9CA3AF', // neutral-400 - Disabled text
    subtle: '#A3A3A3', // neutral-400 - Subtle text
  },

  // Neutrals (for reference)
  neutral: {
    white: '#FFFFFF',
    light1: '#F5F5F5', // neutral-100
    light2: '#E5E5E5', // neutral-200
    light3: '#D4D4D4', // neutral-300
    medium1: '#A3A3A3', // neutral-400
    medium2: '#737373', // neutral-500
    dark1: '#525252', // neutral-600
    dark2: '#404040', // neutral-700
    dark3: '#171717', // neutral-900
  },

  // Premium (dark gradient)
  premium: {
    from: '#1A1A1A',
    to: '#0D0D0D',
  },

  // States (minimal use)
  state: {
    success: '#059669', // Using brand green
    warning: '#FBBF24', // Amber
    error: '#EF4444',
  },

  // Legacy support (for migration - these are aliases)
  lime: '#059669', // Updated to brand green
  bg: '#FAFAFA', // Updated to light background
  sub: '#737373', // Updated to neutral-500
} as const;

export type ColorKey = keyof typeof colors;

