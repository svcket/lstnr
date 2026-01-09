import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

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
  
  if (__DEV__) {
    console.log('[RootNavigator] onboarded:', onboarded, '(', typeof onboarded, ')');
    console.log('[RootNavigator] splashLoading:', splashLoading, '(', typeof splashLoading, ')');
    
    if (typeof onboarded !== 'boolean') console.error('CRITICAL: onboarded is NOT boolean (actual: ' + typeof onboarded + ')');
    if (typeof splashLoading !== 'boolean') console.error('CRITICAL: splashLoading is NOT boolean (actual: ' + typeof splashLoading + ')');
  }
  
  if (splashLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={user && Boolean(onboarded) ? 'MainTabs' : 'Landing'}
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
