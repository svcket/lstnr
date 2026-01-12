import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

export type TabType = 'Details' | 'Chat' | 'Comments' | 'Holders' | 'Activity' | 'Predictions';
const DEFAULT_TABS: TabType[] = ['Details', 'Comments', 'Holders', 'Activity', 'Predictions'];

interface ArtistTabsProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
  tabs?: TabType[];
  mode?: 'scroll' | 'fixed'; 
  style?: any;
}

const { width } = Dimensions.get('window');

export const ArtistTabs = ({ activeTab, onTabPress, tabs = DEFAULT_TABS, mode = 'scroll', style }: ArtistTabsProps) => {
  const renderTab = (tab: TabType) => {
      const isActive = activeTab === tab;
      return (
        <TouchableOpacity 
          key={tab} 
          style={[
              styles.tab, 
              isActive && styles.activeTab,
              mode === 'fixed' && { flex: 1 } // Distribute evenly
          ]}
          onPress={() => onTabPress(tab)}
        >
          <Text style={[styles.tabText, isActive && styles.activeText]}>{tab}</Text>
          {isActive && <View style={styles.indicator} />}
        </TouchableOpacity>
      );
  };

  if (mode === 'fixed') {
      return (
          <View style={[styles.container, style]}>
             <View style={styles.fixedContainer}>
                 {tabs.map(renderTab)}
             </View>
          </View>
      );
  }

  return (
    <View style={[styles.container, style]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map(renderTab)}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    marginBottom: 24,
    backgroundColor: COLORS.background, 
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 24,
  },
  fixedContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
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
    fontWeight: '600',
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
    backgroundColor: '#FFF', 
  }
});
