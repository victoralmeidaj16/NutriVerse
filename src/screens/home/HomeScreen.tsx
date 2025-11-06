/**
 * Home Screen - Main feed with personalized content
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../../theme';
import MacroRing from '../../components/MacroRing';
import SectionHeader from '../../components/SectionHeader';
import CategoryChip from '../../components/CategoryChip';
import SearchBar from '../../components/SearchBar';
import ImpactRow from '../../components/ImpactRow';
import ScorePill from '../../components/ScorePill';
import TipCard from '../../components/TipCard';
import ChallengeCard from '../../components/ChallengeCard';
import { getUserWithTargets, getDailyProgress } from '../../services/user/userService';
import { MacroTargets, DailyProgress } from '../../types/nutrition';
import { generateImage, generateRecipePrompt } from '../../services/openai/imageGeneration';
import storageService from '../../services/storage/storage';
import type { RootStackParamList, MainTabsParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList> & BottomTabNavigationProp<MainTabsParamList>;

const CATEGORIES = [
  { title: 'Café da manhã', icon: 'cafe-outline' },
  { title: 'Almoço rápido', icon: 'fast-food-outline' },
  { title: 'Pré-treino', icon: 'barbell-outline' },
  { title: 'Pós-treino', icon: 'fitness-outline' },
  { title: 'Snacks', icon: 'ice-cream-outline' },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [macroTargets, setMacroTargets] = useState<MacroTargets | null>(null);
  const [fitzarImage, setFitzarImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    loadData();
    loadFitzarImage();
  }, []);

  const loadData = async () => {
    const { macroTargets: targets } = await getUserWithTargets();
    const progress = await getDailyProgress();
    setMacroTargets(targets);
    setDailyProgress(progress);
  };

  const loadFitzarImage = async () => {
    setImageLoading(true);
    try {
      // Try to load cached image first
      const cachedImage = await storageService.getFitzarImage();
      
      if (cachedImage) {
        setFitzarImage(cachedImage);
        setImageLoading(false);
        return;
      }

      // If no cache, generate new image
      const prompt = generateRecipePrompt();
      const imageUrl = await generateImage(prompt);
      
      if (imageUrl) {
        setFitzarImage(imageUrl);
        // Save to cache
        await storageService.saveFitzarImage(imageUrl);
      }
    } catch (error) {
      console.error('Error loading fitzar image:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleFitSwap = (inputType?: 'text' | 'photo' | 'link') => {
    navigation.navigate('FitSwapModal', { inputType });
  };

  const remainingCalories = dailyProgress?.remaining.calories || 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bom dia</Text>
            <Text style={styles.subtitle}>
              Restam {remainingCalories} kcal hoje
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                // Navigate to Profile tab
                (navigation as any).getParent()?.navigate('MainTabs', { screen: 'Profile' });
              }}
            >
              <Ionicons name="person-circle-outline" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Macro Rings */}
        {dailyProgress && (
          <View style={styles.macroRings}>
            <MacroRing
              label="Proteína"
              value={`${Math.round(dailyProgress.consumed.protein)}g`}
              progress={dailyProgress.percentage.protein / 100}
            />
            <MacroRing
              label="Carbo"
              value={`${Math.round(dailyProgress.consumed.carbohydrates)}g`}
              progress={dailyProgress.percentage.carbohydrates / 100}
            />
            <MacroRing
              label="Gordura"
              value={`${Math.round(dailyProgress.consumed.fats)}g`}
              progress={dailyProgress.percentage.fats / 100}
            />
          </View>
        )}

        {/* Search Bar */}
        <SearchBar
          onPhotoPress={() => handleFitSwap('photo')}
          onPantryPress={() => navigation.navigate('PantryModeModal')}
          onSearchPress={() => handleFitSwap('text')}
        />

        {/* Fitzar Recipe Card */}
        <TouchableOpacity
          style={styles.fitzarCard}
          onPress={() => handleFitSwap()}
          activeOpacity={0.95}
        >
          {fitzarImage && (
            <Image
              source={{ uri: fitzarImage }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          )}
          <LinearGradient
            colors={[
              'rgba(13, 15, 18, 0.85)',
              'rgba(13, 15, 18, 0.75)',
              'rgba(13, 15, 18, 0.95)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.fitzarContent}>
            <View style={styles.fitzarIconContainer}>
              <Ionicons name="sparkles" size={48} color={colors.primary} />
            </View>
            <Text style={styles.fitzarTitle}>Fitzar receita</Text>
            <Text style={styles.fitzarSubtitle}>
              Transforme qualquer receita em uma versão alinhada ao seu objetivo
            </Text>
            <View style={styles.fitzarFeatures}>
              <View style={styles.fitzarFeature}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                <Text style={styles.fitzarFeatureText}>Preserva o sabor</Text>
              </View>
              <View style={styles.fitzarFeature}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                <Text style={styles.fitzarFeatureText}>Otimiza nutrição</Text>
              </View>
              <View style={styles.fitzarFeature}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                <Text style={styles.fitzarFeatureText}>IA inteligente</Text>
              </View>
            </View>
            <View style={styles.fitzarCTA}>
              <Text style={styles.fitzarCTAText}>Começar agora</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.button} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Weekly Plan Quick Access */}
        <TouchableOpacity
          style={styles.planCard}
          onPress={() => navigation.navigate('WeeklyPlanModal')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[colors.card, colors.cardElevated]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.planCardContent}>
            <View style={styles.planCardHeader}>
              <Ionicons name="calendar-outline" size={24} color={colors.primary} />
              <Text style={styles.planCardTitle}>Planejamento semanal</Text>
            </View>
            <Text style={styles.planCardSubtitle}>
              5 dias planejados • 1.280 kcal/dia em média
            </Text>
            <View style={styles.planCardFooter}>
              <Text style={styles.planCardCTA}>Ver planejamento</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Tip */}
        <TipCard tip="Dica: tente 30–35g de proteína no café para reduzir o apetite no almoço." />

        {/* Categories */}
        <SectionHeader title="Categorias rápidas" />
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <CategoryChip title={item.title} icon={item.icon as any} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />

        {/* Challenge */}
        <SectionHeader title="Desafio da semana" />
        <ChallengeCard
          title="7 dias batendo proteína"
          subtitle="Complete sua meta de proteína por 7 dias consecutivos"
          daysRemaining={5}
        />
      </ScrollView>
    </SafeAreaView>
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
  greeting: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroRings: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.base,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  spotlightCard: {
    marginHorizontal: spacing.base,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
  },
  spotlightContent: {
    padding: spacing.lg,
  },
  spotlightTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  spotlightMetrics: {
    marginBottom: spacing.md,
  },
  spotlightScores: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  spotlightButton: {
    backgroundColor: colors.button,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    alignItems: 'center',
  },
  spotlightButtonText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.buttonText,
  },
  fitzarCard: {
    marginHorizontal: spacing.base,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primary + '40',
    marginBottom: spacing.base,
    minHeight: 280,
  },
  fitzarContent: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  fitzarIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  fitzarTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.extrabold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  fitzarSubtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  fitzarFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  fitzarFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  fitzarFeatureText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  fitzarCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 16,
  },
  fitzarCTAText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.extrabold,
    color: colors.button,
  },
  planCard: {
    marginHorizontal: spacing.base,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
  },
  planCardContent: {
    padding: spacing.lg,
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  planCardTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  planCardSubtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  planCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planCardCTA: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  categoriesList: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
});

