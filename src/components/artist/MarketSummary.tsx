import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

interface MarketSummaryProps {
  marketCap: number;
  ath: number;
  dailyChange: number;
}

const formatCurrency = (val: number) => {
  if (val >= 1000) return '$' + (val / 1000).toFixed(1) + 'K';
  return '$' + val.toFixed(2);
};

export const MarketSummary = ({ marketCap, ath, dailyChange }: MarketSummaryProps) => {
  const isPositive = dailyChange >= 0;
  
  return (
    <View style={styles.container}>
      {/* Left: MC + Change */}
      <View>
        <View style={styles.kpiRow}>
             <Text style={styles.kpiValue}>{formatCurrency(marketCap)}</Text>
             <Text style={styles.kpiLabel}> MC</Text>
        </View>
        <Text style={[styles.change, { color: isPositive ? COLORS.success : COLORS.error }]}>
          {isPositive ? '+' : ''}{dailyChange}% Today
        </Text>
      </View>

      {/* Right: ATH */}
      <View style={{ alignItems: 'flex-end' }}>
        <View style={styles.kpiRow}>
             <Text style={styles.kpiValue}>{formatCurrency(ath)}</Text>
             <Text style={styles.kpiLabel}> ATH</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'flex-start',
  },
  kpiRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  kpiValue: {
    fontFamily: FONT_FAMILY.balance, // Bold
    fontSize: 20, 
    color: '#FFF',
    lineHeight: 24,
  },
  kpiLabel: {
    fontFamily: FONT_FAMILY.header, // Medium
    fontSize: 14,
    color: '#9A9A9A',
  },
  change: {
    fontFamily: FONT_FAMILY.body, // Regular
    fontSize: 14,
    marginTop: 4,
  }
});
