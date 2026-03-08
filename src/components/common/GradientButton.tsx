import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const GradientButton = ({ title, onPress, icon, disabled, style, textStyle }: GradientButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.container, style, disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={[COLORS.primaryGradient[0], COLORS.primaryGradient[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            />

            {icon}
            <Text style={[styles.text, textStyle, icon ? { marginLeft: 8 } : {}]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    text: {
        color: '#FFF',
        fontFamily: FONT_FAMILY.header,
        fontSize: 16,
        fontWeight: Platform.OS === 'web' ? '500' : 'normal',
    },
    disabled: {
        opacity: 0.6,
    }
});
