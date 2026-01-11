import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../../constants/theme';

interface ActivityItem {
  id: string;
  user: {
    username: string;
    avatarUrl: string;
    shares: number;
    followers: number;
    isFollowing: boolean;
    isSelf: boolean;
  };
  type: 'acquired' | 'released';
  deltaShares: number;
  symbol: string;
  percent: number;
  timestampLabel?: string;
}

interface ActivityRowProps {
  item: ActivityItem;
  isLast?: boolean;
}

export const ActivityRow = ({ item, isLast }: ActivityRowProps) => {
  const isAcquired = item.type === 'acquired';
  const actionColor = isAcquired ? '#4ADE80' : '#F87171'; // Green : Red
  const sign = isAcquired ? '+' : '-';

  return (
    <View style={[styles.container, isLast && styles.lastItem]}>
      {/* Left: Avatar + Main Info */}
      <View style={styles.left}>
        <Image 
          source={{ uri: item.user.avatarUrl }} 
          style={styles.avatar} 
        />
        <View>
          <Text style={styles.line1}>
            <Text style={styles.username}>{item.user.username}</Text>
            <Text style={{ color: actionColor }}> {item.type}</Text>
          </Text>
          <Text style={styles.meta}>
            {item.user.shares} shares • {item.user.followers} followers
          </Text>
        </View>
      </View>

      {/* Right: Value Delta */}
      <View style={styles.right}>
        <Text style={[styles.value, { color: actionColor }]}>
          {sign}{item.deltaShares} {item.symbol}
        </Text>
        <Text style={styles.percent}>{item.percent}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222', // Match HolderRow separator or subtle divider
    // User requested "If Holders uses no dividers, use none here", but mock Holders *did* use subtle separators.
    // Sticking to subtle divider from Holders logic.
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
  line1: {
    fontFamily: FONT_FAMILY.header, // Medium
    fontSize: 14,
    marginBottom: 2,
    color: '#FFF',
  },
  username: {
    color: '#FFF',
  },
  meta: {
    color: '#9A9A9A', // Muted gray
    fontFamily: FONT_FAMILY.body, // Regular
    fontSize: 12,
  },
  right: {
    alignItems: 'flex-end',
  },
  value: {
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700', // Explicit Bold
    fontSize: 14,
    marginBottom: 2,
  },
  percent: {
    color: '#9A9A9A',
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
  },
});
