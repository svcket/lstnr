import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { BadgeCheck } from 'lucide-react-native';

interface AssetRowProps {
  name: string;
  amount: string;
  symbol: string;
  value: string;
  change: string;
  isPositive?: boolean;
  iconUrl?: string; // Placeholder for now
}

export const AssetRow = ({ name, amount, symbol, value, change, isPositive = true, iconUrl }: AssetRowProps) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      {/* Icon */}
      <View style={styles.iconContainer}>
         <View style={styles.iconPlaceholder} />
         {/* Badge overlay if needed */}
         <View style={styles.badgeContainer}>
             {/* Small icon overlay */}
         </View>
      </View>

      {/* Info */}
      <View style={styles.content}>
        <View style={styles.left}>
            <View style={styles.nameRow}>
                <Text style={styles.name}>{name}</Text>
                <BadgeCheck size={14} color="#3B82F6" fill="transparent" />
            </View>
            <Text style={styles.amount}>{amount} {symbol}</Text>
        </View>

        <View style={styles.right}>
            <Text style={styles.value}>{value}</Text>
            <Text style={[styles.change, { color: isPositive ? COLORS.success : COLORS.error }]}>
                {isPositive ? '+' : ''}{change}
            </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
    backgroundColor: '#1C1C1E', // Dark card bg
    marginHorizontal: SPACING.l,
    marginBottom: SPACING.s,
    borderRadius: 16,
  },
  iconContainer: {
    marginRight: SPACING.m,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    gap: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
    color: COLORS.text,
  },
  amount: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  value: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
    color: COLORS.text,
  },
  change: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
  },
});
