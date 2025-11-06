/**
 * Welcome Screen - First screen of onboarding
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import type { OnboardingStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleStart = () => {
    navigation.navigate('Objectives');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[colors.background, colors.card]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>N</Text>
          </View>
        </View>

        <Text style={styles.title}>Bem-vindo ao NutriVerse</Text>
        <Text style={styles.subtitle}>
          O universo da sua saúde e alimentação
        </Text>

        <Text style={styles.description}>
          Vamos ajudá-lo a comer melhor todos os dias, com prazer e autonomia.
          Configure seu perfil em poucos passos.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleStart}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Vamos começar</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.button} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing['3xl'],
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primary + '40',
  },
  logoText: {
    fontSize: 64,
    fontWeight: '800',
    color: colors.button,
    fontFamily: typography.fontFamily.title,
  },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.extrabold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  description: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.lg,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 200,
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: typography.fontFamily.body,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.button,
  },
});

