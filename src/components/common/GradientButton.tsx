import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
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
            <Svg height="100%" width="100%" style={styles.gradient}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor={COLORS.primaryGradient[0]} stopOpacity="1" />
                        <Stop offset="1" stopColor={COLORS.primaryGradient[1]} stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
            </Svg>
            
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
        fontWeight: 'bold',
    },
    disabled: {
        opacity: 0.6,
    }
});
