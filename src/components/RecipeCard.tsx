/**
 * RecipeCard Component - Recipe display card with SwapTabs
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../theme';
import ImpactRow from './ImpactRow';
import ScorePill from './ScorePill';
import { Recipe, RecipeVariant } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
  onCookPress?: () => void;
  onAddToPlanPress?: () => void;
  showSwapTabs?: boolean;
}

export default function RecipeCard({
  recipe,
  onPress,
  onCookPress,
  onAddToPlanPress,
  showSwapTabs = true,
}: RecipeCardProps) {
  const [activeVariant, setActiveVariant] = useState<RecipeVariant>(
    recipe.variants[0] || null
  );

  if (!activeVariant) {
    return null;
  }

  const variant = activeVariant;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {variant.recipe.imageUrl && (
        <Image
          source={{ uri: variant.recipe.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <LinearGradient
        colors={[
          'rgba(13, 15, 18, 0.85)',
          'rgba(13, 15, 18, 0.95)',
        ]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{variant.recipe.title}</Text>
        
        {variant.recipe.description && (
          <Text style={styles.description} numberOfLines={2}>
            {variant.recipe.description}
          </Text>
        )}

        {/* Swap Tabs */}
        {showSwapTabs && recipe.variants.length > 1 && (
          <View style={styles.tabs}>
            {recipe.variants.map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.tab,
                  activeVariant.id === v.id && styles.tabActive,
                ]}
                onPress={() => setActiveVariant(v)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeVariant.id === v.id && styles.tabTextActive,
                  ]}
                >
                  {v.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Impact Row */}
        <View style={styles.impactContainer}>
          <ImpactRow
            nutrition={variant.nutrition}
            showSodium
            showFiber
          />
        </View>

        {/* Scores */}
        <View style={styles.scoresRow}>
          <ScorePill type="health" value={variant.healthScore.value} />
          <ScorePill type="cost" value={variant.costScore.value} />
        </View>

        {/* CTAs */}
        <View style={styles.ctaRow}>
          {onCookPress && (
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={onCookPress}
            >
              <Ionicons name="flash-outline" size={18} color={colors.button} />
              <Text style={styles.ctaButtonText}>Cozinhar</Text>
            </TouchableOpacity>
          )}
          {onAddToPlanPress && (
            <TouchableOpacity
              style={styles.ctaSecondary}
              onPress={onAddToPlanPress}
            >
              <Ionicons name="add-circle-outline" size={18} color={colors.text.primary} />
              <Text style={styles.ctaSecondaryText}>Adicionar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.base,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
    minHeight: 300,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing.lg,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  tabTextActive: {
    color: colors.button,
  },
  impactContainer: {
    marginBottom: spacing.sm,
  },
  scoresRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  ctaSecondaryText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});

