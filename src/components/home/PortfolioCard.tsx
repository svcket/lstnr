import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_FAMILY, SPACING, FONT_SIZE } from '../../constants/theme';

interface PortfolioCardProps {
  totalValue: string;
  dailyChange: string;
  dailyPercentage: string;
  isPositive?: boolean;
}

export const PortfolioCard = ({ 
  totalValue, 
  dailyChange, 
  dailyPercentage, 
  isPositive = true 
}: PortfolioCardProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Portfolio</Text>
      <Text style={styles.value}>{totalValue}</Text>
      
      <View style={styles.row}>
        <Text style={[
          styles.change, 
          { color: isPositive ? COLORS.success : COLORS.error }
        ]}>
          {isPositive ? '+' : ''}{dailyChange} ({isPositive ? '+' : ''}{dailyPercentage})
        </Text>
        <Text style={styles.period}>today</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    // paddingVertical removed to let parent spacers control rhythm
  },
  label: {
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZE.s,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  value: {
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700', // Explicit bold reinforcement
    fontSize: 40,
    color: COLORS.text,
    lineHeight: 48,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  change: {
    fontFamily: FONT_FAMILY.balance, // Bold (Currency)
    fontWeight: '700',
    fontSize: FONT_SIZE.m,
  },
  period: {
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZE.m,
    color: COLORS.textSecondary,
  },
});
