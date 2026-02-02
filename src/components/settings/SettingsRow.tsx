import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

interface SettingsRowProps {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode; // e.g., Text value, Switch, or null for default chevron
    onPress?: () => void;
    isLast?: boolean;
    disabled?: boolean;
    isDestructive?: boolean; // For "Sign Out" red text
}

export const SettingsRow = ({ 
    icon, 
    title, 
    subtitle, 
    rightElement, 
    onPress, 
    isLast,
    disabled,
    isDestructive
}: SettingsRowProps) => {
    
    // If we pass an explicit rightElement, use it.
    // If explicit rightElement is null/undefined AND we have onPress, show Chevron.
    // If explicit rightElement is explicitly passed as null but we want nothing, handle carefully.
    // Logic: 
    // - if rightElement is defined -> render it
    // - else if onPress is defined -> render Chevron
    // - else -> render nothing
    
    const renderRight = () => {
        if (rightElement !== undefined) return rightElement;
        if (onPress) return <ChevronRight size={20} color="#666" />;
        return null; // display nothing
    };

    return (
        <TouchableOpacity 
            style={[styles.container, disabled && { opacity: 0.5 }]} 
            onPress={onPress}
            disabled={!onPress || disabled}
            activeOpacity={0.7}
        >
            <View style={styles.left}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <View style={styles.textContainer}>
                    <Text style={[styles.title, isDestructive && { color: COLORS.error }]}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
            </View>
            
            <View style={styles.right}>
                {renderRight()}
            </View>

            {!isLast && <View style={styles.separator} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: COLORS.surface, // Match group
        minHeight: 56,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    iconContainer: {
        // width: 24, 
        // alignItems: 'center', 
        // justifyContent: 'center'
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontFamily: FONT_FAMILY.body,
        fontSize: 16,
        color: COLORS.white,
        fontWeight: '500',
    },
    subtitle: {
        fontFamily: FONT_FAMILY.body,
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 8,
    },
    separator: {
        position: 'absolute',
        bottom: 0,
        left: 0, // Span end-to-end
        right: 0,
        height: 1,
        backgroundColor: COLORS.stroke.settings,
    }
});
