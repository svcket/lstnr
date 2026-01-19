import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { ICONS } from '../constants/assets';
// Dynamic Data
import { getInboxItems } from '../data/inbox';

export const ActivityScreen = () => {
  const activityData = getInboxItems();

  // Using FlatList for infinite scrolling potential
  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <View style={styles.itemContainer}>
       <View style={styles.left}>
         <Image 
            source={item.isMoneyOut ? ICONS.activityOut : ICONS.activityIn} 
            style={styles.icon}
            resizeMode="contain"
         />
         <View>
            <Text style={styles.title}>{item.title || item.text}</Text>
            <Text style={styles.date}>{item.timestamp || item.time}</Text>
            {/* Show body for System Events if present */}
            {item.body && item.type !== 'FINANCIAL' && (
                <Text style={styles.bodyText} numberOfLines={1}>{item.body}</Text>
            )}
         </View>
       </View>
       <Text style={[styles.amount, !item.isMoneyOut && { color: COLORS.success }]}>
           {item.amountDisplay || item.amount}
       </Text>
       
       {/* Divider (except last) */}
       {index < activityData.length - 1 && <View style={styles.separator} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
              <HeaderBack />
              <Text style={styles.headerTitle}>Inbox</Text>
              <View style={{ width: 40 }} /> 
          </View>

          {/* FIXED CARD CONTAINER */}
           <View style={styles.cardContainer}>
              <FlatList 
                data={activityData}
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
    fontWeight: '600', // Semibold
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
    fontFamily: FONT_FAMILY.medium, // Explicit Medium
    fontSize: 15,
    color: '#FFF',
    marginBottom: 4,
  },
  date: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 13,
    color: '#666',
  },
  bodyText: {
      fontFamily: FONT_FAMILY.body,
      fontSize: 13,
      color: '#888',
      marginTop: 2,
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
