import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';

// Mock Data
const NAMES = ['Neon Dust', 'Luna Tide', 'Steel Pulse', 'Velvet Echo', 'Cyber Mist', 'Solar Flare', 'Oceanic Drift', 'Urban Beat', 'Forest Rains', 'Glitch Witch', 'Retro Wave', 'Bass Quake', 'Lyrical Genius', 'Melody Maker', 'Rhythm King'];

const SHARES_DATA = Array.from({ length: 15 }).map((_, i) => ({
  id: `s_${i}`,
  artistName: NAMES[i % NAMES.length],
  shares: Math.floor(Math.random() * 500) + 10,
  avgBuy: parseFloat((Math.random() * 50 + 5).toFixed(2)),
  value: '$' + (Math.floor(Math.random() * 5000) + 100).toLocaleString(),
  change: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 10).toFixed(1) + '%',
  isPositive: Math.random() > 0.5,
  avatar: `https://i.pravatar.cc/150?u=s_${i}`,
  lastBuy: `${Math.floor(Math.random() * 10) + 1}d ago`
}));

export const SharesScreen = () => {
  const navigation = useNavigation<any>();

  const renderItem = ({ item, index }: { item: typeof SHARES_DATA[0], index: number }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ArtistDetail', { artistId: item.id })}
    >
      <View style={styles.left}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View>
            <Text style={styles.artistName}>{item.artistName}</Text>
            {/* Avg Buy: Split text to bold the price */}
            <Text style={styles.subline}>
               {item.shares} shares • Avg buy <Text style={styles.boldPrice}>${item.avgBuy.toFixed(2)}</Text>
            </Text>
            <Text style={styles.lastBuy}>Last buy: {item.lastBuy}</Text>
        </View>
      </View>
      
      <View style={styles.right}>
        <Text style={styles.value}>{item.value}</Text>
        <Text style={[styles.change, { color: item.isPositive ? COLORS.success : COLORS.error }]}>
            {item.change}
        </Text>
      </View>

      {/* Divider (except last) */}
      {index < SHARES_DATA.length - 1 && <View style={styles.separator} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
              <HeaderBack />
              <Text style={styles.headerTitle}>Shares</Text>
              <View style={{ width: 40 }} /> 
          </View>

           {/* Optional Summary (Fixed at top, outside scrollable card) */}
           <View style={styles.summaryTop}>
               <View>
                  <Text style={styles.summaryLabel}>Portfolio Value</Text>
                  <Text style={styles.summaryValue}>$6,930.50</Text>
               </View>
               <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.summaryLabel}>Today</Text>
                  <Text style={[styles.summaryChange, { color: COLORS.success }]}>+$245.20 (3.4%)</Text>
               </View>
            </View>

          {/* FIXED CARD CONTAINER */}
          <View style={styles.cardContainer}>
              <FlatList
                data={SHARES_DATA}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
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
  headerTitle: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 18,
    color: '#FFF',
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  summaryLabel: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700', // Explicit Bold
    fontSize: 24,
    color: '#FFF',
  },
  summaryChange: {
    fontFamily: FONT_FAMILY.balance, // Bold (Currency-like)
    fontWeight: '700', // Explicit Bold
    fontSize: 16,
  },
  
  // FIXED CARD
  cardContainer: {
    flex: 1, // Take remaining space
    backgroundColor: '#111111',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16, // 16px bottom margin
    marginTop: 0, // Header text or summary usually has padding, but if we need 16px from summary...
    overflow: 'hidden', 
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    paddingTop: 0,
  },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
  },
  artistName: {
    fontFamily: FONT_FAMILY.header, // Medium
    fontSize: 16,
    color: '#FFF',
    marginBottom: 4,
  },
  subline: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 13,
    color: '#999',
  },
  boldPrice: {
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700',
    color: '#FFF', // Highlight price in white? Or keep grey but bold. User asked for bold amounts. White stands out better.
  },
  lastBuy: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  right: {
     alignItems: 'flex-end',
     gap: 4,
  },
  value: {
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700', // Explicit Bold
    fontSize: 16,
    color: '#FFF',
  },
  change: {
    fontFamily: FONT_FAMILY.balance, // Percentage is currency-adjacent
    fontWeight: '700', 
    fontSize: 14,
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#1A1A1A',
  },
});
