import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { ICONS } from '../constants/assets';

// Mock Data for Full Activity
const ACTIVITY_DATA = Array.from({ length: 20 }).map((_, i) => {
   const isMoneyOut = Math.random() > 0.5;
   return {
     id: `act_${i}`,
     text: isMoneyOut ? `Bought ${Math.floor(Math.random()*50)} Shares` : `Sold ${Math.floor(Math.random()*50)} Shares`,
     time: `${i + 1}d ago`,
     amount: isMoneyOut ? `-$${Math.floor(Math.random()*200)}` : `+$${Math.floor(Math.random()*200)}`,
     isMoneyOut
   };
});

export const ActivityScreen = () => {
    
  // Using FlatList for infinite scrolling potential
  const renderItem = ({ item, index }: { item: typeof ACTIVITY_DATA[0], index: number }) => (
    <View style={styles.itemContainer}>
       <View style={styles.left}>
         <Image 
            source={item.isMoneyOut ? ICONS.activityOut : ICONS.activityIn} 
            style={styles.icon}
            resizeMode="contain"
         />
         <View>
            <Text style={styles.title}>{item.text}</Text>
            <Text style={styles.date}>{item.time}</Text>
         </View>
       </View>
       <Text style={styles.amount}>{item.amount}</Text>
       
       {/* Divider (except last) */}
       {index < ACTIVITY_DATA.length - 1 && <View style={styles.separator} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
              <HeaderBack />
              <Text style={styles.headerTitle}>Activity</Text>
              <View style={{ width: 40 }} /> 
          </View>

          {/* FIXED CARD CONTAINER */}
           <View style={styles.cardContainer}>
              <FlatList 
                data={ACTIVITY_DATA}
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
  
  // FIXED CARD
  cardContainer: {
    flex: 1,
    backgroundColor: '#111111',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16, // 16px bottom margin
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
    position: 'relative',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
  },
  title: {
    fontFamily: FONT_FAMILY.header, // Medium
    fontSize: 15,
    color: '#FFF',
    marginBottom: 4,
  },
  date: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 13,
    color: '#666',
  },
  amount: {
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700', // Explicit
    fontSize: 16,
    color: '#FFF',
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
