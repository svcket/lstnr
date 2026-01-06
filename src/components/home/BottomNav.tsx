import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { House, Search, User } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export const BottomNav = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <House color={COLORS.primary} size={24} strokeWidth={2.5} />
          <Text style={[styles.label, { color: COLORS.primary }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Search color={COLORS.textSecondary} size={24} strokeWidth={2.5} />
          <Text style={styles.label}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <User color={COLORS.textSecondary} size={24} strokeWidth={2.5} />
          <Text style={styles.label}>Profile</Text>
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
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    paddingBottom: 8, // Safe area adds more
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
