import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';

// Mock Data
const PREDICTIONS_DATA = [
  { id: 'p1', question: 'Will "Neon Dust" hit Top 10?', stake: 120, side: 'YES', chance: 90, status: 'Open' },
  { id: 'p2', question: 'Album Release: Dec 2025', stake: 350, side: 'YES', chance: 68, status: 'Open' },
  { id: 'p3', question: 'Win "Best New Artist"?', stake: 50, side: 'NO', chance: 15, status: 'Open' },
  { id: 'p4', question: 'Headies Next Rated 2026', stake: 200, side: 'YES', chance: 42, status: 'Open' },
  { id: 'p5', question: 'Spotify > 1M Monthly Listeners', stake: 80, side: 'NO', chance: 55, status: 'Open' },
];

export const PredictionsScreen = () => {
    
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
              <HeaderBack />
              <Text style={styles.headerTitle}>Predictions</Text>
              <View style={{ width: 40 }} /> 
          </View>

          {/* FIXED CARD CONTAINER */}
           <View style={styles.cardContainer}>
              <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                  {PREDICTIONS_DATA.map((item, index) => (
                    <TouchableOpacity key={item.id} style={styles.itemContainer} activeOpacity={0.7}>
                      <View style={styles.left}>
                        {/* Placeholder Icon */}
                        <View style={styles.iconPlaceholder}>
                            <Text style={{ fontSize: 16 }}>🔮</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.question} numberOfLines={2}>{item.question}</Text>
                            <Text style={styles.subline}>
                              Stake: <Text style={styles.boldText}>${item.stake}</Text> • <Text style={{ color: item.side === 'YES' ? COLORS.success : COLORS.error, fontFamily: FONT_FAMILY.balance, fontWeight: '700' }}>{item.side}</Text>
                            </Text>
                        </View>
                      </View>
                      
                      <View style={styles.right}>
                        <Text style={styles.chance}>{item.chance}%</Text>
                        <Text style={styles.chanceLabel}>Chance</Text>
                      </View>

                      {/* Divider (except last) */}
                      {index < PREDICTIONS_DATA.length - 1 && <View style={styles.separator} />}
                    </TouchableOpacity>
                  ))}
              </ScrollView>
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
  
  // FIXED CARD
  cardContainer: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16, // 16px bottom margin
    overflow: 'hidden',
  },
  scrollContent: {
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
    flex: 1,
    marginRight: 16,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  question: {
    fontFamily: FONT_FAMILY.header, // Medium
    fontWeight: '500',
    fontSize: 15,
    color: '#FFF',
    marginBottom: 4,
    lineHeight: 20,
  },
  subline: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 13,
    color: '#666',
  },
  boldText: {
    fontFamily: FONT_FAMILY.balance,
    fontWeight: '700',
    color: '#FFF',
  },
  right: {
     alignItems: 'flex-end',
     justifyContent: 'center',
  },
  chance: {
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700', // Explicit
    fontSize: 18,
    color: '#FFF',
  },
  chanceLabel: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    color: '#666',
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
