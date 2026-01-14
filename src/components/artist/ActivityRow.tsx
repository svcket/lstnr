import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FONT_FAMILY, COLORS } from '../../constants/theme';
import { ActivityItem } from '../../data/social';

interface ActivityRowProps {
  item: ActivityItem;
  isLast: boolean;
}

export const ActivityRow = ({ item, isLast }: ActivityRowProps) => {
  const isAcquired = item.action === 'acquired';
  const actionColor = isAcquired ? COLORS.success : COLORS.error;
  const sign = isAcquired ? '+' : '-';

  return (
    <View style={[styles.container, !isLast && styles.borderBottom]}>
      {/* Left: Avatar + User Info */}
      <View style={styles.left}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
             <Text style={styles.username}>{item.user.name}</Text>
             <Text style={styles.action}>
                 <Text style={{color: actionColor}}>{item.action}</Text>
                 <Text style={{color: '#9A9A9A'}}> • {item.timestamp}</Text>
             </Text>
        </View>
      </View>

      {/* Right: Stacked Value Info */}
      <View style={styles.right}>
          {/* Top: USD Value */}
          <Text style={styles.value}>${item.value.toLocaleString()}</Text>
          
          {/* Middle: Token Amount */}
          <Text style={[styles.amount, { color: actionColor }]}>
              {sign}{item.amount.toLocaleString()} <Text style={styles.symbol}>{item.symbol}</Text>
          </Text>

          {/* Bottom: Impact/Stat */}
          {item.impact !== undefined && (
             <Text style={styles.impact}>
                 {item.impact.toFixed(2)}%
             </Text>
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 0, // Parent handles padding
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    marginRight: 12,
  },
  userInfo: {
      justifyContent: 'center',
  },
  username: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.header,
    fontSize: 14, // Standard body size
    fontWeight: '600',
    marginBottom: 2,
  },
  action: {
      fontSize: 13,
      color: '#999',
  },
  right: {
      alignItems: 'flex-end',
      minWidth: 80,
  },
  value: {
      color: '#FFF',
      fontFamily: FONT_FAMILY.header,
      fontWeight: '700',
      fontSize: 14,
      marginBottom: 2,
  },
  amount: {
      fontSize: 12,
      fontWeight: '500',
      marginBottom: 0,
  },
  symbol: {
      fontSize: 10,
      color: '#666',
      marginBottom: 2,
  },
  impact: {
      color: '#666',
      fontSize: 11,
  },
});
