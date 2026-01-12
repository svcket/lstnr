import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { ChevronRight } from 'lucide-react-native';

interface EntityRowProps {
  name: string;
  avatarUrl: string;
  symbol?: string; // e.g. $KANYE
  volume?: string; // e.g. 155,275
  subtitle?: string; // e.g. 120 shares
  price?: string;
  changePct?: number; 
  onPress?: () => void;
  isLast?: boolean;
}

export const EntityRow = ({ name, avatarUrl, symbol, volume, subtitle, price, changePct, onPress, isLast }: EntityRowProps) => (
  <TouchableOpacity style={styles.entityRow} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.entityLeft}>
      <Image source={{ uri: avatarUrl }} style={styles.entityAvatar} />
      <View>
        <Text style={styles.entityName}>{name}</Text>
        <View style={styles.volRow}>
             {symbol && <Text style={styles.entitySymbol}>{symbol}</Text>}
             {subtitle && <Text style={styles.entityVol}>{subtitle}</Text>}
             {volume && <Text style={styles.entityVol}>Vol: {volume}</Text>}
        </View>
      </View>
    </View>
    <View style={styles.entityRight}>
      {price && <Text style={styles.entityPrice}>{price}</Text>}
      {changePct !== undefined && (
          <Text style={[styles.entityChange, { color: changePct >= 0 ? COLORS.success : COLORS.error }]}>
            {changePct > 0 ? '+' : ''}{changePct.toFixed(2)}%
          </Text>
      )}
    </View>
    {!isLast && <View style={styles.rowDivider} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
    entityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    entityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    entityAvatar: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#222',
        borderWidth: 1,
        borderColor: '#333'
    },
    entityName: {
        fontFamily: FONT_FAMILY.medium, // Explicit Medium
        fontSize: 16,
        color: '#FFF',
        marginBottom: 2,
    },
    volRow: {
        flexDirection: 'row', 
        alignItems: 'center',
        gap: 6
    },
    entitySymbol: {
        fontFamily: FONT_FAMILY.balance,
        fontSize: 12,
        fontWeight: '700',
        color: '#FFF'
    },
    entityVol: {
        fontFamily: FONT_FAMILY.body,
        fontSize: 12,
        color: 'rgba(255,255,255,0.45)',
    },
    entityRight: {
        alignItems: 'flex-end',
    },
    entityPrice: {
        fontFamily: FONT_FAMILY.balance,
        fontWeight: '700',
        fontSize: 16,
        color: '#FFF',
        marginBottom: 2,
    },
    entityChange: {
        fontFamily: FONT_FAMILY.balance,
        fontWeight: '700',
        fontSize: 12,
    },
    rowDivider: {
        position: 'absolute',
        bottom: 0,
        left: 60, 
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
});
