import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AppNavigator from './AppNavigator';
import { LoginScreen } from '../screens/LoginScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ArtistDetailScreen } from '../screens/ArtistDetailScreen';
import { MarketDetailScreen } from '../screens/MarketDetailScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, onboarded } = useAuth();

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : !onboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={AppNavigator} />
            <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="MarketDetail" component={MarketDetailScreen} options={{ presentation: 'modal' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
