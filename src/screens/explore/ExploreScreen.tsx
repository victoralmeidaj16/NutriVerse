/**
 * Explore Screen - Search and discover recipes
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import storageService from '../../services/storage/storage';
import { transformRecipe } from '../../services/fitswap/fitswapService';
import ImpactRow from '../../components/ImpactRow';
import ScorePill from '../../components/ScorePill';
import { Recipe, RecipeVariant } from '../../types/recipe';
import type { RootStackParamList, MainTabsParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList> & BottomTabNavigationProp<MainTabsParamList>;

// Mock autocomplete suggestions
const AUTCOMPLETE_SUGGESTIONS = [
  'Frango grelhado',
  'Arroz integral',
  'Salada de quinoa',
  'Salmão assado',
  'Omelete de claras',
  'Aveia com frutas',
  'Batata doce',
  'Peito de peru',
  'Iogurte grego',
  'Abacate',
  'Frango com batata doce',
  'Macarrão integral',
  'Hambúrguer de frango',
  'Pizza fitness',
  'Brownie de proteína',
];

export default function ExploreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const searchInputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState<'original' | 'lean' | 'high_protein' | 'budget'>('original');
  const [activeVariant, setActiveVariant] = useState<RecipeVariant | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    loadRecentSearches();
    loadSavedRecipes();
    loadRecommendedRecipes();
    
    // Check if we should focus search from navigation params
    const params = (route.params as any) || {};
    if (params.focusSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
    if (params.initialQuery) {
      setSearchQuery(params.initialQuery);
    }
  }, []);

  // Autocomplete logic
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const filtered = AUTCOMPLETE_SUGGESTIONS.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setAutocompleteSuggestions(filtered);
      setShowAutocomplete(filtered.length > 0);
    } else {
      setShowAutocomplete(false);
      setAutocompleteSuggestions([]);
    }
  }, [searchQuery]);

  const loadRecentSearches = async () => {
    const searches = await storageService.getRecentSearches();
    setRecentSearches(searches);
  };

  const loadSavedRecipes = async () => {
    // Load saved recipes from storage
    // For now, using mock data - in production, fetch from Firebase
    const favoriteIds = await storageService.getFavoriteRecipes();
    // Mock saved recipes - in production, fetch actual recipes by IDs
    const mockSaved: Recipe[] = [];
    setSavedRecipes(mockSaved);
  };

  const loadRecommendedRecipes = async () => {
    // Load recommended recipes based on user history
    // For now, using mock data - in production, use ML/AI recommendations
    const mockRecommended: Recipe[] = [];
    setRecommendedRecipes(mockRecommended);
  };

  const handleSavedRecipePress = (savedRecipe: Recipe) => {
    // Navigate to recipe detail or directly register
    navigation.navigate('RecipeDetailModal', {
      recipeId: savedRecipe.id,
      recipe: savedRecipe.original,
      nutrition: savedRecipe.variants[0]?.nutrition,
    });
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setShowAutocomplete(false);
      await storageService.addRecentSearch(searchQuery);
      await loadRecentSearches();
      
      // Process recipe transformation directly
      setLoading(true);
      try {
        const userPreferences = await storageService.getUserPreferences();
        const goal = userPreferences?.goal || 'general_health';
        
        const transformedRecipe = await transformRecipe(searchQuery, goal, userPreferences || undefined);
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
    }
  };

  const handlePhotoPress = () => {
    navigation.navigate('FitSwapModal', { inputType: 'photo' });
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
    setShowAutocomplete(false);
    // Trigger search automatically
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleAutocompleteSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowAutocomplete(false);
    // Trigger search automatically
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  useEffect(() => {
    if (recipe) {
      const variant = recipe.variants.find(v => v.id === activeTab) || recipe.variants[0];
      setActiveVariant(variant);
    }
  }, [recipe, activeTab]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search-outline" size={20} color={colors.text.quaternary} />
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Cole a receita, link ou texto que você quer fitzar..."
                placeholderTextColor={colors.text.quaternary}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => {
                  setSearchQuery('');
                  setRecipe(null);
                  setShowAutocomplete(false);
                }}>
                  <Ionicons name="close-circle" size={20} color={colors.text.quaternary} />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Autocomplete Suggestions */}
            {showAutocomplete && autocompleteSuggestions.length > 0 && (
              <View style={styles.autocompleteContainer}>
                {autocompleteSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.autocompleteItem}
                    onPress={() => handleAutocompleteSelect(suggestion)}
                  >
                    <Ionicons name="search-outline" size={16} color={colors.text.quaternary} />
                    <Text style={styles.autocompleteText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <TouchableOpacity
            style={[styles.searchButton, (!searchQuery.trim() || loading) && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={!searchQuery.trim() || loading}
          >
            <Text style={styles.searchButtonText}>
              {loading ? 'Processando...' : 'Fitzar receita'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handlePhotoPress}
          >
            <Ionicons name="camera-outline" size={24} color={colors.primary} />
            <Text style={styles.quickActionLabel}>Foto do prato</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('PantryModeModal')}
          >
            <Ionicons name="cube-outline" size={24} color={colors.primary} />
            <Text style={styles.quickActionLabel}>Modo Despensa</Text>
          </TouchableOpacity>
        </View>

        {/* Saved Recipes */}
        {savedRecipes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Receitas salvas</Text>
            <FlatList
              data={savedRecipes}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.savedRecipeCard}
                  onPress={() => handleSavedRecipePress(item)}
                >
                  <Ionicons name="bookmark" size={20} color={colors.primary} />
                  <Text style={styles.savedRecipeTitle} numberOfLines={2}>
                    {item.original.title}
                  </Text>
                  <Text style={styles.savedRecipeMeta}>
                    {item.original.servings} porções • {item.original.totalTime} min
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {/* Recommended Recipes */}
        {recommendedRecipes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Receitas recomendadas</Text>
            <FlatList
              data={recommendedRecipes}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recommendedRecipeCard}
                  onPress={() => handleSavedRecipePress(item)}
                >
                  {item.original.imageUrl && (
                    <View style={styles.recommendedRecipeImage}>
                      <Ionicons name="restaurant-outline" size={32} color={colors.text.quaternary} />
                    </View>
                  )}
                  <Text style={styles.recommendedRecipeTitle} numberOfLines={2}>
                    {item.original.title}
                  </Text>
                  {item.variants[0] && (
                    <View style={styles.recommendedRecipeNutrition}>
                      <Text style={styles.recommendedRecipeKcal}>
                        {Math.round(item.variants[0].nutrition.calories)} kcal
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Buscas recentes</Text>
            <View style={styles.recentSearches}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => handleRecentSearch(search)}
                >
                  <Ionicons name="time-outline" size={16} color={colors.text.quaternary} />
                  <Text style={styles.recentSearchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <Ionicons name="hourglass-outline" size={48} color={colors.primary} />
            <Text style={styles.loadingText}>Processando receita...</Text>
          </View>
        )}

        {/* Recipe Results */}
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
                    <Ionicons name="flash-outline" size={18} color={colors.buttonText} />
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

        {/* Empty State */}
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
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  searchContainer: {
    marginBottom: spacing.lg,
  },
  searchInputWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    ...typography.styles.body,
    color: colors.text.primary,
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
  },
  autocompleteContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    maxHeight: 200,
  },
  autocompleteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  autocompleteText: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  searchButton: {
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
  searchButtonDisabled: {
    opacity: 0.5,
  },
  searchButtonText: {
    ...typography.styles.bodySemibold,
    fontSize: 16,
    color: colors.buttonText,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  quickActionLabel: {
    ...typography.styles.smallMedium,
    color: colors.text.primary,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  recentSearches: {
    gap: spacing.sm,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentSearchText: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
  },
  loadingText: {
    ...typography.styles.body,
    color: colors.text.quaternary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 12,
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
    ...typography.styles.smallSemibold,
    color: colors.text.primary,
  },
  tabTextActive: {
    color: colors.buttonText,
  },
  resultsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  recipeTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  explanation: {
    ...typography.styles.small,
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
    ...typography.styles.smallSemibold,
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
    ...typography.styles.small,
    color: colors.text.quaternary,
    textDecorationLine: 'line-through',
  },
  swapNew: {
    ...typography.styles.smallSemibold,
    color: colors.primary,
  },
  swapReason: {
    ...typography.styles.caption,
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
    ...typography.styles.bodySemibold,
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
    backgroundColor: colors.card,
  },
  ctaSecondaryText: {
    ...typography.styles.bodySemibold,
    color: colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyStateText: {
    ...typography.styles.body,
    color: colors.text.quaternary,
    marginTop: spacing.md,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  horizontalList: {
    gap: spacing.md,
    paddingRight: spacing.base,
  },
  savedRecipeCard: {
    width: 160,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  savedRecipeTitle: {
    ...typography.styles.bodySemibold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  savedRecipeMeta: {
    ...typography.styles.caption,
    color: colors.text.quaternary,
  },
  recommendedRecipeCard: {
    width: 180,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  recommendedRecipeImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: colors.neutral.light1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  recommendedRecipeTitle: {
    ...typography.styles.bodySemibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  recommendedRecipeNutrition: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  recommendedRecipeKcal: {
    ...typography.styles.smallSemibold,
    color: colors.primary,
  },
});

