/**
 * Pantry Mode Screen - Generate recipes from pantry ingredients
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing } from '../../theme';
import { getOnboardingData } from '../../services/user/onboardingService';
import { Recipe } from '../../types/recipe';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://nutriversee.onrender.com';

export default function PantryModeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // Filters
  const [tasteFilter, setTasteFilter] = useState<'salgado' | 'doce' | 'ambos'>('ambos');
  const [alignedWithGoal, setAlignedWithGoal] = useState(true);
  const [fitnessLevel, setFitnessLevel] = useState(3);

  useEffect(() => {
    requestImagePermission();
  }, []);

  const requestImagePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
    }
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        // Parse ingredients from image
        await parseIngredientsFromImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para usar a câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        // Parse ingredients from image
        await parseIngredientsFromImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  const parseIngredientsFromImage = async (uri: string) => {
    setLoading(true);
    try {
      // Convert image to base64
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const base64 = base64data.split(',')[1];

        try {
          const apiResponse = await fetch(`${API_BASE_URL}/api/parse-pantry`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64 }),
          });

          if (!apiResponse.ok) {
            throw new Error('Failed to parse ingredients');
          }

          const data = await apiResponse.json();
          if (data.items && data.items.length > 0) {
            const detectedIngredients = data.items.map((item: any) => item.name);
            setIngredients([...ingredients, ...detectedIngredients]);
          }
        } catch (error) {
          console.error('Error parsing ingredients:', error);
          Alert.alert('Erro', 'Não foi possível identificar ingredientes na imagem.');
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error processing image:', error);
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível processar a imagem.');
    }
  };

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0 && !imageUri) {
      Alert.alert('Atenção', 'Adicione ingredientes ou uma imagem para gerar receitas.');
      return;
    }

    setGenerating(true);
    try {
      // Get user preferences
      const onboardingData = await getOnboardingData();
      const goal = onboardingData?.goal || 'general_health';
      const restrictions = onboardingData?.restrictions || [];

      // Prepare request
      const requestBody: any = {
        ingredients: ingredients,
        filters: {
          taste: tasteFilter,
          alignedWithGoal,
          fitnessLevel,
        },
        goal,
        restrictions,
      };

      // If image exists, include it
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          const base64 = base64data.split(',')[1];
          requestBody.image = base64;

          await generateRecipesFromRequest(requestBody);
        };

        reader.readAsDataURL(blob);
      } else {
        await generateRecipesFromRequest(requestBody);
      }
    } catch (error) {
      console.error('Error generating recipes:', error);
      Alert.alert('Erro', 'Não foi possível gerar receitas. Tente novamente.');
      setGenerating(false);
    }
  };

  const generateRecipesFromRequest = async (requestBody: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-recipes-from-pantry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipes');
      }

      const data = await response.json();
      
      // Navigate to recipe results or show in modal
      if (data.recipes && data.recipes.length > 0) {
        // Save to history
        const { default: storageService } = await import('../../services/storage/storage');
        const recipeData = data.recipes[0];
        
        // Convert to Recipe format with variants
        const recipe: Recipe = {
          id: recipeData.id,
          original: recipeData,
          variants: [{
            id: 'original',
            name: 'Original',
            recipe: recipeData,
            swaps: [],
            nutrition: recipeData.nutrition || {
              calories: 0,
              protein: 0,
              carbohydrates: 0,
              fats: 0,
            },
            healthScore: { value: 70, max: 100 },
            costScore: { value: 70, max: 100 },
          }],
        };
        
        const searchQuery = ingredients.join(', ') + (imageUri ? ' (com imagem)' : '');
        await storageService.addGeneratedRecipe(recipe, searchQuery);
        
        // Navigate to first recipe
        navigation.navigate('RecipeDetailModal', {
          recipeId: recipe.id,
          recipe: recipeData,
          nutrition: recipeData.nutrition,
        });
      } else {
        Alert.alert('Atenção', 'Nenhuma receita foi encontrada com os ingredientes fornecidos.');
      }
    } catch (error) {
      console.error('Error generating recipes:', error);
      Alert.alert('Erro', 'Não foi possível gerar receitas. Tente novamente.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Modo Despensa</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Section */}
        <View style={styles.imageSection}>
          {imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImageUri(null)}
              >
                <Ionicons name="close-circle" size={24} color={colors.state.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={48} color={colors.text.quaternary} />
              <Text style={styles.imagePlaceholderText}>
                Tire uma foto ou selecione uma imagem
              </Text>
              <View style={styles.imageButtons}>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={handleTakePhoto}
                >
                  <Ionicons name="camera" size={20} color={colors.primary} />
                  <Text style={styles.imageButtonText}>Tirar foto</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={handlePickImage}
                >
                  <Ionicons name="image-outline" size={20} color={colors.primary} />
                  <Text style={styles.imageButtonText}>Galeria</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Ingredients List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredientes</Text>
          <View style={styles.addIngredientContainer}>
            <TextInput
              style={styles.ingredientInput}
              placeholder="Adicionar ingrediente..."
              placeholderTextColor={colors.text.quaternary}
              value={newIngredient}
              onChangeText={setNewIngredient}
              onSubmitEditing={handleAddIngredient}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddIngredient}
            >
              <Ionicons name="add" size={24} color={colors.buttonText} />
            </TouchableOpacity>
          </View>

          {ingredients.length > 0 && (
            <View style={styles.ingredientsList}>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveIngredient(index)}
                  >
                    <Ionicons name="close-circle" size={20} color={colors.state.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filtros</Text>

          {/* Taste Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Tipo</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  tasteFilter === 'salgado' && styles.filterOptionActive,
                ]}
                onPress={() => setTasteFilter('salgado')}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    tasteFilter === 'salgado' && styles.filterOptionTextActive,
                  ]}
                >
                  Salgado
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  tasteFilter === 'doce' && styles.filterOptionActive,
                ]}
                onPress={() => setTasteFilter('doce')}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    tasteFilter === 'doce' && styles.filterOptionTextActive,
                  ]}
                >
                  Doce
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  tasteFilter === 'ambos' && styles.filterOptionActive,
                ]}
                onPress={() => setTasteFilter('ambos')}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    tasteFilter === 'ambos' && styles.filterOptionTextActive,
                  ]}
                >
                  Ambos
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Aligned with Goal */}
          <View style={styles.filterGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.filterLabel}>Alinhado com meu objetivo</Text>
              <TouchableOpacity
                style={[
                  styles.switch,
                  alignedWithGoal && styles.switchActive,
                ]}
                onPress={() => setAlignedWithGoal(!alignedWithGoal)}
              >
                <View
                  style={[
                    styles.switchThumb,
                    alignedWithGoal && styles.switchThumbActive,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Fitness Level */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Nível fitness: {fitnessLevel}</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>1</Text>
              <View style={styles.sliderTrack}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.sliderDot,
                      fitnessLevel >= level && styles.sliderDotActive,
                    ]}
                    onPress={() => setFitnessLevel(level)}
                  />
                ))}
              </View>
              <Text style={styles.sliderLabel}>5</Text>
            </View>
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, (loading || generating) && styles.generateButtonDisabled]}
          onPress={handleGenerateRecipes}
          disabled={loading || generating}
        >
          {generating ? (
            <ActivityIndicator color={colors.buttonText} />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color={colors.buttonText} />
              <Text style={styles.generateButtonText}>Gerar receitas</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Modal */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingModal}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Identificando ingredientes...</Text>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
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
  },
  title: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  imageSection: {
    marginBottom: spacing.xl,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  removeImageButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.xs,
  },
  imagePlaceholder: {
    height: 200,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  imagePlaceholderText: {
    ...typography.styles.body,
    color: colors.text.quaternary,
    textAlign: 'center',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  imageButtonText: {
    ...typography.styles.bodySemibold,
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  addIngredientContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  ingredientInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.styles.body,
    color: colors.text.primary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientsList: {
    gap: spacing.sm,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ingredientText: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  filterGroup: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    ...typography.styles.bodySemibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  filterOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterOptionText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  filterOptionTextActive: {
    color: colors.buttonText,
    fontWeight: typography.fontWeight.semibold,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: colors.primary,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.card,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sliderLabel: {
    ...typography.styles.small,
    color: colors.text.quaternary,
    width: 20,
  },
  sliderTrack: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  sliderDot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  sliderDotActive: {
    backgroundColor: colors.primary,
  },
  generateButton: {
    backgroundColor: colors.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: 16,
    marginTop: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    ...typography.styles.bodySemibold,
    fontSize: 16,
    color: colors.buttonText,
  },
  loadingModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing['2xl'],
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
});
