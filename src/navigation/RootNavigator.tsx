import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { useAuth } from '../context/AuthContext';

// Disable native screens to fix Fabric prop mismatch crash
enableScreens(false);
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

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { splashLoading, user, onboarded } = useAuth();
  
  console.log("DEBUG: splashLoading:", splashLoading, typeof splashLoading);
  console.log("DEBUG: onboarded:", onboarded, typeof onboarded);
  console.log("DEBUG: user:", user, typeof user);
  
  if (splashLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={user && onboarded ? 'MainTabs' : 'Landing'}
        detachInactiveScreens={false}
        screenOptions={{
           headerShown: false,
        }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen 
          name="AuthEntry" 
          component={AuthEntryScreen} 
        />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
        />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPasswordScreen} 
        />

        {/* Onboarding Flow */}
        <Stack.Screen 
          name="GenreSelection" 
          component={GenreSelectionScreen}
        />

        {/* Main App */}
        <Stack.Screen 
           name="MainTabs" 
           component={AppNavigator} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
