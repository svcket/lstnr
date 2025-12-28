import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{name} Screen</Text>
  </View>
);

export const HomeScreen = () => <PlaceholderScreen name="Home" />;
export const ExploreScreen = () => <PlaceholderScreen name="Explore" />;
export const MarketsScreen = () => <PlaceholderScreen name="Markets" />;
export const PortfolioScreen = () => <PlaceholderScreen name="Portfolio" />;
export const ProfileScreen = () => <PlaceholderScreen name="Profile" />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
