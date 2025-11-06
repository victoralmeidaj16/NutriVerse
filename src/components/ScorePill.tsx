/**
 * ScorePill Component - Health or Cost score badge
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

interface ScorePillProps {
  type: 'health' | 'cost';
  value: number; // 0-100
  size?: 'small' | 'medium' | 'large';
}

export default function ScorePill({ type, value, size = 'medium' }: ScorePillProps) {
  const getColor = () => {
    if (value >= 80) return colors.state.success;
    if (value >= 60) return colors.primary;
    if (value >= 40) return colors.state.warning;
    return colors.state.error;
  };

  const sizeStyles = {
    small: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, fontSize: 10 },
    medium: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: 12 },
    large: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: 14 },
  };

  return (
    <View style={[styles.container, { backgroundColor: getColor() + '20' }]}>
      <Text style={[styles.label, sizeStyles[size]]}>
        {type === 'health' ? 'Saúde' : 'Custo'}: {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});

