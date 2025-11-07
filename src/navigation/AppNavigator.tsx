/**
 * Main App Navigator
 * Handles navigation structure: Onboarding, Main Tabs, and Modals
 */

import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import storageService from '../services/storage/storage';

// Screens (will be created)
import RecipesScreen from '../screens/recipes/RecipesScreen';
import ExploreScreen from '../screens/explore/ExploreScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Onboarding screens (will be created)
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import ObjectivesScreen from '../screens/onboarding/ObjectivesScreen';
import RestrictionsScreen from '../screens/onboarding/RestrictionsScreen';
import PreferencesScreen from '../screens/onboarding/PreferencesScreen';
import HealthConnectScreen from '../screens/onboarding/HealthConnectScreen';

// Modals
import FitSwapScreen from '../screens/fitswap/FitSwapScreen';
import CookingModeScreen from '../screens/cooking/CookingModeScreen';
import PreferencesModalScreen from '../screens/profile/PreferencesScreen';
import GoalsScreen from '../screens/profile/GoalsScreen';
import PantryModeScreen from '../screens/pantry/PantryModeScreen';
import WeeklyPlanScreen from '../screens/planning/WeeklyPlanScreen';
import RecipesHomeScreen from '../screens/recipes/RecipesHomeScreen';
import RecipeDetailScreen from '../screens/recipes/RecipeDetailScreen';
import AIGeneratedRecipeScreen from '../screens/recipes/AIGeneratedRecipeScreen';

import type { RootStackParamList, OnboardingStackParamList, MainTabsParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabsParamList>();

// Onboarding Navigator
function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="Objectives" component={ObjectivesScreen} />
      <OnboardingStack.Screen name="Restrictions" component={RestrictionsScreen} />
      <OnboardingStack.Screen name="Preferences" component={PreferencesScreen} />
      <OnboardingStack.Screen name="HealthConnect" component={HealthConnectScreen} />
    </OnboardingStack.Navigator>
  );
}

// Main Tabs Navigator
function MainTabsNavigator() {
  return (
    <MainTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(22, 22, 27, 0.92)',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.quaternary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <MainTabs.Screen
        name="Home"
        component={RecipesScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <MainTabs.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <MainTabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </MainTabs.Navigator>
  );
}

// Root Navigator
export default function AppNavigator() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  const checkOnboardingStatus = useCallback(async () => {
    const complete = await storageService.getOnboardingComplete();
    setIsOnboardingComplete(complete);
  }, []);

  useEffect(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  // Re-check onboarding status periodically when not complete
  // This allows the app to detect when onboarding finishes
  useEffect(() => {
    if (isOnboardingComplete === false) {
      const interval = setInterval(() => {
        checkOnboardingStatus();
      }, 500); // Check every 500ms while onboarding is in progress
      return () => clearInterval(interval);
    }
  }, [isOnboardingComplete, checkOnboardingStatus]);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {!isOnboardingComplete ? (
          <RootStack.Screen name="OnboardingStack" component={OnboardingNavigator} />
        ) : (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabsNavigator} />
            <RootStack.Group
              screenOptions={{
                presentation: 'modal',
                headerShown: false,
              }}
            >
              <RootStack.Screen name="FitSwapModal" component={FitSwapScreen} />
              <RootStack.Screen name="CookingModeModal" component={CookingModeScreen} />
              <RootStack.Screen name="PantryModeModal" component={PantryModeScreen} />
              <RootStack.Screen name="PreferencesModal" component={PreferencesModalScreen} />
              <RootStack.Screen name="GoalsModal" component={GoalsScreen} />
              <RootStack.Screen name="WeeklyPlanModal" component={WeeklyPlanScreen} />
              <RootStack.Screen name="RecipesHomeModal" component={RecipesHomeScreen} />
              <RootStack.Screen name="RecipeDetailModal" component={RecipeDetailScreen} />
              <RootStack.Screen name="AIGeneratedRecipeModal" component={AIGeneratedRecipeScreen} />
            </RootStack.Group>
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

