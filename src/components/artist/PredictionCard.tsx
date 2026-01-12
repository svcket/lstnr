import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { formatCompact } from '../../mock/artistMarket'; 
import { useNavigation } from '@react-navigation/native';
import { Prediction } from '../../data/catalog';
import { MultiRangeMarketCard } from '../predictions/MultiRangeMarketCard';
import { BinaryMarketCard } from '../predictions/BinaryMarketCard';
import { MultiRangeMarket, BinaryMarket, BinaryOption } from '../../types/prediction';

const { width } = Dimensions.get('window');

interface PredictionCardProps {
  prediction: Prediction;
}

export const PredictionCard = ({ prediction }: PredictionCardProps) => {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate('PredictionDetail', { predictionId: prediction.id });
  };

  if (prediction.marketType === 'multi-range') {
    const marketData: MultiRangeMarket = {
        id: prediction.id,
        marketType: 'multi-range',
        title: prediction.question,
        categoryLabel: prediction.category || 'Music',
        iconEmoji: '🎵',
        volumeLabel: `$${formatCompact(prediction.volume)} Vol.`,
        deadlineLabel: new Date(prediction.deadline).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }), 
        options: prediction.outcomes.map(o => ({
            label: o.name,
            percentage: o.chance
        }))
    };
    return <MultiRangeMarketCard market={marketData} onPress={handlePress} />;
  }

  // BINARY
  if (prediction.marketType === 'binary') {
      // Check if we have rich options (from new seed data) or need to synthesize Yes/No
      let options: [BinaryOption, BinaryOption];
      
      // @ts-ignore: Temporary check until catalog.ts type is fully updated to match new seed structure
      if (prediction.options && prediction.options.length === 2) {
          // @ts-ignore
          options = prediction.options.map(o => ({
              id: o.id,
              label: o.label,
              percentage: o.percentage,
              score: o.score,
              iconBg: o.iconBg,
              iconUrl: o.iconUrl
          })) as [BinaryOption, BinaryOption];
      } else {
          // Synthesize Yes/No from simple 'chance'
          options = [
              { id: 'yes', label: 'Yes', percentage: prediction.chance, iconBg: '#2A2A2A' },
              { id: 'no', label: 'No', percentage: 100 - prediction.chance, iconBg: '#2A2A2A' }
          ];
      }

      const marketData: BinaryMarket = {
          id: prediction.id,
          marketType: 'binary',
          title: prediction.question,
          isLive: prediction.isLive,
          livePhaseLabel: 'Q2', // Default or need data
          liveClockLabel: '00:00', // Default or need data
          categoryLabel: 'Music', // Fixed for now
          volumeLabel: `$${formatCompact(prediction.volume)} Vol.`,
          deadlineLabel: new Date(prediction.deadline).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
          options: options
      };
      
      return <BinaryMarketCard market={marketData} onPress={handlePress} />;
  }

  return null;
};

const styles = StyleSheet.create({});
