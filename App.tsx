import React from 'react';
import { StatusBar } from 'expo-status-bar';
import './src/services/firebase'; // Initialize Firebase
import { AuthProvider } from './src/contexts';
import { RootNavigator } from './src/navigation';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
