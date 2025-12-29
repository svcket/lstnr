import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, BUTTON_HEIGHT, FONT_FAMILY, FONT_SIZE } from '../../constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button = ({ 
  label, 
  onPress, 
  variant = 'primary', 
  isLoading = false, 
  disabled = false,
  style 
}: ButtonProps) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.surfaceLight;
    if (variant === 'primary') return COLORS.text; // White button on black bg usually pops, or Primary color (Volt)
    if (variant === 'secondary') return COLORS.surfaceLight;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return COLORS.textSecondary;
    if (variant === 'primary') return COLORS.black;
    return COLORS.text;
  };

  // Override for specific primary color if "Volt" is desired, but spec said White Text usually implies dark bg. 
  // Design request said "primary text = #FFFFFF". 
  // Let's stick to High Contrast: Primary = Volt (#CCFF00) with Black Text, or White with Black Text.
  // The theme said primary: '#CCFF00'. Let's use that for Primary Button.
  
  const bg = variant === 'primary' && !disabled ? COLORS.primary : getBackgroundColor();
  const text = variant === 'primary' && !disabled ? COLORS.black : getTextColor();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: bg },
        style
      ]} 
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={text} />
      ) : (
        <Text style={[styles.label, { color: text }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: BUTTON_HEIGHT,
    borderRadius: BORDER_RADIUS.button,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
  },
  label: {
    fontFamily: FONT_FAMILY.header,
    fontSize: FONT_SIZE.m,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
