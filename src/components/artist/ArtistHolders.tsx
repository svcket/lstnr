import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { ArtistMarket } from '../../mock/artistMarket';
import { MetricGrid } from './MetricGrid';
import { HolderRow } from './HolderRow';

interface ArtistHoldersProps {
  artist: ArtistMarket;
}

type FilterType = 'All' | 'Following' | 'Myself';
const FILTERS: FilterType[] = ['All', 'Following', 'Myself'];

export const ArtistHolders = ({ artist }: ArtistHoldersProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filteredHolders = useMemo(() => {
    switch (activeFilter) {
      case 'Following':
        return artist.holdersList.filter(h => h.isFollowing);
      case 'Myself':
        return []; // Mock: I don't hold any yet
      default:
        return artist.holdersList;
    }
  }, [activeFilter, artist.holdersList]);

  // Derived Metrics
  const totalShares = artist.circulatingSupply;
  const top10Shares = artist.holdersList
    .slice(0, 10)
    .reduce((sum, h) => sum + h.sharesOwned, 0);
  const top10Pct = (top10Shares / totalShares) * 100;

  // Mock Artist Stake (Fixed or derived if we had creator ID match)
  const artistStakePct = 12.5; 

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Metric Grid */}
      <MetricGrid 
        marketCap={artist.marketCap}
        holders={artist.holders}
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
        {/* Placeholder Mascot - Using generic Image for now if no local asset */}
        {/* <Image source={require('../../../assets/mascot_empty.png')} ... /> */}
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
             sharePrice={artist.price}
             isLast={index === filteredHolders.length - 1}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false} // Since custom scroll handling in DetailScreen tabs
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
