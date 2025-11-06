/**
 * TipCard Component - Contextual nutrition tip card
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

interface TipCardProps {
  tip: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function TipCard({ tip, icon = 'bulb-outline' }: TipCardProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={18} color={colors.primary} />
      <Text style={styles.text}>{tip}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  text: {
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    lineHeight: 20,
  },
});

