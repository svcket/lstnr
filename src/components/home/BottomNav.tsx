import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ICONS } from '../../constants/assets';

const { width } = Dimensions.get('window');

export const BottomNav = ({ activeTab = 'Home' }: { activeTab?: string }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Image 
            source={activeTab === 'Home' ? ICONS.navHomeActive : ICONS.navHomeInactive} 
            style={[styles.icon, activeTab === 'Home' && { tintColor: 'white' }]} 
            resizeMode="contain" 
          />
          <Text style={[styles.label, activeTab === 'Home' && { color: 'white' }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Image 
            source={activeTab === 'Explore' ? ICONS.navExploreActive : ICONS.navExploreInactive} 
            style={styles.icon} 
            resizeMode="contain" 
          />
          <Text style={styles.label}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Image 
            source={activeTab === 'Inbox' ? ICONS.navInboxActive : ICONS.navInboxInactive} 
            style={styles.icon} 
            resizeMode="contain" 
          />
          <Text style={styles.label}>Inbox</Text>
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
    tintColor: COLORS.textSecondary,
  },
  label: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1, // 1% / 0.01em approx or just breathing room
  },
});
