import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

import TestScreen from '../screens/TestScreen';
import { LandingScreen } from '../screens/LandingScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { AuthEntryScreen } from '../screens/AuthEntryScreen';

import { OtpScreen } from '../screens/OtpScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { CreateAccountScreen } from '../screens/CreateAccountScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';

import { GenreSelectionScreen } from '../screens/GenreSelectionScreen';
import AppNavigator from './AppNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { splashLoading, user, onboarded } = useAuth();

  if (splashLoading) {
    return <SplashScreen />;
  }

  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={'Landing'}
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background, flex: 1, width: '100%', height: '100%' },
            animation: 'none'
          }}
        >
          {user && onboarded ? (
            /* Main App */
            <Stack.Screen
              name="MainTabs"
              component={AppNavigator}
            />
          ) : (
            /* Auth Flow */
            <>
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen
                name="AuthEntry"
                component={AuthEntryScreen}
                options={{ presentation: 'transparentModal', animation: 'fade' }}
              />
              <Stack.Screen name="Otp" component={OtpScreen} />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ presentation: 'transparentModal', animation: 'fade' }}
              />
              <Stack.Screen
                name="CreateAccount"
                component={CreateAccountScreen}
                options={{ presentation: 'transparentModal', animation: 'fade' }}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ presentation: 'transparentModal', animation: 'fade' }}
              />
              <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
                options={{ presentation: 'transparentModal', animation: 'fade' }}
              />

              {/* Onboarding Flow */}
              <Stack.Screen
                name="GenreSelection"
                component={GenreSelectionScreen}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
