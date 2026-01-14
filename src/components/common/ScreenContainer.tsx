import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  px?: number;
}

export const ScreenContainer = ({ children, style, px = 16 }: ScreenContainerProps) => {
  return (
    <View style={[styles.container, { paddingHorizontal: px }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
