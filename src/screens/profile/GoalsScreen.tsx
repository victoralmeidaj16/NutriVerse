/**
 * Goals Screen - TDEE calculator and macro targets
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { calculateTDEE, calculateMacroTargets } from '../../services/user/userService';
import { ActivityLevel } from '../../types/user';
import storageService from '../../services/storage/storage';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentário' },
  { value: 'light', label: 'Leve' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'active', label: 'Ativo' },
  { value: 'very_active', label: 'Muito ativo' },
];

export default function GoalsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [tdee, setTdee] = useState<number | null>(null);
  const [macroTargets, setMacroTargets] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const profile = await storageService.getUserProfile();
    if (profile) {
      if (profile.weight) setWeight(profile.weight.toString());
      if (profile.height) setHeight(profile.height.toString());
      if (profile.age) setAge(profile.age.toString());
      if (profile.gender) setGender(profile.gender);
      if (profile.activityLevel) setActivityLevel(profile.activityLevel);
    }
  };

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (w && h && a) {
      const calculatedTDEE = calculateTDEE(w, h, a, gender, activityLevel);
      const targets = calculateMacroTargets(calculatedTDEE, 'general_health');
      setTdee(calculatedTDEE);
      setMacroTargets(targets);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Metas e objetivos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Informações básicas</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Ex: 70"
            placeholderTextColor={colors.text.disabled}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Altura (cm)</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder="Ex: 175"
            placeholderTextColor={colors.text.disabled}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Idade</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Ex: 30"
            placeholderTextColor={colors.text.disabled}
            keyboardType="number-pad"
          />
        </View>

        <Text style={styles.sectionTitle}>Gênero</Text>
        <View style={styles.genderOptions}>
          {(['male', 'female', 'other'] as const).map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genderOption, gender === g && styles.genderOptionSelected]}
              onPress={() => setGender(g)}
            >
              <Text style={[styles.genderText, gender === g && styles.genderTextSelected]}>
                {g === 'male' ? 'Masculino' : g === 'female' ? 'Feminino' : 'Outro'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Nível de atividade</Text>
        {ACTIVITY_LEVELS.map((level) => (
          <TouchableOpacity
            key={level.value}
            style={[
              styles.activityOption,
              activityLevel === level.value && styles.activityOptionSelected,
            ]}
            onPress={() => setActivityLevel(level.value)}
          >
            <Text
              style={[
                styles.activityText,
                activityLevel === level.value && styles.activityTextSelected,
              ]}
            >
              {level.label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.calculateButton} onPress={calculate}>
          <Text style={styles.calculateButtonText}>Calcular TDEE</Text>
        </TouchableOpacity>

        {tdee && macroTargets && (
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Resultados</Text>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>TDEE</Text>
              <Text style={styles.resultValue}>{tdee} kcal</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Proteína</Text>
              <Text style={styles.resultValue}>{macroTargets.protein}g</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Carboidratos</Text>
              <Text style={styles.resultValue}>{macroTargets.carbohydrates}g</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Gorduras</Text>
              <Text style={styles.resultValue}>{macroTargets.fats}g</Text>
            </View>
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
  title: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.styles.bodySemibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.styles.body,
    color: colors.text.primary,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  genderOption: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  genderTextSelected: {
    color: colors.button,
  },
  activityOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  activityOptionSelected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  activityText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  activityTextSelected: {
    color: colors.primary,
  },
  calculateButton: {
    backgroundColor: colors.button,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  calculateButtonText: {
    ...typography.styles.bodySemibold,
    color: colors.buttonText,
    fontSize: 16,
  },
  resultsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xl,
  },
  resultsTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultLabel: {
    ...typography.styles.body,
    color: colors.text.quaternary,
  },
  resultValue: {
    ...typography.styles.bodySemibold,
    color: colors.text.primary,
  },
});

