import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// @ts-ignore
import { BlurView } from 'expo-blur';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

interface BuySellBarProps {
  onBuy: () => void;
  onSell: () => void;
}

export const BuySellBar = ({ onBuy, onSell }: BuySellBarProps) => {
  // Using a View fallback if BlurView has issues, but trying Blur for premium feel.
  // Actually, safe bet is solid black with top border as per constraints "slight blur or solid #000000".
  
  return (
    <View style={styles.container}>
      {/* Buy Button: Black fill, Neon Green Outline, Green Text */}
      <TouchableOpacity style={[styles.btn, styles.buyBtn]} onPress={onBuy} activeOpacity={0.8}>
        <Text style={[styles.btnText, styles.buyText]}>Buy</Text>
      </TouchableOpacity>

      {/* Sell Button: Black fill, Red Outline, Red Text */}
      <TouchableOpacity style={[styles.btn, styles.sellBtn]} onPress={onSell} activeOpacity={0.8}>
        <Text style={[styles.btnText, styles.sellText]}>Sell</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16, // Top padding
    paddingBottom: 34, // Safe area approximation if not handled by SafeAreaView
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    gap: 16,
  },
  btn: {
    flex: 1,
    height: 56,
    borderRadius: 28, // Pill
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderWidth: 1,
  },
  buyBtn: {
    borderColor: '#00FF94', // Neon Green
  },
  sellBtn: {
    borderColor: '#FF3B30', // Soft Red
  },
  btnText: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
    fontWeight: '600',
  },
  buyText: {
    color: '#00FF94',
  },
  sellText: {
    color: '#FF3B30',
  }

});
