import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { formatCompact } from '../../mock/artistMarket';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface Prediction {
  id: string;
  question: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  chance: number;
  resolvesAt: string;
}

interface PredictionCardProps {
  prediction: Prediction;
}

export const PredictionCard = ({ prediction }: PredictionCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleAction = () => {
    // v1: View-only toast/alert
    Alert.alert('Coming Soon', 'Trading predictions is currently in development.');
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  // Gauge Color Logic
  const getGaugeColor = (prob: number) => {
    if (prob >= 70) return '#4ADE80'; // Green
    if (prob <= 30) return '#F87171'; // Red
    return '#F5A623'; // Orange/Neutral
  };

  return (
    <View style={styles.card}>
      {/* Header: Question + Gauge */}
      <View style={styles.header}>
        <Text style={styles.question} numberOfLines={3}>
          {prediction.question}
        </Text>
        <View style={styles.gaugeContainer}>
          <Gauge percent={prediction.chance} color={getGaugeColor(prediction.chance)} />
          <View style={styles.gaugeTextContainer}>
            <Text style={styles.gaugePercent}>{prediction.chance}%</Text>
            <Text style={styles.gaugeLabel}>Chance</Text>
          </View>
        </View>
      </View>

      {/* YES/NO Pills */}
      <View style={styles.pillsRow}>
        <TouchableOpacity 
          style={[styles.pill, styles.yesPill]} 
          activeOpacity={0.7}
          onPress={handleAction}
        >
          <Text style={styles.pillTextYes}>Yes {prediction.yesPrice}¢</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.pill, styles.noPill]} 
          activeOpacity={0.7}
          onPress={handleAction}
        >
          <Text style={styles.pillTextNo}>No {prediction.noPrice}¢</Text>
        </TouchableOpacity>
      </View>

      {/* Footer: Volume + Bookmark */}
      <View style={styles.footer}>
        <Text style={styles.volume}>${formatCompact(prediction.volume)} Vol.</Text>
        <TouchableOpacity onPress={toggleSave}>
          <Bookmark 
            size={20} 
            color={isSaved ? '#FFF' : '#666'} 
            fill={isSaved ? '#FFF' : 'transparent'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Simple Circular Gauge Component
const Gauge = ({ percent, color }: { percent: number, color: string }) => {
  const size = 48;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (percent / 100) * circumference;
  
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2A2A2A"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  question: {
    flex: 1,
    fontFamily: FONT_FAMILY.header, // Medium
    fontWeight: '500', // Explicit Medium
    fontSize: 16,
    color: '#FFF',
    lineHeight: 22,
    marginRight: 12, // Force text away from gauge
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
  },
  gaugeTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  gaugePercent: {
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700', // Explicit Bold
    fontSize: 12,
    color: '#FFF',
  },
  gaugeLabel: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 8,
    color: '#999',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  pill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yesPill: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)', // Green tint
  },
  noPill: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)', // Red tint
  },
  pillTextYes: {
    fontFamily: FONT_FAMILY.balance, // Bold (Currency)
    fontWeight: '700',
    color: '#4ADE80',
    fontSize: 14,
  },
  pillTextNo: {
    fontFamily: FONT_FAMILY.balance, // Bold (Currency)
    fontWeight: '700',
    color: '#F87171',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  volume: {
    fontFamily: FONT_FAMILY.balance, // Bold (Currency)
    fontWeight: '700',
    fontSize: 12,
    color: '#666',
  },
});
