import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { ICONS } from '../constants/assets';

// Expanded Mock Data
const LEARN_DATA = [
  { id: 'l1', title: 'What is LSTNR?', subtitle: 'Artists, shares, and predictions.', icon: ICONS.learnLstnr },
  { id: 'l2', title: 'Owning artist shares', subtitle: 'What you hold, what moves price.', icon: ICONS.learnShares },
  { id: 'l3', title: 'Prediction markets', subtitle: 'Binary + multi-range, simplified.', icon: ICONS.learnPredictions },
  { id: 'l4', title: 'Who decides outcomes?', subtitle: 'How markets resolve and settle.', icon: ICONS.learnResolve },
  { id: 'l5', title: 'Understanding Market Cap', subtitle: 'Valuation metrics explained.', icon: ICONS.learnLstnr }, // Reusing icon for now
  { id: 'l6', title: 'Fees and Payouts', subtitle: 'Transaction costs and earnings.', icon: ICONS.learnShares },
  { id: 'l7', title: 'Instant Withdrawals', subtitle: 'Getting your money out.', icon: ICONS.learnResolve },
  { id: 'l8', title: 'Community Guidelines', subtitle: 'Rules of engagement.', icon: ICONS.learnPredictions },
];

export const LearnScreen = () => {
    
  const renderItem = ({ item, index }: { item: typeof LEARN_DATA[0], index: number }) => (
    <TouchableOpacity style={styles.itemContainer} activeOpacity={0.7}>
       <View style={styles.left}>
         <Image 
            source={item.icon} 
            style={styles.icon}
            resizeMode="contain"
         />
         <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
         </View>
       </View>
       

       
       {/* Divider (except last) */}
       {index < LEARN_DATA.length - 1 && <View style={styles.separator} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
              <HeaderBack />
              <Text style={styles.headerTitle}>Learn</Text>
              <View style={{ width: 40 }} /> 
          </View>

          {/* FIXED CARD CONTAINER */}
           <View style={styles.cardContainer}>
              <FlatList 
                data={LEARN_DATA}
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
    fontFamily: FONT_FAMILY.medium, // Explicit Medium
    fontSize: 18,
    color: '#FFF',
  },
  
  // FIXED CARD
  cardContainer: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16, // Bottom margin ensures gap from bottom edge
    marginTop: 0, // Header padding handles top gap usually, but let's check spacing
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
    gap: 16,
    flex: 1,
    paddingRight: 16,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  title: {
    fontFamily: FONT_FAMILY.medium, // Explicit Medium
    fontSize: 15,
    color: '#FFF',
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 13,
    color: '#999',
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
