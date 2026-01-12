import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

interface FilterPillProps {
    label: string;
    value?: string | string[]; // Current selected value(s)
    isActive?: boolean; // If true, shows active style
    onPress: () => void;
}

export const FilterPill = ({ label, value, isActive, onPress }: FilterPillProps) => {
    // Determine what text to show. 
    // If value is present and not 'All'/'Global'/'Anytime', show value? 
    // Or just show label and highlight? 
    // Spec says: "label changes to selected value and/or a small dot"
    
    let displayText = label;
    if (value) {
        if (Array.isArray(value)) {
            if (value.length > 0 && !value.includes('All')) {
                displayText = `${label} (${value.length})`;
            }
        } else if (value !== 'All' && value !== 'Global' && value !== 'Anytime' && value !== 'rank_asc' && value !== '24h') {
            // Mapping complex values to readable might be needed, but mostly value==label in simple cases
            // For sort keys like 'rank_asc', we probably want to keep 'Rank' as label unless specific mappings.
            // Let's stick to: Always show Label, colour it if active.
            // OR checks for specific overrides.
            
            // For simplicity and robustness per spec:
            // "Rank" -> "Gainers" if Gainers selected.
            // So we need to pass the DISPLAY label of the selected value, not the raw value.
            // But the Pill component might not know the mapping.
            // Let's rely on parent passing the correct 'label' if they want dynamic text, 
            // OR just use `isActive` to highlight.
            // Looking at the screenshot, "Rank" stays "Rank" but maybe highlighted?
            // Actually screenshot shows "Rank", "24h", "Genres", "Region". 
            // Let's implement standard behavior: Label is static, style is active if filtered.
        }
    }

    return (
        <TouchableOpacity 
            style={[styles.container, isActive && styles.activeContainer]} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.text, isActive && styles.activeText]}>
                {displayText}
            </Text>
            <ChevronDown size={14} color={isActive ? COLORS.black : COLORS.white} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        height: 36,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    activeContainer: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.white,
    },
    text: {
        color: '#FFF',
        fontSize: 13,
        fontFamily: FONT_FAMILY.medium,
    },
    activeText: {
        color: COLORS.black,
    }
});
