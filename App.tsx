import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

// Disable native screens to fix the specific "boolean vs string" Fabric crash


import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import * as Font from 'expo-font';
import { Oswald_700Bold } from '@expo-google-fonts/oswald';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Oswald_700Bold,
          Inter_400Regular,
          Inter_700Bold,
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn('Error loading fonts', e);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#000000' }} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
