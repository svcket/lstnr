import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

interface TopSummaryBlockProps {
  label: string;
  value: string;
  rightMeta?: React.ReactNode; 
}

export const TopSummaryBlock = ({ label, value, rightMeta }: TopSummaryBlockProps) => {
  return (
    <View style={styles.summaryTop}>
      <View>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
      </View>
      {rightMeta && (
        <View style={{ alignItems: 'flex-end' }}>
          {rightMeta}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  summaryLabel: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: FONT_FAMILY.balance,
    fontWeight: '700',
    fontSize: 24,
    color: '#FFF',
  },
});
