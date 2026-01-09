import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

export type TabType = 'Details' | 'Comments' | 'Holders' | 'Activity' | 'Predictions';
const TABS: TabType[] = ['Details', 'Comments', 'Holders', 'Activity', 'Predictions'];

interface ArtistTabsProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export const ArtistTabs = ({ activeTab, onTabPress }: ArtistTabsProps) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onTabPress(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.activeText]}>{tab}</Text>
              {isActive && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    marginBottom: 24,
    backgroundColor: COLORS.background, // Ensure logic opacity when sticky
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 24,
  },
  tab: {
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
  },
  tabText: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 14,
    color: '#9A9A9A',
    letterSpacing: 0,
  },
  activeText: {
    color: '#FFF',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 2,
    backgroundColor: '#FFF', // or Red if preferred, sticking to White for high contrast black/white theme unless specified otherwise.
  }
});
