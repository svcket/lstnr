import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/theme';

interface GradientSwitchProps {
    value: boolean;
    onValueChange: () => void;
}

export const GradientSwitch = ({ value, onValueChange }: GradientSwitchProps) => (
    <TouchableOpacity onPress={onValueChange} activeOpacity={0.8} style={styles.container}>
        <LinearGradient
            colors={value ? COLORS.primaryGradient : ['#333', '#333']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
                styles.gradient, 
                { alignItems: value ? 'flex-end' : 'flex-start' }
            ]}
        >
            <View style={styles.thumb} />
        </LinearGradient>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 30,
    },
    gradient: {
        flex: 1,
        borderRadius: 15,
        padding: 2,
        justifyContent: 'center',
    },
    thumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#FFF',
    }
});
