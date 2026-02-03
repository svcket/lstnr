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
import { LearnDetailScreen } from '../screens/LearnDetailScreen';
import { WithdrawScreen } from '../screens/WithdrawScreen';
import { AddMethodScreen } from '../screens/AddMethodScreen';
import { AddMethodFormScreen } from '../screens/AddMethodFormScreen';
import { HoldersScreen } from '../screens/HoldersScreen';
import { HoldingDetailsSheet } from '../components/HoldingDetailsSheet';
import { ManageProfileScreen } from '../screens/ManageProfileScreen';
import { EditUsernameScreen } from '../screens/EditUsernameScreen';
import { EditBioScreen } from '../screens/EditBioScreen';
import { UserNetworkScreen } from '../screens/UserNetworkScreen';
import { CardsListScreen } from '../screens/settings/payments/CardsListScreen';
import { WalletsListScreen } from '../screens/settings/payments/WalletsListScreen';
import { AddCardSheet } from '../components/payments/AddCardSheet';
import { ConnectWalletSheet } from '../components/payments/ConnectWalletSheet';
import { DefaultMethodPicker } from '../components/payments/DefaultMethodPicker';

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

import { SettingsHomeScreen } from '../screens/settings/SettingsHomeScreen';
import { SettingsAccountScreen } from '../screens/settings/SettingsAccountScreen';
import { SettingsAppearanceScreen } from '../screens/settings/SettingsAppearanceScreen';
import { SettingsNotificationsScreen } from '../screens/settings/SettingsNotificationsScreen';
import { SettingsPaymentsScreen } from '../screens/settings/SettingsPaymentsScreen';
import { SettingsTransactionsScreen } from '../screens/settings/SettingsTransactionsScreen';
import { SettingsSecurityScreen } from '../screens/settings/SettingsSecurityScreen';
import { SettingsHelpScreen } from '../screens/settings/SettingsHelpScreen';
import { SettingsLegalScreen } from '../screens/settings/SettingsLegalScreen';

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} detachInactiveScreens={false}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      {/* ... existing screens ... */}
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

      {/* Settings Flow */}
      <Stack.Screen name="ManageProfile" component={ManageProfileScreen} />
      <Stack.Screen name="EditUsername" component={EditUsernameScreen} />
      <Stack.Screen name="EditBio" component={EditBioScreen} />
      <Stack.Screen name="UserNetwork" component={UserNetworkScreen} />
      <Stack.Screen name="SettingsHome" component={SettingsHomeScreen} />
      
      {/* Payments Flow */}
      <Stack.Screen name="SettingsPayments" component={SettingsPaymentsScreen} />
      <Stack.Screen name="CardsList" component={CardsListScreen} />
      <Stack.Screen name="WalletsList" component={WalletsListScreen} />
      <Stack.Screen name="AddCardSheet" component={AddCardSheet} options={{ presentation: 'transparentModal', animation: 'fade' }} />
      <Stack.Screen name="ConnectWalletSheet" component={ConnectWalletSheet} options={{ presentation: 'transparentModal', animation: 'fade' }} />
      <Stack.Screen name="DefaultMethodPicker" component={DefaultMethodPicker} options={{ presentation: 'transparentModal', animation: 'fade' }} />

      <Stack.Screen name="SettingsAccount" component={SettingsAccountScreen} />
      <Stack.Screen name="SettingsAppearance" component={SettingsAppearanceScreen} />
      <Stack.Screen name="SettingsNotifications" component={SettingsNotificationsScreen} />
      {/* <Stack.Screen name="SettingsPayments" component={SettingsPaymentsScreen} /> REMOVED DUPLICATE - MOVED UP */}
      <Stack.Screen name="SettingsTransactions" component={SettingsTransactionsScreen} />
      <Stack.Screen name="SettingsSecurity" component={SettingsSecurityScreen} />
      <Stack.Screen name="SettingsHelp" component={SettingsHelpScreen} />
      <Stack.Screen name="SettingsLegal" component={SettingsLegalScreen} />
      
      {/* Learn Details */}
      <Stack.Screen name="LearnDetail" component={LearnDetailScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
