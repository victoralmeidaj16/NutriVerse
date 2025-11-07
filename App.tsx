import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import './src/config/firebase'; // Initialize Firebase

export default function App() {
  useEffect(() => {
    // Firebase is initialized in the config file
    console.log('Firebase initialized');
  }, []);

  return <AppNavigator />;
}
