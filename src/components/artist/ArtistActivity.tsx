import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FONT_FAMILY } from '../../constants/theme';
import { ArtistMarket } from '../../mock/artistMarket';
import { ActivityRow } from './ActivityRow';

interface ArtistActivityProps {
  artist: ArtistMarket;
}

type FilterType = 'All' | 'Following' | 'Myself';
const FILTERS: FilterType[] = ['All', 'Following', 'Myself'];

export const ArtistActivity = ({ artist }: ArtistActivityProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filteredActivity = useMemo(() => {
    switch (activeFilter) {
      case 'Following':
        return artist.activityList.filter(item => item.user.isFollowing);
      case 'Myself':
        return artist.activityList.filter(item => item.user.isSelf);
      default:
        return artist.activityList;
    }
  }, [activeFilter, artist.activityList]);

  const renderHeader = () => (
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
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
        {/* Reuse simple text/emoji or mascot if available */}
        <Text style={styles.emptyEmoji}>🤔</Text>
        <Text style={styles.emptyText}>No activity available</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredActivity}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ActivityRow 
             item={item} 
             isLast={index === filteredActivity.length - 1}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false} // Nested inside parent ScrollView
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Flex controlled by parent
  },
  listContent: {
    paddingBottom: 40,
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
    color: '#FFF', // Unselected text is White
  },
  activeText: {
    color: '#000', // Selected text is Black
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
