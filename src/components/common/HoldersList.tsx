import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Holder, getHolders, getPredictionHolders } from '../../data/social';
import { HolderRow } from './HolderRow';
import { COLORS, SPACING, FONT_FAMILY } from '../../constants/theme';

interface HoldersListProps {
  entityId: string;
  type: 'ARTIST' | 'LABEL' | 'PREDICTION';
  filter?: 'active' | 'closed';
  name?: string;
  ticker?: string;
}

export const HoldersList = ({ entityId, type, filter = 'active', name, ticker }: HoldersListProps) => {
  const [data, setData] = useState<Holder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch delay for realism
    setLoading(true);
    setTimeout(() => {
        let fetched: Holder[] = [];
        
        // Mock "Closed" data independently
        if (filter === 'closed') {
            // Generate some past holders for visual validation
            fetched = [
                { id: 'h991', name: 'EarlyWhale', avatar: 'https://i.pravatar.cc/150?u=991', shares: 0, value: 0, percent: 125 },
                { id: 'h992', name: 'PaperHands', avatar: 'https://i.pravatar.cc/150?u=992', shares: 0, value: 0, percent: -15.5 },
                { id: 'h993', name: 'TraderJoe', avatar: 'https://i.pravatar.cc/150?u=993', shares: 0, value: 0, percent: 45.2 },
            ];
            // If prediction, maybe add side contexts if we wanted to be fancy, 
            // but standard list is fine. We just want to show the tab works.
        } else if (type === 'PREDICTION') {
            const split = getPredictionHolders(entityId);
            fetched = [
                ...split.yes.map(h => ({ ...h, _side: 'YES' })),
                ...split.no.map(h => ({ ...h, _side: 'NO' }))
            ].sort((a, b) => b.value - a.value);

        } else {
            fetched = getHolders(entityId);
        }
        setData(fetched);
        setLoading(false);
    }, 500);
  }, [entityId, type, filter]);

  if (loading) {
      return (
          <View style={styles.center}>
              <ActivityIndicator color={COLORS.primary} />
          </View>
      );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
          <HolderRow 
            item={item} 
            rank={index + 1} 
            isLast={index === data.length - 1}
            context={{
                type,
                entityId,
                // We should pass name/ticker if we had them or let resolver fetch. 
                // Currently HoldersList doesn't take name in props fully.
                // But HoldersScreen has them in route.params.
                // We will rely on simple context passing or update HoldersListProps.
                // For now, let's update HoldersListProps to include optional name/ticker.
            }} 
          />
      )}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
          <View style={styles.empty}>
              <Text style={styles.emptyText}>No holders found.</Text>
          </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  center: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 40,
  },
  listContent: {
      paddingBottom: 40,
  },
  empty: {
      padding: 40,
      alignItems: 'center',
  },
  emptyText: {
      color: '#666',
      fontFamily: FONT_FAMILY.body,
  }
});
