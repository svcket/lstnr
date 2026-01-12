import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { BinaryMarket } from '../../types/prediction';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

interface BinaryMarketCardProps {
  market: BinaryMarket;
  onPress: (market: BinaryMarket) => void;
}

// Helper for tint
const getPillStyle = (label: string, index: number) => {
    const l = label.toLowerCase();
    if (l === 'yes') return { backgroundColor: 'rgba(74, 222, 128, 0.15)' }; // Green tint
    if (l === 'no') return { backgroundColor: 'rgba(248, 113, 113, 0.15)' }; // Red tint
    return { backgroundColor: index === 0 ? '#3A2A2A' : '#2A2A3A' };
};

export const BinaryMarketCard = ({ market, onPress }: BinaryMarketCardProps) => {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.95 : 1 }
      ]}
      onPress={() => onPress(market)}
    >
      {/* ... Header ... */}
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{market.title}</Text>
      
      {market.isLive && (
        <View style={styles.statusRow}>
           <Text style={styles.liveLabel}>LIVE</Text>
           <View style={[styles.dot, { backgroundColor: '#FF3B30' }]} />
           <Text style={styles.statusText}>• {market.livePhaseLabel || 'LIVE'}</Text>
           <Text style={styles.statusText}> • {market.liveClockLabel || '00:00'}</Text>
        </View>
      )}

      {/* Options List */}
      <View style={[styles.optionsList, !market.isLive && { marginTop: 12 }]}> 
        {market.options.map((option, index) => (
          <View key={option.id} style={styles.optionRow}>
            {/* Left Cluster */}
            <View style={styles.leftCluster}>
                <View style={[styles.iconTile, { backgroundColor: option.iconBg || '#2A2A2A' }]}>
                    {option.iconUrl ? (
                        <Image 
                            source={{ uri: option.iconUrl }} 
                            style={styles.iconImage}
                            // Graceful fallback logic could be handled by component state, but for now strictly mapping props
                        />
                    ) : (
                        <View style={styles.placeholderGlyph} />
                    )}
                </View>
                <Text style={styles.optionLabel} numberOfLines={1}>{option.label}</Text>
            </View>

            {/* Right Cluster */}
            <View style={styles.rightCluster}>
                {option.score !== undefined && (
                    <View style={styles.scoreChip}>
                        <Text style={styles.scoreText}>{option.score}</Text>
                    </View>
                )}
                
                {/* Tinted Pill */}
                <View style={[styles.percentagePill, getPillStyle(option.label, index)]}> 
                   <View style={styles.percentagePillInner}>
                       <Text style={styles.percentageText}>{Math.round(option.percentage)}%</Text>
                   </View>
                </View>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.footerMeta}>
        {market.volumeLabel} • {market.categoryLabel} • {market.deadlineLabel}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#151515',
    borderRadius: 20,
    padding: 16,
    // Removed border per request
    width: '100%',
  },
  // ... rest of styles

  
  // Title
  title: {
    fontSize: 16, // 15-16px SemiBold
    fontFamily: FONT_FAMILY.medium,
    fontWeight: '600', // Semibold weight
    color: '#FFFFFF',
    lineHeight: 24, // Increased legibility
    marginBottom: 6,
  },

  // Status Row
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveLabel: {
    fontSize: 13,
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700',
    color: '#FF3B30',
    marginRight: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 1,
  },
  statusText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY.body,
    color: '#9A9A9A',
  },

  // Options
  optionsList: {
    gap: 12, // 12px between rows
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftCluster: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 12,
  },
  iconTile: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: '#2A2A2A',
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
  },
  iconImage: {
      width: '100%',
      height: '100%',
  },
  placeholderGlyph: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: 'rgba(255,255,255,0.2)',
  },
  optionLabel: {
      fontSize: 15,
      fontFamily: FONT_FAMILY.medium,
      color: '#FFFFFF',
      flex: 1,
  },

  rightCluster: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  scoreChip: {
      minWidth: 28,
      height: 28,
      paddingHorizontal: 6,
      borderRadius: 8,
      backgroundColor: '#2A2A2A',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
  },
  scoreText: {
      fontSize: 14,
      fontFamily: FONT_FAMILY.medium,
      color: '#FFFFFF',
  },
  percentagePill: {
      minWidth: 58,
      height: 30,
      borderRadius: 12,
      backgroundColor: '#2A2A2A',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
  },
  percentagePillInner: {
      paddingHorizontal: 10,
  },
  percentageText: {
      fontSize: 14,
      fontFamily: FONT_FAMILY.medium,
      color: '#FFFFFF',
  },

  // Footer
  footerMeta: {
    marginTop: 14,
    fontSize: 13,
    fontFamily: FONT_FAMILY.body,
    color: '#8A8A8A',
  },
});
