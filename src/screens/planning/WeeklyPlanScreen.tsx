/**
 * Weekly Plan Screen - Weekly meal planning
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../../theme';
import ImpactRow from '../../components/ImpactRow';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface DayPlan {
  day: string;
  date: string;
  isToday: boolean;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
}

const MOCK_WEEK_PLAN: DayPlan[] = [
  {
    day: 'Seg',
    date: '09',
    isToday: true,
    meals: [
      { id: '1', name: 'Aveia com frutas', time: '08:00', calories: 420, protein: 28, carbs: 55, fats: 12 },
      { id: '2', name: 'Salada de frango', time: '13:00', calories: 550, protein: 42, carbs: 45, fats: 18 },
      { id: '3', name: 'Salmão grelhado', time: '19:00', calories: 480, protein: 38, carbs: 30, fats: 22 },
    ],
    totalCalories: 1450,
    totalProtein: 108,
  },
  {
    day: 'Ter',
    date: '10',
    meals: [
      { id: '4', name: 'Omelete proteico', time: '08:00', calories: 380, protein: 32, carbs: 8, fats: 24 },
      { id: '5', name: 'Bowl de quinoa', time: '13:00', calories: 520, protein: 35, carbs: 65, fats: 15 },
      { id: '6', name: 'Peito de peru', time: '19:00', calories: 450, protein: 40, carbs: 25, fats: 18 },
    ],
    totalCalories: 1350,
    totalProtein: 107,
  },
  {
    day: 'Qua',
    date: '11',
    meals: [
      { id: '7', name: 'Smoothie verde', time: '08:00', calories: 350, protein: 20, carbs: 45, fats: 10 },
      { id: '8', name: 'Atum com batata', time: '13:00', calories: 480, protein: 38, carbs: 50, fats: 16 },
    ],
    totalCalories: 830,
    totalProtein: 58,
  },
  {
    day: 'Qui',
    date: '12',
    meals: [
      { id: '9', name: 'Panqueca proteica', time: '08:00', calories: 400, protein: 30, carbs: 40, fats: 14 },
      { id: '10', name: 'Frango ao curry', time: '13:00', calories: 560, protein: 45, carbs: 55, fats: 20 },
      { id: '11', name: 'Legumes grelhados', time: '19:00', calories: 320, protein: 15, carbs: 45, fats: 8 },
    ],
    totalCalories: 1280,
    totalProtein: 90,
  },
  {
    day: 'Sex',
    date: '13',
    meals: [
      { id: '12', name: 'Granola com iogurte', time: '08:00', calories: 390, protein: 25, carbs: 50, fats: 12 },
      { id: '13', name: 'Pasta de grão-de-bico', time: '13:00', calories: 500, protein: 30, carbs: 60, fats: 15 },
    ],
    totalCalories: 890,
    totalProtein: 55,
  },
];

export default function WeeklyPlanScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(MOCK_WEEK_PLAN);

  const weekTotal = weekPlan.reduce(
    (acc, day) => ({
      calories: acc.calories + day.totalCalories,
      protein: acc.protein + day.totalProtein,
    }),
    { calories: 0, protein: 0 }
  );

  const weekAverage = {
    calories: Math.round(weekTotal.calories / weekPlan.length),
    protein: Math.round(weekTotal.protein / weekPlan.length),
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Planejamento semanal</Text>
          <Text style={styles.subtitle}>6–12 de Novembro</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="download-outline" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="share-outline" size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Week Stats */}
        <View style={styles.statsCard}>
          <LinearGradient
            colors={[colors.primary + '15', colors.card]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="target" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{weekAverage.calories} kcal</Text>
              <Text style={styles.statLabel}>Média diária</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="food-apple" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{weekAverage.protein}g</Text>
              <Text style={styles.statLabel}>Proteína/dia</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="calendar-week" size={24} color={colors.text.primary} />
              <Text style={styles.statValue}>{weekPlan.length}/7</Text>
              <Text style={styles.statLabel}>Dias planejados</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="sparkles-outline" size={20} color={colors.primary} />
            <Text style={styles.quickActionText}>Preencher IA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <MaterialCommunityIcons name="food-off-outline" size={20} color={colors.state.warning} />
            <Text style={styles.quickActionText}>Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="repeat-outline" size={20} color={colors.text.primary} />
            <Text style={styles.quickActionText}>Duplicar</Text>
          </TouchableOpacity>
        </View>

        {/* Week Days */}
        <View style={styles.daysContainer}>
          {weekPlan.map((day, index) => (
            <View
              key={index}
              style={[styles.dayCard, day.isToday && styles.dayCardToday]}
            >
              <View style={styles.dayHeader}>
                <View>
                  <Text style={styles.dayName}>{day.day}</Text>
                  <Text style={styles.dayDate}>{day.date}</Text>
                </View>
                {day.isToday && (
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayBadgeText}>Hoje</Text>
                  </View>
                )}
                <View style={styles.dayTotal}>
                  <Text style={styles.dayTotalValue}>{day.totalCalories} kcal</Text>
                  <Text style={styles.dayTotalLabel}>{day.totalProtein}g P</Text>
                </View>
              </View>

              {day.meals.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  style={styles.mealItem}
                  activeOpacity={0.7}
                >
                  <View style={styles.mealIconContainer}>
                    <Ionicons
                      name={meal.time.includes('08') ? 'sunny-outline' : meal.time.includes('13') ? 'restaurant-outline' : 'moon-outline'}
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.mealContent}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealTime}>{meal.time}</Text>
                      <Text style={styles.mealMacros}>
                        {meal.calories} kcal • {meal.protein}g P
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.text.quaternary} />
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.addMealButton}>
                <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                <Text style={styles.addMealText}>Adicionar refeição</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Shopping List Section */}
        <View style={styles.shoppingSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialCommunityIcons name="cart-outline" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Lista de compras</Text>
            </View>
            <Text style={styles.sectionSubtitle}>8 itens</Text>
          </View>

          <View style={styles.shoppingList}>
            {[
              { item: 'Peito de frango', quantity: '1kg', checked: false },
              { item: 'Salmão', quantity: '500g', checked: true },
              { item: 'Quinoa', quantity: '500g', checked: false },
              { item: 'Aveia', quantity: '1kg', checked: true },
              { item: 'Banana', quantity: '10 un', checked: false },
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.shoppingItem}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                  {item.checked && (
                    <Ionicons name="checkmark" size={16} color={colors.button} />
                  )}
                </View>
                <Text
                  style={[
                    styles.shoppingItemText,
                    item.checked && styles.shoppingItemTextChecked,
                  ]}
                >
                  {item.item} {item.quantity && `• ${item.quantity}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="share-social-outline" size={18} color={colors.text.primary} />
            <Text style={styles.exportButtonText}>Exportar lista</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
    marginTop: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  statsCard: {
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  statValue: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extrabold,
    color: colors.text.primary,
  },
  statLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  quickActionText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  daysContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  dayCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayCardToday: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dayName: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  dayDate: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
    marginTop: spacing.xs,
  },
  todayBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  todayBadgeText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.extrabold,
    color: colors.button,
  },
  dayTotal: {
    alignItems: 'flex-end',
  },
  dayTotalValue: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  dayTotalLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
    marginTop: spacing.xs,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mealIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  mealContent: {
    flex: 1,
  },
  mealName: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  mealInfo: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  mealTime: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
  },
  mealMacros: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  addMealText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  shoppingSection: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  sectionSubtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.quaternary,
  },
  shoppingList: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
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
  shoppingItemText: {
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  shoppingItemTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.text.quaternary,
  },
  exportButton: {
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  exportButtonText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
});

