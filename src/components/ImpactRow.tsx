/**
 * ImpactRow Component - Display nutritional impact (kcal, P/C/G, etc.)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { NutritionInfo } from '../types/nutrition';

interface ImpactRowProps {
  nutrition: NutritionInfo;
  showSodium?: boolean;
  showFiber?: boolean;
  compact?: boolean;
}

export default function ImpactRow({
  nutrition,
  showSodium = false,
  showFiber = false,
  compact = false,
}: ImpactRowProps) {
  const items = [
    { label: 'kcal', value: Math.round(nutrition.calories), icon: 'flame-outline' },
    { label: 'P', value: `${Math.round(nutrition.protein)}g`, icon: 'barbell-outline' },
    { label: 'C', value: `${Math.round(nutrition.carbohydrates)}g`, icon: 'nutrition-outline' },
    { label: 'G', value: `${Math.round(nutrition.fats)}g`, icon: 'water-outline' },
  ];

  if (showFiber && nutrition.fiber) {
    items.push({ label: 'Fibra', value: `${Math.round(nutrition.fiber)}g`, icon: 'leaf-outline' });
  }

  if (showSodium && nutrition.sodium) {
    items.push({ label: 'Sódio', value: `${Math.round(nutrition.sodium)}mg`, icon: 'salt-outline' });
  }

  return (
    <View style={[styles.container, compact && styles.compact]}>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          {!compact && <Ionicons name={item.icon as any} size={14} color={colors.primary} />}
          <Text style={styles.value}>{item.value}</Text>
          {!compact && <Text style={styles.label}>{item.label}</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  compact: {
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  value: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  label: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
  },
});

