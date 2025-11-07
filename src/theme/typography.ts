/**
 * NutriVerse Design System - Typography
 * Poppins for titles, Inter for body text
 */

export const typography = {
  // Font Families
  fontFamily: {
    title: 'Poppins', // Titles (700/800 weight)
    body: 'Inter', // Body text (400/500/600 weight)
  },

  // Font Sizes
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 22,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
  },

  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },

  // Text Styles (predefined combinations)
  // Note: lineHeight is in pixels for React Native (not fractional like web)
  styles: {
    // Titles
    h1: {
      fontSize: 28,
      fontWeight: '800' as const,
      lineHeight: 34, // 28 * 1.2 = 33.6 → 34
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 29, // 24 * 1.2 = 28.8 → 29
      letterSpacing: -0.5,
    },
    h3: {
      fontSize: 20,
      fontWeight: '700' as const,
      lineHeight: 26, // 20 * 1.3 = 26
      letterSpacing: 0,
    },
    h4: {
      fontSize: 18,
      fontWeight: '700' as const,
      lineHeight: 25, // 18 * 1.4 = 25.2 → 25
      letterSpacing: 0,
    },

    // Body
    body: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 23, // 15 * 1.5 = 22.5 → 23
      letterSpacing: 0,
    },
    bodyMedium: {
      fontSize: 15,
      fontWeight: '500' as const,
      lineHeight: 23, // 15 * 1.5 = 22.5 → 23
      letterSpacing: 0,
    },
    bodySemibold: {
      fontSize: 15,
      fontWeight: '600' as const,
      lineHeight: 23, // 15 * 1.5 = 22.5 → 23
      letterSpacing: 0,
    },

    // Small text
    small: {
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 20, // 13 * 1.5 = 19.5 → 20
      letterSpacing: 0,
    },
    smallMedium: {
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 20, // 13 * 1.5 = 19.5 → 20
      letterSpacing: 0,
    },
    smallSemibold: {
      fontSize: 13,
      fontWeight: '600' as const,
      lineHeight: 20, // 13 * 1.5 = 19.5 → 20
      letterSpacing: 0,
    },

    // Caption
    caption: {
      fontSize: 11,
      fontWeight: '400' as const,
      lineHeight: 15, // 11 * 1.4 = 15.4 → 15
      letterSpacing: 0,
    },
  },
} as const;

