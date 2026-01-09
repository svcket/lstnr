import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { ICONS } from '../../constants/assets';
import { Infinity } from 'lucide-react-native';

interface HorizontalCardProps {
  title: string;
  subtitle: string; // e.g., Volume or Leverage
  value?: string; // e.g., Price
  change?: string; 
  isPositive?: boolean;
  type: 'prediction' | 'perp';
}

export const HorizontalCard = ({ title, subtitle, value, change, isPositive, type }: HorizontalCardProps) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.top}>
        <View style={styles.iconPlaceholder}>
            {type === 'perp' ? (
                <Infinity size={16} color="#FFF" />
            ) : (
                <Image 
                    source={ICONS.actionPredict} 
                    style={{ width: 24, height: 24, tintColor: '#FFFFFF' }} 
                    resizeMode="contain"
                />
            )}
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        
        {type === 'perp' ? (
             // Perp Style: BTC 40x
             <View style={styles.perpRow}>
                 <Text style={styles.subtitle}>{subtitle}</Text> 
             </View>
        ) : (
             // Prediction Style: Vol ...
             <Text style={styles.subtitle}>{subtitle}</Text>
        )}

        {(value || change) && (
            <View style={styles.bottomRow}>
                {value && <Text style={styles.value}>{value}</Text>}
                {change && (
                  <Text style={[styles.change, { color: isPositive ? COLORS.success : COLORS.error }]}>
                      {change}%
                  </Text>
                )}
            </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 140,
    backgroundColor: '#111111', // Updated to match Home Screen cards
    borderRadius: 16,
    padding: SPACING.m,
    marginRight: SPACING.m,
    justifyContent: 'space-between',
  },
  top: {
    marginBottom: SPACING.s,
  },
  iconPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  perpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    color: '#9A9A9A', // Specific secondary color
  },
  bottomRow: {
    marginTop: 4,
  },
  value: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 14,
    color: COLORS.text,
  },
  change: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
  },
});
