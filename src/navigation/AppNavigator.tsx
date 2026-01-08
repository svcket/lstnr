import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { House, Search, User } from 'lucide-react-native';
import { View } from 'react-native';

import { ExploreScreen } from '../screens/PlaceholderScreens';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { UpdatesScreen } from '../screens/UpdatesScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
};

export default function AppNavigator() {
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
