/**
 * Explore Screen - Search and discover recipes
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import storageService from '../../services/storage/storage';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ExploreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    const searches = await storageService.getRecentSearches();
    setRecentSearches(searches);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await storageService.addRecentSearch(searchQuery);
      await loadRecentSearches();
      navigation.navigate('FitSwapModal', { inputType: 'text', initialValue: searchQuery });
    }
  };

  const handlePhotoPress = () => {
    navigation.navigate('FitSwapModal', { inputType: 'photo' });
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
    navigation.navigate('FitSwapModal', { inputType: 'text', initialValue: query });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color={colors.text.quaternary} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar receita ou alimento..."
              placeholderTextColor={colors.text.disabled}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.text.quaternary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.photoButton} onPress={handlePhotoPress}>
            <Ionicons name="camera-outline" size={24} color={colors.button} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handlePhotoPress}
          >
            <Ionicons name="camera-outline" size={24} color={colors.primary} />
            <Text style={styles.quickActionLabel}>Foto do prato</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('PantryModeModal')}
          >
            <Ionicons name="cube-outline" size={24} color={colors.primary} />
            <Text style={styles.quickActionLabel}>Modo Despensa</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Buscas recentes</Text>
            <View style={styles.recentSearches}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => handleRecentSearch(search)}
                >
                  <Ionicons name="time-outline" size={16} color={colors.text.quaternary} />
                  <Text style={styles.recentSearchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Recommended Recipes */}
        <Text style={styles.sectionTitle}>Receitas recomendadas</Text>
        <View style={styles.emptyState}>
          <Ionicons name="restaurant-outline" size={48} color={colors.text.disabled} />
          <Text style={styles.emptyStateText}>
            Toque para tirar foto ou buscar um alimento
          </Text>
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
  searchContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchInputContainer: {
    flex: 1,
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
  searchInput: {
    flex: 1,
    ...typography.styles.body,
    color: colors.text.primary,
  },
  photoButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  quickActionLabel: {
    ...typography.styles.smallMedium,
    color: colors.text.primary,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  recentSearches: {
    gap: spacing.sm,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentSearchText: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyStateText: {
    ...typography.styles.body,
    color: colors.text.quaternary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});

