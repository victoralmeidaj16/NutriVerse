/**
 * Recipe Detail Screen - Full recipe view with ingredients and steps
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { ParsedRecipe, Ingredient, CookingStep } from '../../types/recipe';
import { NutritionInfo } from '../../types/nutrition';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProp = {
  params?: {
    recipeId: string;
    recipe?: ParsedRecipe;
    nutrition?: NutritionInfo;
  };
};

// Mock data for demonstration
const MOCK_RECIPE: ParsedRecipe = {
  id: '1',
  title: 'Ginger roasted tomato',
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

const MOCK_NUTRITION: NutritionInfo = {
  calories: 120,
  protein: 2.5,
  carbohydrates: 18,
  fats: 5,
  fiber: 3,
  sodium: 350,
};

// Emoji mapping for ingredients (iOS style)
const getIngredientEmoji = (ingredient: Ingredient): string => {
  const name = ingredient.name.toLowerCase();
  if (name.includes('tomate')) return '🍅';
  if (name.includes('gengibre') || name.includes('ginger')) return '🫚';
  if (name.includes('azeite') || name.includes('óleo')) return '🫒';
  if (name.includes('alho') || name.includes('garlic')) return '🧄';
  if (name.includes('sal')) return '🧂';
  if (name.includes('pimenta')) return '🌶️';
  if (name.includes('frango') || name.includes('chicken')) return '🍗';
  if (name.includes('peixe') || name.includes('fish')) return '🐟';
  if (name.includes('arroz') || name.includes('rice')) return '🍚';
  if (name.includes('batata')) return '🥔';
  if (name.includes('cebola')) return '🧅';
  if (name.includes('pão') || name.includes('bread')) return '🍞';
  if (name.includes('ovo') || name.includes('egg')) return '🥚';
  if (name.includes('leite') || name.includes('milk')) return '🥛';
  if (name.includes('queijo') || name.includes('cheese')) return '🧀';
  return '🥘'; // Default emoji
};

export default function RecipeDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  
  // Use route params or mock data
  const recipe = route.params?.recipe || MOCK_RECIPE;
  const nutrition = route.params?.nutrition || MOCK_NUTRITION;

  const handleCookPress = () => {
    navigation.navigate('CookingModeModal', {
      recipeId: recipe.id,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="bookmark-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Recipe Image Card with Nutrition Footer */}
        <View style={styles.imageCard}>
          {recipe.imageUrl ? (
            <Image
              source={{ uri: recipe.imageUrl }}
              style={styles.recipeImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.recipeImagePlaceholder} />
          )}
          
          {/* Nutrition Footer */}
          <View style={styles.nutritionFooter}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(nutrition.calories)}</Text>
              <Text style={styles.nutritionLabel}>kcal</Text>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(nutrition.carbohydrates)}g</Text>
              <Text style={styles.nutritionLabel}>Carboidratos</Text>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(nutrition.protein)}g</Text>
              <Text style={styles.nutritionLabel}>Proteína</Text>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{Math.round(nutrition.fats)}g</Text>
              <Text style={styles.nutritionLabel}>Gorduras</Text>
            </View>
          </View>
        </View>

        {/* Recipe Title and Info */}
        <View style={styles.titleSection}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          {recipe.description && (
            <Text style={styles.recipeDescription}>{recipe.description}</Text>
          )}
          <View style={styles.recipeMeta}>
            {recipe.servings && (
              <View style={styles.metaItem}>
                <Ionicons name="people-outline" size={16} color={colors.text.quaternary} />
                <Text style={styles.metaText}>{recipe.servings} porções</Text>
              </View>
            )}
            {recipe.totalTime && (
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color={colors.text.quaternary} />
                <Text style={styles.metaText}>{recipe.totalTime} min</Text>
              </View>
            )}
          </View>
        </View>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          <View style={styles.ingredientsList}>
            {recipe.ingredients.map((ingredient) => (
              <IngredientCard key={ingredient.id} ingredient={ingredient} />
            ))}
          </View>
        </View>

        {/* Preparation Steps Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modo de preparo</Text>
          <View style={styles.stepsList}>
            {recipe.steps.map((step, index) => (
              <StepCard key={step.id} step={step} stepNumber={index + 1} />
            ))}
          </View>
        </View>

        {/* Cooking Mode CTA */}
        <TouchableOpacity
          style={styles.cookButton}
          onPress={handleCookPress}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[colors.primary, '#047857']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Ionicons name="flash-outline" size={24} color={colors.buttonText} />
          <Text style={styles.cookButtonText}>Modo cozinhar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function IngredientCard({ ingredient }: { ingredient: Ingredient }) {
  const emoji = getIngredientEmoji(ingredient);
  
  return (
    <View style={styles.ingredientCard}>
      <View style={styles.ingredientEmojiContainer}>
        <Text style={styles.ingredientEmoji}>{emoji}</Text>
      </View>
      <View style={styles.ingredientContent}>
        <Text style={styles.ingredientName}>{ingredient.name}</Text>
        <Text style={styles.ingredientAmount}>
          {ingredient.amount} {ingredient.unit}
        </Text>
      </View>
    </View>
  );
}

function StepCard({ step, stepNumber }: { step: CookingStep; stepNumber: number }) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{stepNumber}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepInstruction}>{step.instruction}</Text>
        {step.timerRequired && step.duration && (
          <View style={styles.stepTimer}>
            <Ionicons name="timer-outline" size={14} color={colors.primary} />
            <Text style={styles.stepTimerText}>
              {Math.round(step.duration / 60)} min
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing['3xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  imageCard: {
    marginHorizontal: spacing.base,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.card,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  recipeImage: {
    width: '100%',
    height: 280,
  },
  recipeImagePlaceholder: {
    width: '100%',
    height: 280,
    backgroundColor: colors.border,
  },
  nutritionFooter: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.light1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  nutritionLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
  },
  nutritionDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  titleSection: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xl,
  },
  recipeTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  recipeDescription: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  recipeMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
  },
  section: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  ingredientsList: {
    gap: spacing.sm,
  },
  ingredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  ingredientEmojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.neutral.light1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  ingredientEmoji: {
    fontSize: 24,
  },
  ingredientContent: {
    flex: 1,
  },
  ingredientName: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  ingredientAmount: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
  },
  stepsList: {
    gap: spacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.buttonText,
  },
  stepContent: {
    flex: 1,
  },
  stepInstruction: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  stepTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  stepTimerText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  cookButton: {
    marginHorizontal: spacing.base,
    marginTop: spacing.lg,
    borderRadius: 20,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  cookButtonText: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.buttonText,
  },
});

