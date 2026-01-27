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
import { ArtistsScreen } from '../screens/ArtistsScreen';
import { LabelsScreen } from '../screens/LabelsScreen';
import { TrendingArtistsScreen } from '../screens/TrendingArtistsScreen';
import { PopularLabelsScreen } from '../screens/PopularLabelsScreen';
import { TopPredictionsScreen } from '../screens/TopPredictionsScreen';
import { SharesScreen } from '../screens/SharesScreen';
import { PredictionsScreen } from '../screens/PredictionsScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { LearnScreen } from '../screens/LearnScreen';
import { PredictionDetailScreen } from '../screens/PredictionDetailScreen';
import { EndingSoonScreen } from '../screens/EndingSoonScreen';
import { HoldersChatScreen } from '../screens/HoldersChatScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { TransactionDetailScreen } from '../screens/TransactionDetailScreen';
import { WithdrawScreen } from '../screens/WithdrawScreen';
import { AddMethodScreen } from '../screens/AddMethodScreen';
import { AddMethodFormScreen } from '../screens/AddMethodFormScreen';
import { HoldersScreen } from '../screens/HoldersScreen';
import { HoldingDetailsSheet } from '../components/HoldingDetailsSheet';

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
        name="Inbox" 
        component={ActivityScreen} 
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
      <Stack.Screen name="Labels" component={LabelsScreen} />
      <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />

      <Stack.Screen name="Artists" component={ArtistsScreen} />
      <Stack.Screen name="TrendingArtists" component={TrendingArtistsScreen} />
      <Stack.Screen name="PopularLabels" component={PopularLabelsScreen} />
      <Stack.Screen name="TopPredictions" component={TopPredictionsScreen} />
      <Stack.Screen name="LabelDetail" component={LabelDetailScreen} />
      <Stack.Screen name="Shares" component={SharesScreen} />
      <Stack.Screen name="Predictions" component={PredictionsScreen} />
      <Stack.Screen name="Activity" component={ActivityScreen} />
      <Stack.Screen name="Learn" component={LearnScreen} />
      <Stack.Screen name="PredictionDetail" component={PredictionDetailScreen} />
      <Stack.Screen name="EndingSoon" component={EndingSoonScreen} />
      <Stack.Screen name="HoldersChat" component={HoldersChatScreen} />
      <Stack.Screen name="Holders" component={HoldersScreen} />
      {/* Sheets as Modals */}
      <Stack.Screen name="HoldingDetails" component={HoldingDetailsSheet} options={{ presentation: 'transparentModal', animation: 'fade' }} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      <Stack.Screen name="Updates" component={UpdatesScreen} />
      <Stack.Screen name="Withdraw" component={WithdrawScreen} />
      <Stack.Screen name="AddMethod" component={AddMethodScreen} />
      <Stack.Screen name="AddMethodForm" component={AddMethodFormScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
}
