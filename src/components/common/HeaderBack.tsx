import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

interface HeaderBackProps {
  onPress?: () => void;
  color?: string;
}

export const HeaderBack = ({ onPress, color = COLORS.white }: HeaderBackProps) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={styles.container}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <ArrowLeft size={24} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4, // Slight touch target padding
  },
});
