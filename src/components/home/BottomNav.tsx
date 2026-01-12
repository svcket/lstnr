import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { ICONS } from '../../constants/assets';

const { width } = Dimensions.get('window');

export const BottomNav = ({ activeTab = 'Home' }: { activeTab?: string }) => {
  const navigation = useNavigation<any>();
  
  // Helper to get tab color
  const getColor = (isActive: boolean) => isActive ? '#FFFFFF' : 'rgba(255,255,255,0.45)';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 1. Explore */}
        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Explore')}
        >
          <Image 
            source={activeTab === 'Explore' ? ICONS.navExploreActive : ICONS.navExploreInactive} 
            style={[styles.icon, { tintColor: getColor(activeTab === 'Explore') }]} 
            resizeMode="contain" 
          />
          <Text style={[styles.label, { color: getColor(activeTab === 'Explore') }]}>Explore</Text>
        </TouchableOpacity>

        {/* 2. Inbox (Updates) */}
        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Updates')}
        >
          <Image 
            source={activeTab === 'Inbox' ? ICONS.navInboxActive : ICONS.navInboxInactive} 
            style={[styles.icon, { tintColor: getColor(activeTab === 'Inbox') }]} 
            resizeMode="contain" 
          />
          <Text style={[styles.label, { color: getColor(activeTab === 'Inbox') }]}>Inbox</Text>
        </TouchableOpacity>

        {/* 3. Wallet (Home) */}
        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}
        >
           <Image 
             source={activeTab === 'Wallet' ? ICONS.navWalletActive : ICONS.navWalletInactive} 
             style={[styles.icon, { tintColor: getColor(activeTab === 'Wallet') }]} 
             resizeMode="contain" 
           />
          <Text style={[styles.label, { color: getColor(activeTab === 'Wallet') }]}>Portfolio</Text>
        </TouchableOpacity>
      </View>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: COLORS.black }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: COLORS.black,
    borderTopWidth: 1, // Optional: subtle divider
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12, // slightly tighter
    paddingBottom: 4, 
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 60,
  },
  icon: {
    width: 24,
    height: 24,
    // tintColor is handled inline based on active state in render
  },
  label: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)', // Default/Inactive color
    textTransform: 'uppercase',
    letterSpacing: 1, 
  },
});
