import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../constants/theme';

interface ScreenProps extends SafeAreaViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export const Screen = ({ children, style, edges, ...props }: ScreenProps) => {
  return (
    <SafeAreaView 
      style={[styles.container, style]} 
      edges={edges || ['top', 'left', 'right']} 
      {...props}
    >
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.l,
  },
});
