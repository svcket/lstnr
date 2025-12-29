import React from 'react';
import { View, Text } from 'react-native';

export const DebugScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white', fontSize: 32 }}>Pure Debug Screen</Text>
    </View>
  );
};
