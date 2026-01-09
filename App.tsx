// enableScreens is called in index.ts to ensure early execution

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import * as Font from 'expo-font';
// Google Fonts imports removed - utilizing ClashDisplay locally
import TestScreen from './src/screens/TestScreen';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // User must add these files to assets/fonts/
          // 'ClashDisplay-Regular': require('./assets/fonts/ClashDisplay-Regular.otf'),
          // 'ClashDisplay-Medium': require('./assets/fonts/ClashDisplay-Medium.otf'),
          // 'ClashDisplay-Semibold': require('./assets/fonts/ClashDisplay-Semibold.otf'),
          // 'ClashDisplay-Bold': require('./assets/fonts/ClashDisplay-Bold.otf'),
          
          // Fallback mapping to prevent crash until files are added (mapping to valid system fonts or existing fonts if any)
          // For now, we keep the keys valid for the theme, but maybe map to something that exists if we can?
          // Actually, relying on system fallback if font not loaded.
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
