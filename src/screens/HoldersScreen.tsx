import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { HeaderBack } from '../components/common/HeaderBack';
import { HoldersList } from '../components/common/HoldersList';
import { COLORS, FONT_FAMILY, SPACING } from '../constants/theme';

export const HoldersScreen = () => {
  const route = useRoute<any>();
  const { entityId, type, name, ticker } = route.params || {};
  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');

  // "Subtitle depends on context: Artist page -> '$YE Holders', Prediction page -> 'Market Holders'"
  const getTitle = () => {
      // Prompt says "Title: 'Holders'"
      // "Subtitle depends on context".
      // But standard designs usually put context in Title or Header.
      // I will follow "Title: Holders" and put context in subtitle.
      return 'Holders';
  };

  const getSubtitle = () => {
      if (type === 'PREDICTION') return 'Market Holders';
      return `${ticker || name || 'Token'} Holders`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
            <HeaderBack />
            <View style={styles.headerTitles}>
                <Text style={styles.title}>{getTitle()}</Text>
                <Text style={styles.subtitle}>{getSubtitle()}</Text>
            </View>
            <View style={{width: 40}} /> 
        </View>

        {/* Tabs (Only if Prediction, or strictly following prompt "Tabs: Active / Closed") */}
        {/* Prompt: "Tabs... Active / Closed (predictions only)" */}
        {/* Tabs for all contexts as per "What about the shares tab?" request */}
        <View style={styles.tabs}>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'active' && styles.tabActive]}
                onPress={() => setActiveTab('active')}
            >
                <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'closed' && styles.tabActive]}
                onPress={() => setActiveTab('closed')}
            >
                <Text style={[styles.tabText, activeTab === 'closed' && styles.tabTextActive]}>Closed</Text>
            </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
           <HoldersList entityId={entityId || 'a1'} type={type || 'ARTIST'} filter={activeTab} name={name} ticker={ticker} />
        </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#000',
  },
  safeArea: {
      flex: 1,
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 16,
  },
  headerTitles: {
      alignItems: 'center',
  },
  title: {
      fontSize: 16,
      fontFamily: FONT_FAMILY.header,
      color: COLORS.white,
      fontWeight: '600',
  },
  subtitle: {
      fontSize: 12,
      fontFamily: FONT_FAMILY.body,
      color: '#666',
  },
  tabs: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#222',
      marginBottom: 0,
  },
  tab: {
      paddingVertical: 12,
      marginRight: 24,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
  },
  tabActive: {
      borderBottomColor: COLORS.primary,
  },
  tabText: {
      fontSize: 14,
      fontFamily: FONT_FAMILY.medium,
      color: '#666',
  },
  tabTextActive: {
      color: COLORS.white,
  },
  content: {
      flex: 1,
      paddingHorizontal: 16,
  }
});
