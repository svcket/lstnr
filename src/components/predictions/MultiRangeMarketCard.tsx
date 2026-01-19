import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { MultiRangeMarket } from '../../types/prediction';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { ICONS } from '../../constants/assets';

interface MultiRangeMarketCardProps {
  market: MultiRangeMarket;
  onPress: (market: MultiRangeMarket) => void;
}

export const MultiRangeMarketCard = ({ market, onPress }: MultiRangeMarketCardProps) => {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.95 : 1 }
      ]}
      onPress={() => onPress(market)}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          {market.iconUrl ? (
            <Image source={{ uri: market.iconUrl }} style={styles.iconImage} />
          ) : (
            <Text style={styles.iconEmoji}>{market.iconEmoji || '🎵'}</Text>
          )}
        </View>
        <View style={styles.headerTextContainer}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
              <Text style={[styles.title, { flex: 1 }]} numberOfLines={2} ellipsizeMode="tail">{market.title}</Text>
              {market.isOwned && (
                  <Image 
                      source={ICONS.navWalletActive} 
                      style={{ width: 14, height: 14, tintColor: COLORS.textSecondary, marginTop: 4 }} 
                      resizeMode="contain"
                  />
              )}
          </View>
          <Text style={styles.subtitle}>{market.categoryLabel}</Text>
        </View>
      </View>

      {/* Options List */}
      <View style={styles.optionsList}>
        {market.options.slice(0, 3).map((option, index) => (
          <View key={`${option.label}-${index}`} style={styles.optionRow}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                <Text 
                    style={[styles.optionLabel, { flex: 0, marginRight: 6, flexShrink: 1 }]} 
                    numberOfLines={1}
                >
                    {option.label}
                </Text>
                {option.isOwned && (
                    <Image 
                        source={ICONS.navWalletActive} 
                        style={{ width: 14, height: 14, tintColor: COLORS.textSecondary }} 
                        resizeMode="contain"
                    />
                )}
            </View>
            <View style={styles.percentagePill}>
              <Text style={styles.percentageText}>{Math.round(option.percentage)}%</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer Meta */}
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Top alignment for wrapped text
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(139,92,246,0.16)', // Purple Tint
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  iconEmoji: {
    fontSize: 22,
  },
  headerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 17, // 16-17px Spec
    fontFamily: FONT_FAMILY.medium, // Semi-bold equiv
    fontWeight: '600', // Semibold weight
    color: '#FFFFFF',
    lineHeight: 24, // Increased
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONT_FAMILY.body, // Regular
    color: '#9A9A9A',
  },

  // Options
  optionsList: {
    marginBottom: 16,
    gap: 12, // 10-12px between rows
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30, // ~28-30
  },
  optionLabel: {
    fontSize: 15, // 14-15px
    fontFamily: FONT_FAMILY.body, // Regular
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  percentagePill: {
    minWidth: 48,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  percentageText: {
    fontSize: 14, // 13-14px
    fontFamily: FONT_FAMILY.medium, // Medium
    color: '#FFFFFF',
  },

  // Footer
  footerMeta: {
    fontSize: 13, // 12-13px
    fontFamily: FONT_FAMILY.body,
    color: '#8A8A8A',
  },
});
