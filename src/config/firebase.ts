/**
 * Firebase Configuration and Initialization
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

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
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase Auth initialization failed:', error);
  }

  try {
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase Storage initialization failed:', error);
  }
} else {
  app = getApps()[0];
  database = getDatabase(app);
  auth = getAuth(app);
  storage = getStorage(app);
}

export { app, analytics, database, auth, storage };
export default app;

