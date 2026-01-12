import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { MetricGrid } from './MetricGrid';
import { HolderRow } from './HolderRow';
import { Holder } from '../../lib/mockMetrics';

interface ArtistHoldersProps {
  holdersList: Holder[];
  totalShares: number;
  sharePrice: number;
  marketCap: number;
  holdersCount: number;
}

type FilterType = 'All' | 'Following' | 'Myself';
const FILTERS: FilterType[] = ['All', 'Following', 'Myself'];

export const ArtistHolders = ({ holdersList, totalShares, sharePrice, marketCap, holdersCount }: ArtistHoldersProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filteredHolders = useMemo(() => {
    switch (activeFilter) {
      case 'Following':
        return holdersList.filter(h => h.isFollowing);
      case 'Myself':
        return []; // Mock: I don't hold any yet
      default:
        return holdersList;
    }
  }, [activeFilter, holdersList]);

  // Derived Metrics
  const top10Shares = holdersList
    .slice(0, 10)
    .reduce((sum, h) => sum + h.sharesOwned, 0);
  const top10Pct = (top10Shares / totalShares) * 100;

  // Mock Artist Stake (Fixed or derived if we had creator ID match)
  const artistStakePct = 12.5; 

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Metric Grid */}
      <MetricGrid 
        marketCap={marketCap}
        holders={holdersCount}
        artistStake={artistStakePct}
        top10Stake={top10Pct}
      />

      {/* Filter Pills */}
      <View style={styles.filterRow}>
        {FILTERS.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterPill, activeFilter === filter && styles.activePill]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.activeText]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🤔</Text>
        <Text style={styles.emptyText}>No holders available</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredHolders}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <HolderRow 
             holder={item} 
             totalShares={totalShares} 
             sharePrice={sharePrice}
             isLast={index === filteredHolders.length - 1}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Flex 1 removed to allow content to flow in parent ScrollView
  },
  listContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#222',
  },
  activePill: {
    backgroundColor: '#FFF',
    borderColor: '#FFF',
  },
  filterText: {
    fontFamily: FONT_FAMILY.header, // Medium
    fontSize: 14,
    color: '#999',
  },
  activeText: {
    color: '#000',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
      fontSize: 40,
      marginBottom: 16,
  },
  emptyText: {
    fontFamily: FONT_FAMILY.body,
    color: '#666',
    fontSize: 14,
  },
});
