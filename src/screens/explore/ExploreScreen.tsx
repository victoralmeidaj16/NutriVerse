/**
 * Explore Screen - Search and discover recipes
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Modal, ActivityIndicator, Alert } from 'react-native';
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatingRecipe, setGeneratingRecipe] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState<'original' | 'lean' | 'high_protein' | 'budget'>('original');
  const [activeVariant, setActiveVariant] = useState<RecipeVariant | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [generatedRecipesHistory, setGeneratedRecipesHistory] = useState<Recipe[]>([]);

  useEffect(() => {
    loadRecentSearches();
    loadSavedRecipes();
    loadRecommendedRecipes();
    loadGeneratedRecipesHistory();
    
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

  // Reload data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSavedRecipes();
      loadRecommendedRecipes();
      loadGeneratedRecipesHistory();
    });
    return unsubscribe;
  }, [navigation]);

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
    // Load favorite recipes from history
    const favoriteIds = await storageService.getFavoriteRecipes();
    const history = await storageService.getGeneratedRecipesHistory();
    const favorites = history.filter(r => favoriteIds.includes(r.id));
    setSavedRecipes(favorites);
  };

  const loadRecommendedRecipes = async () => {
    // Load recommended recipes based on favorites and last 5 searches
    const favoriteIds = await storageService.getFavoriteRecipes();
    const recentSearches = await storageService.getRecentSearches();
    const history = await storageService.getGeneratedRecipesHistory();
    
    // Get last 5 search queries
    const last5Searches = recentSearches.slice(0, 5);
    
    // Find recipes that match favorites or recent searches
    const recommended: Recipe[] = [];
    
    // Add recipes from favorites
    const favoriteRecipes = history.filter(r => favoriteIds.includes(r.id));
    recommended.push(...favoriteRecipes.slice(0, 3));
    
    // Add recipes from recent searches (last 5)
    const searchBasedRecipes = history.filter(r => {
      const recipeSearchQuery = (r as any).searchQuery || '';
      return last5Searches.some(search => 
        recipeSearchQuery.toLowerCase().includes(search.toLowerCase()) ||
        r.original.title.toLowerCase().includes(search.toLowerCase())
      );
    });
    
    // Remove duplicates and limit to 10
    const uniqueRecommended = Array.from(
      new Map([...recommended, ...searchBasedRecipes].map(r => [r.id, r])).values()
    ).slice(0, 10);
    
    setRecommendedRecipes(uniqueRecommended);
  };

  const loadGeneratedRecipesHistory = async () => {
    const history = await storageService.getGeneratedRecipesHistory();
    setGeneratedRecipesHistory(history);
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
    if (!searchQuery.trim()) return;
    
    setShowAutocomplete(false);
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
    
    await storageService.addRecentSearch(searchQuery);
    await loadRecentSearches();
    
    // Navigate to loading screen that will generate the recipe
    setGeneratingRecipe(true);
    
    try {
      // Get user preferences from Firebase
      const { getOnboardingData } = await import('../../services/user/onboardingService');
      const onboardingData = await getOnboardingData();
      const goal = onboardingData?.goal || 'general_health';
      const restrictions = onboardingData?.restrictions || [];
      
      // Parse recipe from text using OpenAI
      const { parseRecipeFromText } = await import('../../services/openai/openaiService');
      const parsedRecipe = await parseRecipeFromText(searchQuery);
      
      // Transform recipe with user's goal and restrictions
      const transformedRecipe = await transformRecipe(searchQuery, goal, {
        goal,
        restrictions,
      });
      
      // Update the parsed recipe title if available
      if (parsedRecipe.title) {
        transformedRecipe.original.title = parsedRecipe.title;
      }
      
      // Save to history
      await storageService.addGeneratedRecipe(transformedRecipe, searchQuery);
      await loadGeneratedRecipesHistory();
      await loadRecommendedRecipes();
      
      setRecipe(transformedRecipe);
      
      if (transformedRecipe.variants.length > 0) {
        const firstVariant = transformedRecipe.variants.find(v => v.id === activeTab) || transformedRecipe.variants[0];
        setActiveVariant(firstVariant);
        setActiveTab(firstVariant.id as any);
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      Alert.alert('Erro', 'Não foi possível gerar a receita. Tente novamente.');
    } finally {
      setGeneratingRecipe(false);
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
      {/* Dark Overlay when search is focused */}
      {isSearchFocused && (
        <TouchableOpacity
          style={styles.darkOverlay}
          activeOpacity={1}
          onPress={() => {
            setIsSearchFocused(false);
            searchInputRef.current?.blur();
          }}
        />
      )}

      {/* Loading Modal for Recipe Generation */}
      <Modal
        visible={generatingRecipe}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.loadingModalContainer}>
          <View style={styles.loadingModalContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingModalTitle}>Gerando receita</Text>
            <Text style={styles.loadingModalSubtitle}>
              Alinhando aos seus objetivos...
            </Text>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.title}>Ações</Text>
      </View>

      <View style={styles.content}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputWrapper, isSearchFocused && styles.searchInputWrapperFocused]}>
            <View style={[styles.searchInputContainer, isSearchFocused && styles.searchInputContainerFocused]}>
              <Ionicons name="search-outline" size={20} color={isSearchFocused ? colors.primary : colors.text.quaternary} />
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Digite a receita, prato ou comida que você quer fitzar..."
                placeholderTextColor={colors.text.quaternary}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  // Delay to allow autocomplete clicks
                  setTimeout(() => setIsSearchFocused(false), 200);
                }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => {
                  setSearchQuery('');
                  setRecipe(null);
                  setShowAutocomplete(false);
                  searchInputRef.current?.focus();
                }}>
                  <Ionicons name="close-circle" size={20} color={colors.text.quaternary} />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Autocomplete Suggestions */}
            {showAutocomplete && autocompleteSuggestions.length > 0 && isSearchFocused && (
              <View style={styles.autocompleteContainer}>
                {autocompleteSuggestions.map((item, index) => (
                  <TouchableOpacity
                    key={`suggestion-${index}`}
                    style={[
                      styles.autocompleteItem,
                      index === autocompleteSuggestions.length - 1 && styles.autocompleteItemLast
                    ]}
                    onPress={() => handleAutocompleteSelect(item)}
                  >
                    <Ionicons name="search-outline" size={18} color={colors.text.quaternary} />
                    <Text style={styles.autocompleteText}>{item}</Text>
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

        {/* Scrollable Content */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

        {/* Modo Despensa Card */}
        <TouchableOpacity
          style={styles.pantryCard}
          onPress={() => navigation.navigate('PantryModeModal')}
          activeOpacity={0.9}
        >
          <View style={styles.pantryCardContent}>
            <View style={styles.pantryCardHeader}>
              <View style={styles.pantryCardIconContainer}>
                <Ionicons name="cube-outline" size={32} color={colors.primary} />
              </View>
              <View style={styles.pantryCardTextContainer}>
                <Text style={styles.pantryCardTitle}>Modo Despensa</Text>
                <Text style={styles.pantryCardSubtitle}>
                  Receitas com o que você tem em casa
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.text.quaternary} />
          </View>
        </TouchableOpacity>

        {/* Generated Recipes History */}
        {generatedRecipesHistory.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Histórico de receitas geradas</Text>
            <FlatList
              data={generatedRecipesHistory}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.historyRecipeCard}
                  onPress={() => handleSavedRecipePress(item)}
                >
                  <View style={styles.historyRecipeHeader}>
                    <Ionicons name="time-outline" size={16} color={colors.text.quaternary} />
                    <Text style={styles.historyRecipeDate}>
                      {(item as any).generatedAt ? new Date((item as any).generatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : ''}
                    </Text>
                  </View>
                  <Text style={styles.historyRecipeTitle} numberOfLines={2}>
                    {item.original.title}
                  </Text>
                  {item.variants[0] && (
                    <View style={styles.historyRecipeNutrition}>
                      <Text style={styles.historyRecipeKcal}>
                        {Math.round(item.variants[0].nutrition.calories)} kcal
                      </Text>
                    </View>
                  )}
                  {(item as any).searchQuery && (
                    <Text style={styles.historyRecipeQuery} numberOfLines={1}>
                      "{((item as any).searchQuery || '').substring(0, 30)}..."
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </>
        )}

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

        {/* Suggested Recipes (based on favorites and last 5 searches) */}
        {recommendedRecipes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Sugestões para você</Text>
            <Text style={styles.sectionSubtitle}>
              Baseado nos seus favoritos e últimas pesquisas
            </Text>
            <FlatList
              data={recommendedRecipes}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => {
                const isFavorite = savedRecipes.some(r => r.id === item.id);
                return (
                  <TouchableOpacity
                    style={styles.recommendedRecipeCard}
                    onPress={() => handleSavedRecipePress(item)}
                  >
                    {isFavorite && (
                      <View style={styles.favoriteBadge}>
                        <Ionicons name="heart" size={14} color={colors.primary} />
                      </View>
                    )}
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
                );
              }}
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
                    onPress={() => navigation.navigate('RecipeDetailModal', {
                      recipeId: recipe.id,
                      recipe: activeVariant.recipe,
                      nutrition: activeVariant.nutrition,
                    })}
                  >
                    <Ionicons name="restaurant-outline" size={18} color={colors.buttonText} />
                    <Text style={styles.ctaButtonText}>Ver receita completa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.ctaButtonSecondary}
                    onPress={() => navigation.navigate('CookingModeModal', { recipeId: recipe.id, variantId: activeVariant.id })}
                  >
                    <Ionicons name="flash-outline" size={18} color={colors.primary} />
                    <Text style={styles.ctaButtonSecondaryText}>Modo cozinhar</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 5,
  },
  loadingModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModalContent: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing['2xl'],
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  loadingModalTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
    textAlign: 'center',
  },
  loadingModalSubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
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
    flex: 1,
    paddingHorizontal: spacing.base,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  searchContainer: {
    marginBottom: spacing.lg,
  },
  pantryCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  pantryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pantryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  pantryCardIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pantryCardTextContainer: {
    flex: 1,
  },
  pantryCardTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  pantryCardSubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    fontSize: 14,
  },
  searchInputWrapper: {
    marginBottom: spacing.md,
    zIndex: 10,
  },
  searchInputWrapperFocused: {
    zIndex: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.sm,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInputContainerFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: 0,
    margin: 0,
    textAlignVertical: 'center',
  },
  autocompleteContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 300,
    overflow: 'hidden',
  },
  autocompleteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  autocompleteItemLast: {
    borderBottomWidth: 0,
  },
  autocompleteText: {
    fontSize: 15,
    fontWeight: typography.fontWeight.regular,
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
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    ...typography.styles.small,
    color: colors.text.quaternary,
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
  ctaButtonSecondary: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  ctaButtonSecondaryText: {
    ...typography.styles.bodySemibold,
    color: colors.primary,
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
  historyRecipeCard: {
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
  historyRecipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  historyRecipeDate: {
    ...typography.styles.caption,
    color: colors.text.quaternary,
  },
  historyRecipeTitle: {
    ...typography.styles.bodySemibold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  historyRecipeNutrition: {
    marginTop: spacing.xs,
  },
  historyRecipeKcal: {
    ...typography.styles.smallSemibold,
    color: colors.primary,
  },
  historyRecipeQuery: {
    ...typography.styles.caption,
    color: colors.text.quaternary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  favoriteBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    zIndex: 1,
  },
});

