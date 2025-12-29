import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { LandingScreen } from '../screens/LandingScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { AuthEntryScreen } from '../screens/AuthEntryScreen';

import { OtpScreen } from '../screens/OtpScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { CreateAccountScreen } from '../screens/CreateAccountScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user, onboarded, splashLoading } = useAuth();
  
  if (splashLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        detachInactiveScreens={false} 
        screenOptions={{
           headerShown: false,
           presentation: 'card',
           animationEnabled: false,
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen 
          name="AuthEntry" 
          component={AuthEntryScreen} 
          options={{
            presentation: 'transparentModal',
            animationEnabled: true,
            cardOverlayEnabled: true,
          }}
        />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
