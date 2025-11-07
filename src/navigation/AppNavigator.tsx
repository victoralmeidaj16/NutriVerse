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
import { auth } from '../config/firebase';
import { firebaseAuth } from '../services/firebase/firebaseService';
import { isOnboardingComplete } from '../services/user/onboardingService';
import { User } from 'firebase/auth';

// Screens (will be created)
import RecipesScreen from '../screens/recipes/RecipesScreen';
import ExploreScreen from '../screens/explore/ExploreScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Onboarding screens (will be created)
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import ObjectivesScreen from '../screens/onboarding/ObjectivesScreen';
import RestrictionsScreen from '../screens/onboarding/RestrictionsScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import LoginScreen from '../screens/auth/LoginScreen';

// Modals
import FitSwapScreen from '../screens/fitswap/FitSwapScreen';
import CookingModeScreen from '../screens/cooking/CookingModeScreen';
import PreferencesModalScreen from '../screens/profile/PreferencesScreen';
import GoalsScreen from '../screens/profile/GoalsScreen';
import PantryModeScreen from '../screens/pantry/PantryModeScreen';
import RecipesHomeScreen from '../screens/recipes/RecipesHomeScreen';
import RecipeDetailScreen from '../screens/recipes/RecipeDetailScreen';
import AIGeneratedRecipeScreen from '../screens/recipes/AIGeneratedRecipeScreen';

import type { RootStackParamList, OnboardingStackParamList, MainTabsParamList } from './types';

import { OnboardingProvider } from '../contexts/OnboardingContext';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabsParamList>();

// Onboarding Navigator

function OnboardingNavigator() {
  return (
    <OnboardingProvider>
      <OnboardingStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
        <OnboardingStack.Screen name="Objectives" component={ObjectivesScreen} />
        <OnboardingStack.Screen name="Restrictions" component={RestrictionsScreen} />
        <OnboardingStack.Screen name="SignUp" component={SignUpScreen} />
        <OnboardingStack.Screen name="Login" component={LoginScreen} />
      </OnboardingStack.Navigator>
    </OnboardingProvider>
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
  const [user, setUser] = useState<User | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  const checkAuthAndOnboarding = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      console.log('Checking auth and onboarding, user:', currentUser?.uid || 'null');
      setUser(currentUser);

      if (currentUser) {
        const complete = await isOnboardingComplete();
        console.log('Onboarding complete status:', complete);
        setOnboardingComplete(complete);
      } else {
        console.log('No user, setting onboardingComplete to false');
        setOnboardingComplete(false);
      }
    } catch (error) {
      console.error('Error checking auth/onboarding:', error);
      setOnboardingComplete(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthAndOnboarding();

    // Listen to auth state changes
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (authUser) => {
      console.log('Auth state changed, user:', authUser?.uid || 'null');
      setUser(authUser);
      if (authUser) {
        const complete = await isOnboardingComplete();
        console.log('Onboarding complete status (from listener):', complete);
        setOnboardingComplete(complete);
      } else {
        console.log('User logged out, setting onboardingComplete to false');
        setOnboardingComplete(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [checkAuthAndOnboarding]);

  // Re-check onboarding status periodically when not complete
  useEffect(() => {
    if (user && onboardingComplete === false) {
      console.log('Setting up interval to check onboarding status');
      const interval = setInterval(async () => {
        const complete = await isOnboardingComplete();
        console.log('Periodic check - onboarding complete:', complete);
        if (complete) {
          setOnboardingComplete(complete);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [user, onboardingComplete]);

  console.log('AppNavigator render - user:', user?.uid || 'null', 'onboardingComplete:', onboardingComplete, 'loading:', loading);

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {!user ? (
          // Not authenticated - show Welcome first (onboarding)
          <RootStack.Screen name="OnboardingStack" component={OnboardingNavigator} />
        ) : !onboardingComplete ? (
          // Authenticated but onboarding not complete
          <RootStack.Screen name="OnboardingStack" component={OnboardingNavigator} />
        ) : (
          // Authenticated and onboarding complete - show main app
          <>
            <RootStack.Screen name="MainTabs" component={MainTabsNavigator} />
            <RootStack.Screen name="Login" component={LoginScreen} />
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

