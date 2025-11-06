/**
 * NutriVerse Design System - Color Palette v2
 * Dark-first, monochromatic with lime green accent
 */

export const colors = {
  // Primary Action/Emphasis
  primary: '#9BE000', // Lime green

  // Button
  button: '#0B0B0D', // Deep black
  buttonText: '#FFFFFF', // White text on buttons

  // Backgrounds
  background: '#0D0F12', // Charcoal background
  card: '#16161B', // Card background
  cardElevated: '#1A1B20', // Elevated card

  // Borders
  border: '#1F232B', // Border color (~14-18% opacity on dark)

  // Text Scale (light to dark)
  text: {
    primary: '#FFFFFF', // Primary text
    secondary: '#F5F7FA', // Secondary text
    tertiary: '#E6E8EC', // Tertiary text
    quaternary: '#BFC5CF', // Quaternary text
    muted: '#8C93A2', // Muted text
    disabled: '#5C6270', // Disabled text
    subtle: '#2A2F39', // Subtle text
  },

  // Neutrals (for reference)
  neutral: {
    white: '#FFFFFF',
    light1: '#F5F7FA',
    light2: '#E6E8EC',
    light3: '#BFC5CF',
    medium1: '#8C93A2',
    medium2: '#5C6270',
    dark1: '#2A2F39',
    dark2: '#16181D',
    charcoal: '#0D0F12',
  },

  // States (minimal use)
  state: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },

  // Legacy support (for migration - these are aliases)
  lime: '#9BE000',
  bg: '#0D0F12',
  sub: '#A5A7B0',
} as const;

export type ColorKey = keyof typeof colors;

