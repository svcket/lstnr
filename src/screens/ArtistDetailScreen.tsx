import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { Artist } from '../services/mockApi';
import { LineChart } from '../components/LineChart';
import { ArrowLeft, Share2, MessageCircle } from 'lucide-react-native';

export const ArtistDetailScreen = ({ route, navigation }: any) => {
  const { artist } = route.params as { artist: Artist };
  const [chartData] = useState<number[]>([
      artist.sharePrice * 0.8, 
      artist.sharePrice * 0.85, 
      artist.sharePrice * 0.82, 
      artist.sharePrice * 0.9, 
      artist.sharePrice * 0.95, 
      artist.sharePrice * 0.92, 
      artist.sharePrice
  ]); // Mock history

  const handleBuy = () => {
    Alert.alert('Buy Shares', `Purchase shares of ${artist.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm ($' + artist.sharePrice + ')', onPress: () => console.log('Bought') }
    ]);
  };

  const handleSell = () => {
     Alert.alert('Sell Shares', `Sell your shares of ${artist.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => console.log('Sold') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ArrowLeft color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Artist</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Share2 color={COLORS.text} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.profileHeader}>
          <Image source={{ uri: artist.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{artist.name}</Text>
          {artist.verified && <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>VERIFIED</Text></View>}
        </View>

        <View style={styles.chartContainer}>
           <Text style={styles.currentPrice}>${artist.sharePrice.toFixed(2)}</Text>
           <Text style={[styles.change, { color: artist.change >= 0 ? COLORS.success : COLORS.error }]}>
             {artist.change >= 0 ? '+' : ''}{artist.change}% (24h)
           </Text>
           <LineChart data={chartData} color={artist.change >= 0 ? COLORS.success : COLORS.error} height={150} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Holders</Text>
            <Text style={styles.statValue}>{artist.holders}</Text>
          </View>
          <View style={styles.stat}>
             <Text style={styles.statLabel}>Market Cap</Text>
             <Text style={styles.statValue}>$1.2M</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{artist.bio}</Text>
        </View>

         <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discussion</Text>
          <TouchableOpacity style={styles.commentCta}>
             <MessageCircle color={COLORS.textSecondary} size={20} />
             <Text style={styles.commentText}>Join the conversation...</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.actionFooter}>
        <TouchableOpacity style={[styles.actionBtn, styles.sellBtn]} onPress={handleSell}>
          <Text style={styles.sellText}>Sell</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.buyBtn]} onPress={handleBuy}>
          <Text style={styles.buyText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.m,
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.m,
    fontWeight: 'bold',
  },
  iconBtn: {
    padding: SPACING.s,
  },
  profileHeader: {
    alignItems: 'center',
    padding: SPACING.l,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.m,
    borderWidth: 2,
    borderColor: COLORS.surfaceLight,
  },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.s,
  },
  verifiedBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.s,
  },
  verifiedText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  chartContainer: {
    paddingVertical: SPACING.m,
    alignItems: 'center',
  },
  currentPrice: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: '900',
  },
  change: {
    fontSize: FONT_SIZE.m,
    fontWeight: 'bold',
    marginBottom: SPACING.m,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.l,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.text,
    fontSize: FONT_SIZE.l,
    fontWeight: 'bold',
  },
  section: {
    padding: SPACING.l,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.l,
    fontWeight: 'bold',
    marginBottom: SPACING.m,
  },
  bio: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.m,
    lineHeight: 24,
  },
  commentCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    gap: SPACING.m,
  },
  commentText: {
    color: COLORS.textSecondary,
  },
  actionFooter: {
    flexDirection: 'row',
    padding: SPACING.m,
    gap: SPACING.m,
    borderTopWidth: 1,
    borderColor: COLORS.surface,
    backgroundColor: COLORS.background,
  },
  actionBtn: {
    flex: 1,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtn: {
    backgroundColor: COLORS.primary,
  },
  sellBtn: {
    backgroundColor: COLORS.surfaceLight,
  },
  buyText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.l,
  },
  sellText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.l,
  },
});
