/**
 * SearchBar Component - Search input with quick actions
 */

import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onPhotoPress?: () => void;
  onPantryPress?: () => void;
  onSearchPress?: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onPhotoPress,
  onPantryPress,
  onSearchPress,
  placeholder = 'Cole uma receita, link ou texto...',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="search-outline" size={20} color={colors.text.quaternary} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.disabled}
          onFocus={onSearchPress}
        />
      </View>
      <View style={styles.actions}>
        {onPantryPress && (
          <TouchableOpacity style={styles.actionButton} onPress={onPantryPress}>
            <Ionicons name="cube-outline" size={18} color={colors.primary} />
            <Text style={styles.actionLabel}>Despensa</Text>
          </TouchableOpacity>
        )}
        {onPhotoPress && (
          <TouchableOpacity style={styles.actionButton} onPress={onPhotoPress}>
            <Ionicons name="camera-outline" size={18} color={colors.primary} />
            <Text style={styles.actionLabel}>Foto</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.styles.body,
    color: colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.card,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionLabel: {
    ...typography.styles.smallMedium,
    color: colors.text.primary,
  },
});

