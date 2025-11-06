/**
 * FitSwap Screen - Recipe transformation engine
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import ImpactRow from '../../components/ImpactRow';
import ScorePill from '../../components/ScorePill';
import { transformRecipe } from '../../services/fitswap/fitswapService';
import { Recipe, RecipeVariant } from '../../types/recipe';
import storageService from '../../services/storage/storage';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProp = {
  params?: {
    inputType?: 'text' | 'photo' | 'link';
    initialValue?: string;
  };
};

export default function FitSwapScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const [inputText, setInputText] = useState(route.params?.initialValue || '');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'original' | 'lean' | 'high_protein' | 'budget'>('original');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [activeVariant, setActiveVariant] = useState<RecipeVariant | null>(null);

  const handleTransform = useCallback(async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const userPreferences = await storageService.getUserPreferences();
      const goal = userPreferences?.goal || 'general_health';
      
      const transformedRecipe = await transformRecipe(inputText, goal, userPreferences || undefined);
      setRecipe(transformedRecipe);
      
      // Set active tab to first available variant
      if (transformedRecipe.variants.length > 0) {
        const firstVariant = transformedRecipe.variants.find(v => v.id === activeTab) || transformedRecipe.variants[0];
        setActiveTab(firstVariant.id as any);
      }
    } catch (error) {
      console.error('Error transforming recipe:', error);
    } finally {
      setLoading(false);
    }
  }, [inputText]);

  // Auto-transform if initial value provided (only once on mount)
  useEffect(() => {
    if (route.params?.initialValue && route.params.initialValue.trim() && !recipe) {
      // Use a separate async function to avoid dependency issues
      const transformInitial = async () => {
        if (!inputText.trim()) return;
        setLoading(true);
        try {
          const userPreferences = await storageService.getUserPreferences();
          const goal = userPreferences?.goal || 'general_health';
          
          const transformedRecipe = await transformRecipe(inputText, goal, userPreferences || undefined);
          setRecipe(transformedRecipe);
          
          if (transformedRecipe.variants.length > 0) {
            const firstVariant = transformedRecipe.variants.find(v => v.id === activeTab) || transformedRecipe.variants[0];
            setActiveTab(firstVariant.id as any);
          }
        } catch (error) {
          console.error('Error transforming recipe:', error);
        } finally {
          setLoading(false);
        }
      };
      transformInitial();
    }
  }, []); // Only run once on mount

  useEffect(() => {
    if (recipe) {
      const variant = recipe.variants.find(v => v.id === activeTab) || recipe.variants[0];
      setActiveVariant(variant);
    }
  }, [recipe, activeTab]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Fitzar receita</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Cole a receita, link ou texto</Text>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Cole aqui a receita que você quer fitzar..."
          placeholderTextColor={colors.text.disabled}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleTransform}
          disabled={loading || !inputText.trim()}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Processando...' : 'Fitzar receita'}
          </Text>
        </TouchableOpacity>

        {/* Results */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Processando receita...</Text>
          </View>
        )}

        {recipe && !loading && (
          <>
            {/* Results Tabs */}
            <View style={styles.tabs}>
              {recipe.variants.map((variant) => (
                <TouchableOpacity
                  key={variant.id}
                  style={[
                    styles.tab,
                    activeTab === variant.id && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab(variant.id as any)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === variant.id && styles.tabTextActive,
                    ]}
                  >
                    {variant.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Results Display */}
            {activeVariant && (
              <View style={styles.resultsCard}>
                <Text style={styles.recipeTitle}>{activeVariant.recipe.title}</Text>
                
                {activeVariant.explanation && (
                  <Text style={styles.explanation}>{activeVariant.explanation}</Text>
                )}

                <View style={styles.scoresRow}>
                  <ScorePill type="health" value={activeVariant.healthScore.value} />
                  <ScorePill type="cost" value={activeVariant.costScore.value} />
                </View>

                <View style={styles.impactSection}>
                  <Text style={styles.sectionLabel}>Impacto nutricional</Text>
                  <ImpactRow
                    nutrition={activeVariant.nutrition}
                    showSodium
                    showFiber
                  />
                </View>

                {activeVariant.swaps.length > 0 && (
                  <View style={styles.swapsSection}>
                    <Text style={styles.sectionLabel}>Trocas realizadas</Text>
                    {activeVariant.swaps.map((swap) => (
                      <View key={swap.id} style={styles.swapItem}>
                        <View style={styles.swapRow}>
                          <Text style={styles.swapOriginal}>{swap.originalIngredient.name}</Text>
                          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                          <Text style={styles.swapNew}>{swap.swappedIngredient.name}</Text>
                        </View>
                        <Text style={styles.swapReason}>{swap.reason}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.ctaRow}>
                  <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={() => navigation.navigate('CookingModeModal', { recipeId: recipe.id, variantId: activeVariant.id })}
                  >
                    <Ionicons name="flash-outline" size={18} color={colors.button} />
                    <Text style={styles.ctaButtonText}>Cozinhar agora</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.ctaSecondary}>
                    <Ionicons name="add-circle-outline" size={18} color={colors.text.primary} />
                    <Text style={styles.ctaSecondaryText}>Adicionar ao plano</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}

        {!recipe && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color={colors.text.disabled} />
            <Text style={styles.emptyStateText}>
              Cole uma receita acima e clique em "Fitzar receita" para ver as transformações
            </Text>
          </View>
        )}
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
  title: {
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
  sectionTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    minHeight: 120,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.button,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.xl,
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
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  tabTextActive: {
    color: colors.button,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  loadingText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  resultsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recipeTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  explanation: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  scoresRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  impactSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.quaternary,
    marginBottom: spacing.sm,
  },
  swapsSection: {
    marginBottom: spacing.lg,
  },
  swapItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  swapOriginal: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
    textDecorationLine: 'line-through',
  },
  swapNew: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  swapReason: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  ctaButton: {
    flex: 1,
    backgroundColor: colors.button,
    paddingVertical: spacing.md,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  ctaButtonText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.buttonText,
  },
  ctaSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  ctaSecondaryText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyStateText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});

