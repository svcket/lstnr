import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FONT_FAMILY } from '../../constants/theme';
import { ArtistMarket } from '../../mock/artistMarket';
import { PredictionCard } from './PredictionCard';

interface ArtistPredictionsProps {
  artist: ArtistMarket;
}

export const ArtistPredictions = ({ artist }: ArtistPredictionsProps) => {
  const predictions = artist.predictionsList || [];

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🔮</Text>
        <Text style={styles.emptyText}>No predictions available</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={predictions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PredictionCard prediction={item} />
        )}
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
