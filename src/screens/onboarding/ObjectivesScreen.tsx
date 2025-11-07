/**
 * Objectives Screen - Select user goal
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { UserGoal } from '../../types/user';
import { useOnboarding } from '../../contexts/OnboardingContext';
import type { OnboardingStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Objectives'>;

const GOALS: { value: UserGoal; label: string; icon: string; description: string }[] = [
  {
    value: 'lose_weight',
    label: 'Perder peso',
    icon: 'trending-down-outline',
    description: 'Criar déficit calórico com foco em proteína',
  },
  {
    value: 'gain_mass',
    label: 'Ganhar massa',
    icon: 'trending-up-outline',
    description: 'Superávit calórico com alta proteína e carboidratos',
  },
  {
    value: 'general_health',
    label: 'Saúde geral',
    icon: 'heart-outline',
    description: 'Equilíbrio nutricional e bem-estar',
  },
];

export default function ObjectivesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { goal, setGoal } = useOnboarding();
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(goal);

  const handleGoalSelect = (goalValue: UserGoal) => {
    setSelectedGoal(goalValue);
    setGoal(goalValue);
  };

  const handleNext = () => {
    if (selectedGoal) {
      navigation.navigate('Restrictions');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '20%' }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Qual é o seu objetivo?</Text>
        <Text style={styles.subtitle}>
          Escolha o objetivo que melhor descreve o que você quer alcançar
        </Text>

        <View style={styles.optionsContainer}>
          {GOALS.map((goal) => (
            <TouchableOpacity
              key={goal.value}
              style={[
                styles.optionCard,
                selectedGoal === goal.value && styles.optionCardSelected,
              ]}
              onPress={() => handleGoalSelect(goal.value)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.iconContainer,
                  selectedGoal === goal.value && styles.iconContainerSelected,
                ]}
              >
                <Ionicons
                  name={goal.icon as any}
                  size={32}
                  color={selectedGoal === goal.value ? colors.buttonText : colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.optionLabel,
                  selectedGoal === goal.value && styles.optionLabelSelected,
                ]}
              >
                {goal.label}
              </Text>
              <Text style={styles.optionDescription}>{goal.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selectedGoal && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!selectedGoal}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Continuar</Text>
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
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    borderRadius: 2,
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
    color: colors.text.tertiary,
    marginBottom: spacing['2xl'],
  },
  optionsContainer: {
    gap: spacing.base,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#ECFDF5', // emerald-50 equivalent
    borderWidth: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.neutral.light1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: colors.primary,
  },
  optionLabel: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  optionLabelSelected: {
    color: colors.primary,
  },
  optionDescription: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
  },
  footer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  button: {
    backgroundColor: colors.button,
    paddingVertical: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: typography.fontFamily.body,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.buttonText,
  },
});

