/**
 * Recipes Home Screen - Recipe discovery and browsing
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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../../theme';
import SectionHeader from '../../components/SectionHeader';
import Button from '../../components/ui/Button';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CATEGORIES = [
  { id: 1, label: 'Café', icon: '☕' },
  { id: 2, label: 'Almoço rápido', icon: '🍛' },
  { id: 3, label: 'Pré/Pós‑treino', icon: '💪' },
  { id: 4, label: 'Snacks', icon: '🍪' },
];

const VEGAN_RECIPES = [
  {
    id: 1,
    title: 'Ginger roasted tomato',
    author: 'Mc Hustlker',
    rating: 4.9,
    imageUrl: null,
  },
  {
    id: 2,
    title: 'Rice pudding topped nuts',
    author: 'Tony Kotler',
    rating: 4.7,
    imageUrl: null,
  },
];

const NEWS = [
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

export default function RecipesHomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>OurAppFitFood</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="options-outline" size={20} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                (navigation as any).getParent()?.navigate('MainTabs', { screen: 'Profile' });
              }}
            >
              <Ionicons name="person-outline" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            Olá, usuário <Text style={styles.emoji}>👋</Text>
          </Text>
          <Text style={styles.greetingSubtitle}>
            Vamos cozinhar algo incrível hoje?
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color={colors.text.quaternary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your recipes"
              placeholderTextColor={colors.text.disabled}
            />
          </View>
        </View>

        {/* Premium Banner */}
        <View style={styles.premiumBanner}>
          <LinearGradient
            colors={[colors.card, colors.cardElevated]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.premiumContent}>
            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumSubtitle}>Go to premium now!</Text>
              <Text style={styles.premiumTitle}>
                Get access to amazing recipes{'\n'}from the world
              </Text>
              <View style={styles.premiumButtonContainer}>
                <Button
                  title="Start 7‑day FREE Trial"
                  onPress={() => {}}
                  variant="cta"
                />
              </View>
            </View>
            <View style={styles.premiumImagePlaceholder} />
          </View>
        </View>

        {/* Categories */}
        <SectionHeader title="Categorias rápidas" />
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryChip}>
              <Text style={styles.categoryEmoji}>{item.icon}</Text>
              <Text style={styles.categoryLabel}>{item.label}</Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />

        {/* Recommendation for vegan */}
        <SectionHeader title="Recommendation for vegan" />
        <View style={styles.recipesGrid}>
          {VEGAN_RECIPES.map((recipe) => (
            <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
              <View style={styles.recipeImageContainer}>
                <View style={styles.recipeImagePlaceholder} />
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#FBBF24" />
                  <Text style={styles.ratingText}>{recipe.rating.toFixed(1)}</Text>
                </View>
                <TouchableOpacity style={styles.bookmarkButton}>
                  <Ionicons name="bookmark-outline" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle} numberOfLines={2}>
                  {recipe.title}
                </Text>
                <View style={styles.recipeAuthor}>
                  <View style={styles.chefIcon}>
                    <Ionicons name="restaurant-outline" size={12} color={colors.text.quaternary} />
                  </View>
                  <Text style={styles.recipeAuthorText}>{recipe.author}</Text>
                  <Text style={styles.recipeDot}>●</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's news */}
        <SectionHeader title="Today's news" />
        <View style={styles.newsList}>
          {NEWS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.newsCard}>
              <View style={styles.newsImagePlaceholder} />
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.newsSource}>{item.source}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.bottomNavContent}>
          <NavItem icon="home" label="Home" active />
          <NavItem icon="search-outline" label="Search" />
          <NavItem icon="newspaper-outline" label="News" />
          <NavItem icon="bookmark-outline" label="Saved" />
          <NavItem icon="settings-outline" label="Settings" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.navItem}>
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
      <Text
        style={[styles.navLabel, active && styles.navLabelActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 120, // Extra padding for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
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
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingContainer: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.sm,
  },
  greeting: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  emoji: {
    fontSize: typography.fontSize.base,
  },
  greetingSubtitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  premiumBanner: {
    marginHorizontal: spacing.base,
    marginTop: spacing.lg,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  premiumContent: {
    flexDirection: 'row',
    padding: spacing.lg,
    alignItems: 'center',
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumSubtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    opacity: 0.9,
  },
  premiumTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  premiumButtonContainer: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },
  premiumImagePlaceholder: {
    width: 96,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.border,
    opacity: 0.1,
  },
  categoriesList: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  recipeCard: {
    width: '47%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recipeImageContainer: {
    height: 112,
    backgroundColor: colors.border,
    position: 'relative',
  },
  recipeImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.border,
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  bookmarkButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary + '40',
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
    color: colors.text.primary,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  recipeAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  chefIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeAuthorText: {
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    color: colors.text.quaternary,
  },
  recipeDot: {
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    color: colors.primary,
  },
  newsList: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  newsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  newsImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
  newsSource: {
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    color: colors.text.quaternary,
  },
  bottomNav: {
    position: 'absolute',
    bottom: spacing.base,
    left: spacing.base,
    right: spacing.base,
    zIndex: 50,
  },
  bottomNavContent: {
    backgroundColor: 'rgba(22, 22, 27, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconContainerActive: {
    backgroundColor: colors.cardElevated,
  },
  navLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    color: colors.text.quaternary,
  },
  navLabelActive: {
    color: colors.primary,
  },
});

