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
          {/* Header (Left Aligned) */}
          <View style={styles.header}>
              <HeaderBack />
              <Text style={styles.headerTitle}>Shares</Text>
          </View>

           {/* Summary Section */}
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

          {/* Full Width List (No Card) */}
          <View style={{ flex: 1, width: '100%' }}>
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
    justifyContent: 'flex-start', // Left align
    gap: 12, // Space between arrow and title
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: FONT_FAMILY.header,
    fontWeight: '600',
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
    fontFamily: FONT_FAMILY.balance,
    fontWeight: '700',
    fontSize: 24,
    color: '#FFF',
  },
  summaryChange: {
    fontFamily: FONT_FAMILY.balance,
    fontWeight: '700',
    fontSize: 16,
  },
  
  // List Content
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24, 
    paddingTop: 4, // Reduced from 8px as requested
  },
});
