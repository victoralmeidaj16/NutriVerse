/**
 * Restrictions Screen - Select allergies and dietary restrictions
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { Restriction } from '../../types/user';
import type { OnboardingStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Restrictions'>;

const RESTRICTIONS: { value: Restriction; label: string }[] = [
  { value: 'peanut', label: 'Amendoim' },
  { value: 'gluten', label: 'Glúten' },
  { value: 'lactose', label: 'Lactose' },
  { value: 'soy', label: 'Soja' },
  { value: 'egg', label: 'Ovo' },
  { value: 'fish', label: 'Peixe' },
  { value: 'shellfish', label: 'Frutos do mar' },
  { value: 'tree_nut', label: 'Castanhas' },
  { value: 'vegetarian', label: 'Vegetariano' },
  { value: 'vegan', label: 'Vegano' },
  { value: 'keto', label: 'Cetogênica' },
  { value: 'paleo', label: 'Paleo' },
];

export default function RestrictionsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedRestrictions, setSelectedRestrictions] = useState<Restriction[]>([]);

  const toggleRestriction = (restriction: Restriction) => {
    setSelectedRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  };

  const handleNext = () => {
    navigation.navigate('Preferences');
  };

  const handleSkip = () => {
    navigation.navigate('Preferences');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '40%' }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Alguma restrição alimentar?</Text>
        <Text style={styles.subtitle}>
          Selecione alergias, intolerâncias ou dietas que você segue
        </Text>

        <View style={styles.chipsContainer}>
          {RESTRICTIONS.map((restriction) => {
            const isSelected = selectedRestrictions.includes(restriction.value);
            return (
              <TouchableOpacity
                key={restriction.value}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => toggleRestriction(restriction.value)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextSelected]}
                >
                  {restriction.label}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color={colors.button} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <Text style={styles.skipButtonText}>Pular</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
  },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    marginBottom: spacing['2xl'],
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  chipTextSelected: {
    color: colors.button,
  },
  footer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  button: {
    backgroundColor: colors.button,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: typography.fontFamily.body,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.buttonText,
  },
  skipButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  skipButtonText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
  },
});

