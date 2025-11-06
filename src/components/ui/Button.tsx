/**
 * Button Component - Reusable button with variants
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'cta';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isCTA = variant === 'cta';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary && styles.buttonPrimary,
        isSecondary && styles.buttonSecondary,
        isCTA && styles.buttonCTA,
        disabled && styles.buttonDisabled,
        fullWidth && styles.fullWidth,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.98}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary || isCTA ? colors.buttonText : colors.primary}
        />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={isPrimary || isCTA ? colors.buttonText : colors.primary}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.text,
              isPrimary && styles.textPrimary,
              isSecondary && styles.textSecondary,
              isCTA && styles.textCTA,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    gap: spacing.xs,
  },
  buttonPrimary: {
    backgroundColor: colors.button,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonCTA: {
    backgroundColor: colors.button,
    // CTA emphasis with green halo effect would be added via shadow/elevation
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  icon: {
    marginRight: spacing.xs,
  },
  text: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  textPrimary: {
    color: colors.buttonText,
  },
  textSecondary: {
    color: colors.text.primary,
  },
  textCTA: {
    color: colors.buttonText,
  },
});

