import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { House, Search, TrendingUp, Briefcase, User } from 'lucide-react-native';
import { View } from 'react-native';

import { ExploreScreen } from '../screens/PlaceholderScreens';
import { HomeScreen } from '../screens/HomeScreen';
import { MarketsListScreen } from '../screens/MarketsListScreen';
import { PortfolioScreen } from '../screens/PortfolioScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, color, size }: { name: any; color: string; size: number }) => {
    const Icon = name;
    return <Icon color={color} size={size} />;
};

const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarStyle: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarActiveTintColor: COLORS.primary,
  tabBarInactiveTintColor: COLORS.textSecondary,
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={screenOptions}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon name={House} color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon name={Search} color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Markets" 
        component={MarketsListScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon name={TrendingUp} color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Portfolio" 
        component={PortfolioScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon name={Briefcase} color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <TabIcon name={User} color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}
