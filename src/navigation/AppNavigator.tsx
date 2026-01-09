import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { House, Search, User } from 'lucide-react-native';
import { View } from 'react-native';

import { ExploreScreen } from '../screens/PlaceholderScreens';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { UpdatesScreen } from '../screens/UpdatesScreen';
import { ArtistDetailScreen } from '../screens/ArtistDetailScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
};

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={() => null}
      screenOptions={screenOptions}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
      />
      <Tab.Screen 
        name="Updates" 
        component={UpdatesScreen} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} detachInactiveScreens={false}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
    </Stack.Navigator>
  );
}
