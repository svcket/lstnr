import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

interface TopAmountSummaryProps {
    label: string;
    amount: string;
    subLabel?: string;
}

export const TopAmountSummary = ({ label, amount, subLabel }: TopAmountSummaryProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.amount}>{amount}</Text>
            {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginTop: 8,
        marginBottom: 24,
    },
    label: {
        fontFamily: FONT_FAMILY.medium,
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    amount: {
        fontFamily: FONT_FAMILY.balance,
        fontSize: 48,
        fontWeight: '600',
        color: COLORS.white,
        letterSpacing: -1,
    },
    subLabel: {
        fontFamily: FONT_FAMILY.body,
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
});
