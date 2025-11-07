/**
 * Profile Screen - User profile and settings
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import MacroRing from '../../components/MacroRing';
import { getUserWithTargets, getDailyProgress } from '../../services/user/userService';
import { UserProfile } from '../../types/user';
import { MacroTargets, DailyProgress } from '../../types/nutrition';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [macroTargets, setMacroTargets] = useState<MacroTargets | null>(null);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [points, setPoints] = useState(1250);
  const [level, setLevel] = useState(5);
  const [badges, setBadges] = useState([
    { id: '1', name: 'Primeiro passo', icon: 'footsteps', unlocked: true },
    { id: '2', name: 'Semana completa', icon: 'calendar', unlocked: true },
    { id: '3', name: 'Mestre da proteína', icon: 'barbell', unlocked: true },
    { id: '4', name: '100 receitas', icon: 'restaurant', unlocked: false },
    { id: '5', name: '30 dias seguidos', icon: 'flame', unlocked: false },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { profile: userProfile, tdee: userTdee, macroTargets: targets } = await getUserWithTargets();
    const progress = await getDailyProgress();
    setProfile(userProfile);
    setTdee(userTdee);
    setMacroTargets(targets);
    setDailyProgress(progress);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Nível {level}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{profile?.name || 'Usuário'}</Text>
          {profile?.email && (
            <Text style={styles.userEmail}>{profile.email}</Text>
          )}
          
          {/* Points */}
          <View style={styles.pointsCard}>
            <Ionicons name="trophy" size={20} color={colors.primaryAmber} />
            <Text style={styles.pointsText}>{points.toLocaleString()} pontos</Text>
          </View>
        </View>

        {/* TDEE & Goals */}
        {tdee && macroTargets && (
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>TDEE</Text>
              <Text style={styles.statValue}>{tdee} kcal</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Meta diária</Text>
              <Text style={styles.statValue}>{macroTargets.calories} kcal</Text>
            </View>
          </View>
        )}

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

        {/* Badges Section */}
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Badges e conquistas</Text>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => (
              <View
                key={badge.id}
                style={[
                  styles.badgeCard,
                  !badge.unlocked && styles.badgeCardLocked,
                ]}
              >
                <View
                  style={[
                    styles.badgeIconContainer,
                    !badge.unlocked && styles.badgeIconContainerLocked,
                  ]}
                >
                  <Ionicons
                    name={badge.icon as any}
                    size={32}
                    color={badge.unlocked ? colors.primaryAmber : colors.text.quaternary}
                  />
                </View>
                <Text
                  style={[
                    styles.badgeName,
                    !badge.unlocked && styles.badgeNameLocked,
                  ]}
                  numberOfLines={2}
                >
                  {badge.name}
                </Text>
                {badge.unlocked && (
                  <View style={styles.badgeCheck}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  </View>
                )}
                {!badge.unlocked && (
                  <View style={styles.badgeLock}>
                    <Ionicons name="lock-closed" size={12} color={colors.text.quaternary} />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.settingsSection}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('GoalsModal')}
          >
            <Ionicons name="target-outline" size={24} color={colors.primary} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Metas e objetivos</Text>
              <Text style={styles.settingSubtitle}>Ajustar TDEE e macros</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.quaternary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('PreferencesModal')}
          >
            <Ionicons name="settings-outline" size={24} color={colors.primary} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Preferências</Text>
              <Text style={styles.settingSubtitle}>Restrições e configurações</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.quaternary} />
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
  userCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  avatarText: {
    ...typography.styles.h1,
    color: colors.button,
    fontSize: 32,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: colors.primaryAmber,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.background,
  },
  levelText: {
    ...typography.styles.caption,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.button,
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
  },
  pointsText: {
    ...typography.styles.bodySemibold,
    color: colors.text.primary,
  },
  userName: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.styles.body,
    color: colors.text.quaternary,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  statLabel: {
    ...typography.styles.small,
    color: colors.text.quaternary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  macroRings: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  badgesSection: {
    marginBottom: spacing.xl,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  badgeCard: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeCardLocked: {
    backgroundColor: colors.neutral.light1,
    borderColor: colors.border,
    borderWidth: 1,
  },
  badgeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.neutral.light1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badgeIconContainerLocked: {
    backgroundColor: colors.neutral.light2,
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.5,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  badgeNameLocked: {
    color: colors.text.quaternary,
    fontWeight: typography.fontWeight.medium,
  },
  badgeCheck: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  badgeLock: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.neutral.light2,
    borderRadius: 10,
    padding: 4,
  },
  settingsSection: {
    gap: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.styles.bodySemibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    ...typography.styles.small,
    color: colors.text.quaternary,
  },
});

