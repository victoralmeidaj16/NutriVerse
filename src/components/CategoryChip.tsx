/**
 * CategoryChip Component - Category selector chip
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

interface CategoryChipProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  onPress?: () => void;
}

export default function CategoryChip({
  title,
  icon = 'fast-food-outline',
  selected = false,
  onPress,
}: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Ionicons
        name={icon as any}
        size={32}
        color={selected ? colors.button : colors.text.primary}
      />
      <Text style={[styles.text, selected && styles.textSelected]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    width: 100,
    height: 100,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    padding: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  textSelected: {
    color: colors.button,
  },
});

