// enableScreens is called in index.ts to ensure early execution

import React, { useEffect, useState } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
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
        setFontsLoaded(true); // Always unblock
      }
    }
    loadFonts();

    // Run Data Checks
    runDataIntegrityChecks();
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#000000' }} />;
  }

  const AppContent = (
    <SafeAreaProvider initialMetrics={initialWindowMetrics} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0B0B0D' }}>
      <AuthProvider>
        <ToastProvider>
          <SettingsProvider>
            <View style={{ flex: 1, width: '100%', height: '100%' }}>
              <RootNavigator />
            </View>
          </SettingsProvider>
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* We use a strict container with a fixed aspect ratio and maximum bounds */}
        <View style={{
          width: '100%',
          height: '100%',
          maxWidth: 430,
          maxHeight: 932,
          aspectRatio: 9 / 16,
          backgroundColor: '#0B0B0D',
          // Crucial: we must allow children to flex inside this custom bounds box
          flex: 1,
        }}>
          {AppContent}
        </View>
      </View>
    );
  }

  return AppContent;
}

const styles = StyleSheet.create({});
