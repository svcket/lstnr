import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { COLORS } from '../constants/theme';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/logo_stack.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 89,
    height: 69,
  },
});
