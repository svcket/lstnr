import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FONT_FAMILY } from '../../constants/theme';
import { PredictionCard } from './PredictionCard';
import { PREDICTIONS } from '../../data/catalog';

interface ArtistPredictionsProps {
  entityId: string;
  name: string; // For generating titles if needed
}

export const ArtistPredictions = ({ entityId, name }: ArtistPredictionsProps) => {
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    // Filter real predictions from catalog
    const related = PREDICTIONS.filter(p => p.relatedEntityId === entityId);
    setPredictions(related);
  }, [entityId]);

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
          <PredictionCard prediction={item as any} /> 
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
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
