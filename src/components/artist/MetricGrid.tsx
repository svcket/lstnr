import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { formatCompact } from '../../mock/artistMarket';

const { width } = Dimensions.get('window');
const GAP = 8;
const CARD_WIDTH = (width - 32 - GAP) / 2; // (Screen - Padding - Gap) / 2

interface MetricGridProps {
  marketCap: number;
  holders: number;
  artistStake: number; // Percentage or absolute
  top10Stake: number; // Percentage
}

export const MetricGrid = ({ marketCap, holders, artistStake, top10Stake }: MetricGridProps) => {
  return (
    <View style={styles.container}>
      {/* Top Row */}
      <View style={styles.row}>
        <MetricCard label="Market Cap" value={formatCompact(marketCap)} />
        <MetricCard label="Holders" value={formatCompact(holders)} />
      </View>
      
      {/* Bottom Row */}
      <View style={styles.row}>
        <MetricCard label="Artist's Stake" value={`${artistStake}%`} />
        <MetricCard label="Top 10" value={`${top10Stake.toFixed(1)}%`} />
      </View>
    </View>
  );
};

const MetricCard = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.card}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
  },
  value: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700', // Explicit Bold
    fontSize: 14, // Strict 14px as per requirement
    marginBottom: 4,
  },
  label: {
    color: '#999',
    fontFamily: FONT_FAMILY.header, // Medium
    fontSize: 12,
  },
});
