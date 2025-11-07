/**
 * Firebase Configuration and Initialization
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getDatabase, Database } from 'firebase/database';
import { initializeAuth, getAuth, Auth, getReactNativePersistence } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAuqN08fxvXb2ZMSvVhUjaYZutltxaq7y4',
  authDomain: 'fitswap---nutriverse.firebaseapp.com',
  databaseURL: 'https://fitswap---nutriverse-default-rtdb.firebaseio.com',
  projectId: 'fitswap---nutriverse',
  storageBucket: 'fitswap---nutriverse.firebasestorage.app',
  messagingSenderId: '939251100449',
  appId: '1:939251100449:web:188e078ffabb3f6c8b2c60',
  measurementId: 'G-EQCPJ6CS80',
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | null = null;
let database: Database | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

// Only initialize if not already initialized
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  
  // Initialize services
  try {
    // Analytics only works on web
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.warn('Firebase Analytics initialization failed:', error);
  }

  try {
    database = getDatabase(app);
  } catch (error) {
    console.warn('Firebase Database initialization failed:', error);
  }

  try {
    // Use initializeAuth with AsyncStorage for React Native persistence
    // This is required for React Native to persist auth state
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });
      console.log('Firebase Auth initialized with AsyncStorage persistence');
    } catch (initError: any) {
      // If already initialized, get the existing instance
      if (initError.code === 'auth/already-initialized') {
        console.log('Firebase Auth already initialized, getting existing instance');
        auth = getAuth(app);
      } else {
        console.warn('Firebase Auth initialization error:', initError);
        // Try to get existing instance
        try {
          auth = getAuth(app);
          console.log('Using existing Firebase Auth instance');
        } catch (getAuthError) {
          console.error('Failed to get Firebase Auth instance:', getAuthError);
        }
      }
    }
  } catch (error) {
    console.error('Firebase Auth initialization failed:', error);
    // Last resort: try to get existing instance
    try {
      auth = getAuth(app);
      console.log('Using fallback Firebase Auth instance');
    } catch (fallbackError) {
      console.error('Firebase Auth fallback failed:', fallbackError);
    }
  }

  try {
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase Storage initialization failed:', error);
  }
} else {
  app = getApps()[0];
  database = getDatabase(app);
  // Try to get existing auth instance, or initialize if needed
  try {
    auth = getAuth(app);
  } catch (error) {
    // If auth doesn't exist, initialize it with AsyncStorage
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });
      console.log('Firebase Auth initialized with AsyncStorage (else block)');
    } catch (initError: any) {
      if (initError.code === 'auth/already-initialized') {
        auth = getAuth(app);
      } else {
        console.warn('Failed to initialize auth in else block:', initError);
        auth = getAuth(app);
      }
    }
  }
  storage = getStorage(app);
}

export { app, analytics, database, auth, storage };
export default app;

