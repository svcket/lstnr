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
    paddingVertical: 16,
    marginBottom: 28, // Specific 28px formatting request
  },
  label: {
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZE.s,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 40, // Large hero size
    color: COLORS.text,
    lineHeight: 48,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  change: {
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZE.m,
    fontWeight: '600',
  },
  period: {
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZE.m,
    color: COLORS.textSecondary,
  },
});
