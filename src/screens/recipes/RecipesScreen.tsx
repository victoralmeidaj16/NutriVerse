/**
 * Recipes Screen - More faithful to the original web design
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../../theme';
import type { RootStackParamList, MainTabsParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList> & BottomTabNavigationProp<MainTabsParamList>;

// Mock Data - matching original
const categories = [
  { id: 1, label: 'Café', icon: '☕' },
  { id: 2, label: 'Almoço rápido', icon: '🍛' },
  { id: 3, label: 'Pré/Pós‑treino', icon: '💪' },
  { id: 4, label: 'Snacks', icon: '🍪' },
];

const veganRec = [
  { id: 1, title: 'Ginger roasted tomato', author: 'Mc Hustlker', rating: 4.9 },
  { id: 2, title: 'Rice pudding topped nuts', author: 'Tony Kotler', rating: 4.7 },
];

const news = [
  {
    id: 1,
    title: 'Chef Juna: Chicken Geprek with Cheddar, shares tips on plating',
    source: 'Food Daily',
  },
  {
    id: 2,
    title: '5 spices to level-up your winter soups',
    source: 'Kitchen Mag',
  },
];

export default function RecipesScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>OurAppFitFood</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="options-outline" size={16} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => {
                  (navigation as any).getParent()?.navigate('MainTabs', { screen: 'Profile' });
                }}
              >
                <Ionicons name="person-outline" size={16} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Greeting */}
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>
              Olá, usuário <Text style={styles.emoji}>👋</Text>
            </Text>
            <Text style={styles.greetingSubtitle}>
              Vamos cozinhar algo incrível hoje?
            </Text>
          </View>

          {/* Search */}
          <TouchableOpacity
            style={styles.searchRow}
            onPress={() => {
              (navigation as any).getParent()?.navigate('MainTabs', {
                screen: 'Explore',
                params: { focusSearch: true },
              });
            }}
            activeOpacity={0.8}
          >
            <View style={styles.searchContainer}>
              <Ionicons
                name="search-outline"
                size={20}
                color={colors.text.quaternary}
                style={styles.searchIcon}
              />
              <Text style={styles.searchInputPlaceholder}>Search your recipes</Text>
            </View>
          </TouchableOpacity>

          {/* AI Generated Recipe Banner */}
          <TouchableOpacity
            style={styles.aiRecipeCard}
            onPress={() => navigation.navigate('AIGeneratedRecipeModal')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[colors.primary, '#047857']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.aiRecipeContent}>
              <View style={styles.aiRecipeText}>
                <View style={styles.aiBadge}>
                  <Ionicons name="sparkles" size={16} color={colors.buttonText} />
                  <Text style={styles.aiBadgeText}>Gerado por IA</Text>
                </View>
                <Text style={styles.aiRecipeTitle}>
                  Receita personalizada{'\n'}gerada por IA
                </Text>
                <Text style={styles.aiRecipeSubtitle}>
                  Descubra receitas únicas criadas especialmente para você
                </Text>
                <TouchableOpacity
                  style={styles.aiRecipeButton}
                  onPress={() => navigation.navigate('AIGeneratedRecipeModal')}
                >
                  <Text style={styles.aiRecipeButtonText}>Gerar receita</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.button} />
                </TouchableOpacity>
              </View>
              <View style={styles.aiRecipeIconContainer}>
                <Ionicons name="sparkles" size={48} color={colors.buttonText} style={{ opacity: 0.3 }} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Category Section */}
          <SectionHeader title="Categorias rápidas" />
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <CategoryChip category={item} index={index} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />

          {/* Recommendation for vegan */}
          <SectionHeader title="Recommendation for vegan" />
          <View style={styles.recipesGrid}>
            {veganRec.map((r, idx) => (
              <RecipeCard key={r.id} recipe={r} index={idx} />
            ))}
          </View>

          {/* Today's news */}
          <SectionHeader title="Today's news" />
          <View style={styles.newsList}>
            {news.map((n, idx) => (
              <NewsCard key={n.id} news={n} index={idx} />
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <View style={styles.bottomNavContent}>
            <NavItem
              icon="home"
              label="Home"
              active
              onPress={() => {
                // Already on Home, do nothing
              }}
            />
            <NavItem
              icon="search-outline"
              label="Search"
              onPress={() => {
                (navigation as any).getParent()?.navigate('MainTabs', {
                  screen: 'Explore',
                  params: { focusSearch: true },
                });
              }}
            />
            <NavItem
              icon="newspaper-outline"
              label="News"
              onPress={() => {
                // Navigate to Community or keep here
              }}
            />
            <NavItem
              icon="bookmark-outline"
              label="Saved"
              onPress={() => {
                // Navigate to saved recipes
              }}
            />
            <NavItem
              icon="settings-outline"
              label="Settings"
              onPress={() => {
                (navigation as any).getParent()?.navigate('MainTabs', {
                  screen: 'Profile',
                });
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity>
        <Text style={styles.sectionCTA}>see all →</Text>
      </TouchableOpacity>
    </View>
  );
}

function CategoryChip({
  category,
  index,
}: {
  category: { id: number; label: string; icon: string };
  index: number;
}) {
  return (
    <TouchableOpacity style={styles.categoryChip}>
      <Text style={styles.categoryEmoji}>{category.icon}</Text>
      <Text style={styles.categoryLabel}>{category.label}</Text>
    </TouchableOpacity>
  );
}

function RecipeCard({
  recipe,
  index,
}: {
  recipe: { id: number; title: string; author: string; rating: number };
  index: number;
}) {
  const navigation = useNavigation<NavigationProp>();
  
  const handlePress = () => {
    // Navigate to recipe detail with mock data
    const mockRecipe = {
      id: recipe.id.toString(),
      title: recipe.title,
      description: 'A delicious and healthy roasted tomato dish with ginger',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      servings: 4,
      prepTime: 15,
      cookTime: 30,
      totalTime: 45,
      ingredients: [
        { id: '1', name: 'Tomate', amount: 500, unit: 'g', category: 'vegetable' },
        { id: '2', name: 'Gengibre', amount: 2, unit: 'colher de chá', category: 'spice' },
        { id: '3', name: 'Azeite de oliva', amount: 3, unit: 'colher de sopa', category: 'fat' },
        { id: '4', name: 'Alho', amount: 3, unit: 'dentes', category: 'vegetable' },
        { id: '5', name: 'Sal', amount: 1, unit: 'colher de chá', category: 'spice' },
        { id: '6', name: 'Pimenta preta', amount: 0.5, unit: 'colher de chá', category: 'spice' },
      ],
      steps: [
        {
          id: '1',
          order: 1,
          instruction: 'Pré-aqueça o forno a 200°C.',
          duration: 0,
        },
        {
          id: '2',
          order: 2,
          instruction: 'Corte os tomates ao meio e coloque em uma assadeira.',
          duration: 0,
        },
        {
          id: '3',
          order: 3,
          instruction: 'Misture o gengibre ralado, alho picado, azeite, sal e pimenta em uma tigela pequena.',
          duration: 0,
        },
        {
          id: '4',
          order: 4,
          instruction: 'Espalhe a mistura sobre os tomates.',
          duration: 0,
        },
        {
          id: '5',
          order: 5,
          instruction: 'Asse por 25-30 minutos até os tomates ficarem macios e levemente caramelizados.',
          duration: 1800,
          timerRequired: true,
        },
      ],
    };
    
    const mockNutrition = {
      calories: 120,
      protein: 2.5,
      carbohydrates: 18,
      fats: 5,
      fiber: 3,
      sodium: 350,
    };
    
    navigation.navigate('RecipeDetailModal', {
      recipeId: recipe.id.toString(),
      recipe: mockRecipe,
      nutrition: mockNutrition,
    });
  };
  
  return (
    <TouchableOpacity style={styles.recipeCard} onPress={handlePress}>
      <View style={styles.recipeImageContainer}>
        <View style={styles.recipeImagePlaceholder} />
        <RatingBadge value={recipe.rating} />
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle} numberOfLines={2}>
          {recipe.title}
        </Text>
        <View style={styles.recipeAuthorRow}>
          <View style={styles.chefIcon}>
            <Ionicons name="restaurant-outline" size={12} color={colors.text.quaternary} />
          </View>
          <Text style={styles.recipeAuthor}>{recipe.author}</Text>
          <Text style={styles.recipeDot}>●</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function RatingBadge({ value }: { value: number }) {
  return (
    <View style={styles.ratingBadge}>
      <Ionicons name="star" size={12} color="#FBBF24" />
      <Text style={styles.ratingText}> {value.toFixed(1)}</Text>
    </View>
  );
}

function NewsCard({
  news,
  index,
}: {
  news: { id: number; title: string; source: string };
  index: number;
}) {
  return (
    <TouchableOpacity style={styles.newsCard}>
      <View style={styles.newsImagePlaceholder} />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {news.title}
        </Text>
        <Text style={styles.newsSource}>{news.source}</Text>
      </View>
    </TouchableOpacity>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <View
        style={[
          styles.navIconContainer,
          active && styles.navIconContainerActive,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={active ? colors.text.primary : colors.text.quaternary}
        />
      </View>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // neutral-50 equivalent
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: '#171717', // neutral-900
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  greeting: {
    fontFamily: typography.fontFamily.body,
    fontSize: 15,
    color: '#525252', // neutral-600
  },
  emoji: {
    fontSize: 15,
  },
  greetingSubtitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: '#171717', // neutral-900
    marginTop: spacing.xs,
  },
  searchRow: {
    marginBottom: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInputPlaceholder: {
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.text.disabled,
  },
  aiRecipeCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  aiRecipeContent: {
    flexDirection: 'row',
    padding: spacing.lg,
    alignItems: 'center',
  },
  aiRecipeText: {
    flex: 1,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  aiBadgeText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
  aiRecipeTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  aiRecipeSubtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  aiRecipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  aiRecipeButtonText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.button,
  },
  aiRecipeIconContainer: {
    width: 96,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: 15,
    fontWeight: typography.fontWeight.semibold,
    color: '#171717',
  },
  sectionCTA: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: '#059669', // emerald-700
  },
  categoriesList: {
    gap: spacing.sm,
    paddingRight: spacing.base,
  },
  categoryChip: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: '#F5F5F5', // neutral-100
    borderWidth: 1,
    borderColor: '#E5E5E5', // neutral-200
    padding: spacing.sm,
    marginRight: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  categoryLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: '#404040', // neutral-700
    textAlign: 'center',
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  recipeCard: {
    width: '47%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0', // Very light border for subtle separation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  recipeImageContainer: {
    height: 112,
    backgroundColor: '#E5E5E5',
    position: 'relative',
  },
  recipeImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5E5E5',
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingText: {
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: '#171717',
  },
  bookmarkButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7F3D0', // emerald-200
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeContent: {
    padding: spacing.md,
  },
  recipeTitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: '#171717',
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  recipeAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  chefIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeAuthor: {
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    color: '#737373', // neutral-500
  },
  recipeDot: {
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    color: '#059669', // emerald-600
  },
  newsList: {
    gap: spacing.md,
    marginBottom: spacing.base,
  },
  newsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  newsImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: '#171717',
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
  newsSource: {
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    color: '#737373', // neutral-500
  },
  bottomNav: {
    position: 'absolute',
    bottom: spacing.base,
    left: spacing.base,
    right: spacing.base,
    zIndex: 50,
  },
  bottomNavContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconContainerActive: {
    backgroundColor: '#171717',
  },
  navLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    color: '#737373',
  },
  navLabelActive: {
    color: '#171717',
  },
});

