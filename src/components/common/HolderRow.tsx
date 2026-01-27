import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { Holder } from '../../data/social';
import { getDeterministicAvatar } from '../../lib/avatarResolver';
import { getHoldingPosition } from '../../utils/holdingResolvers';

interface HolderRowProps {
  item: Holder;
  rank?: number;
  isLast?: boolean;
  context?: {
      type: 'ARTIST' | 'LABEL' | 'PREDICTION';
      entityId: string;
      name?: string;
      ticker?: string;
  };
}

export const HolderRow = ({ item, rank, isLast, context }: HolderRowProps) => {
  const navigation = useNavigation<any>();

  // Determine avatar source: explicit avatar > deterministic
  const avatarSource = item.avatar 
    ? { uri: item.avatar } 
    : { uri: getDeterministicAvatar(item.name, item.id) };

  const handlePress = () => {
      // Fallback context if missing (shouldn't happen given usages)
      const safeContext = context || { type: 'ARTIST', entityId: 'unknown', name: 'Unknown' };
      
      try {
          const position = getHoldingPosition(item, {
              type: safeContext.type as any,
              entityId: safeContext.entityId,
              name: safeContext.name,
              ticker: safeContext.ticker,
              side: (item as any)._side
          });
          // Explicitly log for debugging (though user can't see, it validates intent)
          navigation.navigate('HoldingDetails', { position });
      } catch (e) {
          console.warn('Navigation failed', e);
      }
  };

  return (
    <TouchableOpacity 
        style={[styles.container, !isLast && styles.borderBottom]}
        onPress={handlePress}
        // disabled={!context} // Enabled always for better UX (fallback used)
        activeOpacity={0.7}
    >
      <View style={styles.left}>
         {rank && <Text style={styles.rank}>#{rank}</Text>}
         <Image source={avatarSource} style={styles.avatar} />
         <View style={styles.info}>
             <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
             <Text style={styles.subtext}>
                 {(item as any)._side && (
                    <Text style={{
                        color: (item as any)._side === 'YES' ? COLORS.success : COLORS.error, 
                        fontWeight: '700'
                    }}>
                        {(item as any)._side} 
                    </Text>
                 )}
                 <Text style={
                     (item as any)._side === 'YES' ? {color: COLORS.success} : 
                     (item as any)._side === 'NO' ? {color: COLORS.error} : undefined
                 }>
                    {((item as any)._side ? ' ' : '') + item.shares.toLocaleString()} shares
                 </Text> 
                 <Text style={styles.avgBuy}> • Avg ${((item.value / item.shares) * 0.9).toFixed(2)}</Text>
             </Text>
         </View>
      </View>

      <View style={styles.right}>
          <Text style={styles.value}>${item.value.toLocaleString()}</Text>
          {item.percent && (
              <Text style={[styles.pnl, { color: item.percent >= 0 ? COLORS.success : COLORS.error }]}>
                  {item.percent > 0 ? '+' : ''}{item.percent.toFixed(2)}%
              </Text>
          )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  rank: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    color: '#666',
    width: 24,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtext: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    color: '#999',
  },
  avgBuy: {
      color: '#666',
  },
  right: {
    alignItems: 'flex-end',
  },
  value: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '700',
    marginBottom: 2,
  },
  pnl: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    fontWeight: '500',
  }
});
