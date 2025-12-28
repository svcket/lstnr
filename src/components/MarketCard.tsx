import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { Market } from '../services/mockApi';

interface MarketCardProps {
  market: Market;
  onPress: () => void;
}

export const MarketCard = ({ market, onPress }: MarketCardProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card>
        <View style={styles.top}>
            <Image source={{ uri: market.image }} style={styles.image} />
            <Text style={styles.status}>{market.status}</Text>
        </View>
        <Text style={styles.question}>{market.question}</Text>
        <View style={styles.oddsContainer}>
            <View style={[styles.bar, { flex: market.yesPrice, backgroundColor: COLORS.success }]} />
            <View style={[styles.bar, { flex: market.noPrice, backgroundColor: COLORS.error }]} />
        </View>
        <View style={styles.labels}>
            <Text style={styles.yesLabel}>YES {Math.round(market.yesPrice * 100)}%</Text>
            <Text style={styles.noLabel}>NO {Math.round(market.noPrice * 100)}%</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  image: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.full,
  },
  status: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
  question: {
      color: COLORS.text,
      fontSize: FONT_SIZE.m,
      fontWeight: 'bold',
      marginBottom: SPACING.m,
  },
  oddsContainer: {
      flexDirection: 'row',
      height: 6,
      borderRadius: BORDER_RADIUS.full,
      overflow: 'hidden',
      marginBottom: SPACING.s,
  },
  bar: {
      height: '100%',
  },
  labels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  yesLabel: {
      color: COLORS.success,
      fontSize: FONT_SIZE.xs,
      fontWeight: 'bold',
  },
  noLabel: {
      color: COLORS.error,
      fontSize: FONT_SIZE.xs,
      fontWeight: 'bold',
  },
});
