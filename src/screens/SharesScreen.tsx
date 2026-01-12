import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
// Dynamic Data
import { getPortfolio, getArtistById } from '../data/catalog';
import { getEntityMetrics } from '../lib/mockMetrics';
import { EntityRow } from '../components/common/EntityRow';

export const SharesScreen = () => {
  const navigation = useNavigation<any>();
  const portfolio = getPortfolio();

  const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => {
      const artist = getArtistById(item.artistId);
      if (!artist) return null;
      const metrics = getEntityMetrics(artist.id);

      // Subtitle: "120 shares • Avg buy $12.45"
      const subtitle = `${item.shares} shares • Avg buy ${formatCurrency(item.avgBuyPrice)}`;

      return (
          <EntityRow 
             key={artist.id}
             name={artist.name}
             avatarUrl={artist.avatarUrl}
             symbol={artist.symbol}
             subtitle={subtitle}
             price={formatCurrency(metrics.price)}
             changePct={metrics.changeTodayPct}
             isLast={index === portfolio.length - 1}
             onPress={() => navigation.navigate('ArtistDetail', { artistId: artist.id })}
          />
      );
  };

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
                data={portfolio}
                keyExtractor={item => item.artistId}
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
    fontWeight: '600', // Semibold
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
    marginTop: 0, 
    overflow: 'hidden', 
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    paddingTop: 0,
  },
});
