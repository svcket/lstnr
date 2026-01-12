import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { House, Search, User } from 'lucide-react-native';
import { View } from 'react-native';

import { ExploreScreen } from '../screens/ExploreScreen'; // Real Explore Screen
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { UpdatesScreen } from '../screens/UpdatesScreen';
import { ArtistDetailScreen } from '../screens/ArtistDetailScreen';
import { LabelDetailScreen } from '../screens/LabelDetailScreen';
import { TrendingArtistsScreen } from '../screens/TrendingArtistsScreen';
import { PopularLabelsScreen } from '../screens/PopularLabelsScreen';
import { TopPredictionsScreen } from '../screens/TopPredictionsScreen';
import { SharesScreen } from '../screens/SharesScreen';
import { PredictionsScreen } from '../screens/PredictionsScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { LearnScreen } from '../screens/LearnScreen';
import { PredictionDetailScreen } from '../screens/PredictionDetailScreen';

// ... imports

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
        name="Explore" 
        component={ExploreScreen} 
      />
      <Tab.Screen 
        name="Updates" 
        component={UpdatesScreen} 
      />
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} detachInactiveScreens={false}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
      <Stack.Screen name="TrendingArtists" component={TrendingArtistsScreen} />
      <Stack.Screen name="PopularLabels" component={PopularLabelsScreen} />
      <Stack.Screen name="TopPredictions" component={TopPredictionsScreen} />
      <Stack.Screen name="LabelDetail" component={LabelDetailScreen} />
      <Stack.Screen name="Shares" component={SharesScreen} />
      <Stack.Screen name="Predictions" component={PredictionsScreen} />
      <Stack.Screen name="Activity" component={ActivityScreen} />
      <Stack.Screen name="Learn" component={LearnScreen} />
      <Stack.Screen name="PredictionDetail" component={PredictionDetailScreen} />
    </Stack.Navigator>
  );
}
