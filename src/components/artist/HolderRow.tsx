import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { formatCompact } from '../../mock/artistMarket';

interface Holder {
  id: string;
  name: string;
  avatar?: string;
  sharesOwned: number;
  followersCount: number;
  isFollowing: boolean;
}

interface HolderRowProps {
  holder: Holder;
  totalShares: number;
  sharePrice: number;
  isLast?: boolean;
}

export const HolderRow = ({ holder, totalShares, sharePrice, isLast }: HolderRowProps) => {
  const value = holder.sharesOwned * sharePrice;
  const percentage = (holder.sharesOwned / totalShares) * 100;

  return (
    <View style={[styles.container, isLast && styles.lastItem]}>
      {/* Left: Avatar + Info */}
      <View style={styles.left}>
        <Image 
          source={{ uri: holder.avatar || 'https://i.pravatar.cc/150' }} 
          style={styles.avatar} 
        />
        <View>
          <Text style={styles.name}>{holder.name}</Text>
          <Text style={styles.subtext}>
            {holder.sharesOwned} shares • {holder.followersCount} followers
          </Text>
        </View>
      </View>

      {/* Right: Value + % + Arrow */}
      <View style={styles.right}>
        <View style={{ alignItems: 'flex-end', marginRight: 12 }}>
            <Text style={styles.value}>{formatCompact(value)}</Text>
            <Text style={styles.percentage}>{percentage.toFixed(2)}%</Text>
        </View>
        <Image 
            source={require('../../assets/icons/chevron-right.png')} // Fallback or strict icon ref
            style={{ width: 16, height: 16, tintColor: '#666' }}
            resizeMode="contain"
        />
      </View>
    </View>
  );
};
// Note: using explicit image or lucide? Prompt said "Arrow icon". 
// I will use Lucide ChevronRight for consistency if not strictly assets. Actually I'll use Lucide.

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  name: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.header, // Medium
    fontSize: 14,
    marginBottom: 2,
  },
  subtext: {
    color: '#666',
    fontFamily: FONT_FAMILY.body, // Regular
    fontSize: 12,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700', // Explicit Bold
    fontSize: 15, // +1px as requested
    marginBottom: 2,
  },
  percentage: {
    color: '#999',
    fontFamily: FONT_FAMILY.body, // Regular
    fontSize: 12,
  },
});
