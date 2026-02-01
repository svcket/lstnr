// enableScreens is called in index.ts to ensure early execution

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import * as Font from 'expo-font';
// Google Fonts imports removed - utilizing ClashDisplay locally
import TestScreen from './src/screens/TestScreen';

import { runDataIntegrityChecks } from './src/utils/devAssertions';

import { ToastProvider } from './src/context/ToastContext';
import { SettingsProvider } from './src/context/SettingsContext';

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
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn('Error loading fonts', e);
      }
    }
    loadFonts();
    
    // Run Data Checks
    runDataIntegrityChecks();
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#000000' }} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastProvider>
           <SettingsProvider>
              <RootNavigator />
           </SettingsProvider>
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
