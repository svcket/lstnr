import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { getArtists, getMarkets, Artist, Market, User } from '../services/mockApi'; // Fixed import to use mockApi
import { ArtistCard } from '../components/ArtistCard'; // Fixed import
import { MarketCard } from '../components/MarketCard'; // Fixed import
import { useAuth as useAuthContext } from '../context/AuthContext';

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuthContext();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const [artistsData, marketsData] = await Promise.all([
      getArtists(),
      getMarkets(),
    ]);
    setArtists(artistsData);
    setMarkets(marketsData);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name.split(' ')[0]}</Text>
        <Text style={styles.balance}>${user?.balance.toFixed(2)}</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        <Text style={styles.sectionTitle}>Trending Artists</Text>
        {artists.map((artist) => (
          <ArtistCard 
            key={artist.id} 
            artist={artist} 
            onPress={() => navigation.navigate('ArtistDetail', { artist })} 
          />
        ))}

        <Text style={styles.sectionTitle}>Active Markets</Text>
        {markets.map((market) => (
          <MarketCard 
            key={market.id} 
            market={market} 
            onPress={() => navigation.navigate('MarketDetail', { market })} 
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  balance: {
    fontSize: FONT_SIZE.l,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scrollContent: {
    padding: SPACING.m,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.l,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.m,
    marginTop: SPACING.s,
  },
});
