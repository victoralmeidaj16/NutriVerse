/**
 * Cooking Mode Screen - Step-by-step cooking guide with timer
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import StepTimer from '../../components/StepTimer';
import { Recipe, CookingStep, Ingredient } from '../../types/recipe';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProp = {
  params?: {
    recipeId?: string;
    variantId?: string;
  };
};

// Mock recipe data - in real app, this would be fetched
const MOCK_RECIPE_STEPS: CookingStep[] = [
  { id: '1', order: 1, instruction: 'Lave e corte os legumes em cubos pequenos', duration: 300 },
  { id: '2', order: 2, instruction: 'Aqueça o azeite em uma panela em fogo médio', duration: 60 },
  { id: '3', order: 3, instruction: 'Refogue a cebola até ficar transparente', duration: 180 },
  { id: '4', order: 4, instruction: 'Adicione o alho e refogue por 1 minuto', duration: 60 },
  { id: '5', order: 5, instruction: 'Adicione os legumes e tempere com sal e pimenta', duration: 120 },
  { id: '6', order: 6, instruction: 'Cozinhe por 15 minutos mexendo ocasionalmente', duration: 900, timerRequired: true },
  { id: '7', order: 7, instruction: 'Ajuste os temperos e sirva quente', duration: 60 },
];

const MOCK_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Abobrinha', amount: 2, unit: 'un' },
  { id: '2', name: 'Cebola', amount: 1, unit: 'un' },
  { id: '3', name: 'Alho', amount: 3, unit: 'dentes' },
  { id: '4', name: 'Azeite de oliva', amount: 2, unit: 'colheres' },
  { id: '5', name: 'Sal', amount: 1, unit: 'pitada' },
  { id: '6', name: 'Pimenta do reino', amount: 1, unit: 'pitada' },
];

export default function CookingModeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [ingredientsReady, setIngredientsReady] = useState(false);

  const steps = MOCK_RECIPE_STEPS;
  const ingredients = MOCK_INGREDIENTS;
  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];

  const toggleIngredient = (id: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedIngredients(newChecked);
    setIngredientsReady(newChecked.size === ingredients.length);
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Recipe complete
      navigation.goBack();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTimerComplete = () => {
    // Auto-advance to next step when timer completes
    setTimeout(() => {
      goToNextStep();
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modo Cozinhar</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            Passo {currentStep + 1} de {totalSteps}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentStep + 1) / totalSteps) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Ingredients Checklist (only show on first step) */}
        {currentStep === 0 && (
          <View style={styles.ingredientsSection}>
            <Text style={styles.sectionTitle}>Ingredientes</Text>
            <Text style={styles.sectionSubtitle}>Marque os ingredientes que você possui</Text>
            <View style={styles.ingredientsList}>
              {ingredients.map((ingredient) => {
                const isChecked = checkedIngredients.has(ingredient.id);
                return (
                  <TouchableOpacity
                    key={ingredient.id}
                    style={styles.ingredientItem}
                    onPress={() => toggleIngredient(ingredient.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                      {isChecked && (
                        <Ionicons name="checkmark" size={16} color={colors.button} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.ingredientText,
                        isChecked && styles.ingredientTextChecked,
                      ]}
                    >
                      {ingredient.amount} {ingredient.unit} de {ingredient.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {!ingredientsReady && (
              <Text style={styles.warningText}>
                Marque todos os ingredientes para continuar
              </Text>
            )}
          </View>
        )}

        {/* Current Step */}
        {currentStep > 0 || ingredientsReady ? (
          <View style={styles.stepSection}>
            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>Passo {currentStepData.order}</Text>
              <Text style={styles.stepInstruction}>{currentStepData.instruction}</Text>

              {/* Timer if step has duration */}
              {currentStepData.duration && currentStepData.timerRequired && (
                <View style={styles.timerSection}>
                  <StepTimer
                    duration={currentStepData.duration}
                    onComplete={handleTimerComplete}
                    autoStart={false}
                  />
                </View>
              )}

              {/* Step duration info */}
              {currentStepData.duration && !currentStepData.timerRequired && (
                <View style={styles.durationInfo}>
                  <Ionicons name="time-outline" size={16} color={colors.text.quaternary} />
                  <Text style={styles.durationText}>
                    Tempo estimado: {Math.round(currentStepData.duration / 60)} min
                  </Text>
                </View>
              )}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.navigationButtons}>
              {currentStep > 0 && (
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={goToPreviousStep}
                >
                  <Ionicons name="chevron-back" size={20} color={colors.text.primary} />
                  <Text style={styles.navButtonText}>Anterior</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonPrimary]}
                onPress={goToNextStep}
              >
                <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>
                  {currentStep === totalSteps - 1 ? 'Finalizar' : 'Próximo passo'}
                </Text>
                {currentStep < totalSteps - 1 && (
                  <Ionicons name="chevron-forward" size={20} color={colors.button} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  progressSection: {
    marginBottom: spacing.xl,
  },
  progressText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  ingredientsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
    marginBottom: spacing.md,
  },
  ingredientsList: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.text.quaternary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  ingredientText: {
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.text.quaternary,
  },
  warningText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.state.warning,
    textAlign: 'center',
  },
  stepSection: {
    marginTop: spacing.lg,
  },
  stepCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    minHeight: 300,
    justifyContent: 'center',
  },
  stepNumber: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stepInstruction: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    lineHeight: 28,
    marginBottom: spacing.xl,
  },
  timerSection: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  durationText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  navButtonPrimary: {
    backgroundColor: colors.button,
    borderColor: colors.button,
  },
  navButtonText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  navButtonTextPrimary: {
    color: colors.buttonText,
  },
});
