import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { HeaderBack } from '../../components/common/HeaderBack';
import { SettingsRow } from '../../components/settings/SettingsRow';

// Mock Data
const TRANSACTIONS = [
    { id: '1', title: 'Bought $KANYE', amount: '-$50.00', date: 'Today, 10:23 AM', status: 'Completed' },
    { id: '2', title: 'Sold $DRAKE', amount: '+$120.00', date: 'Yesterday, 4:15 PM', status: 'Completed' },
    { id: '3', title: 'Prediction: Will Taylor Swift...', amount: '-$20.00', date: 'Jan 28', status: 'Pending' },
    { id: '4', title: 'Deposit', amount: '+$500.00', date: 'Jan 25', status: 'Completed' },
];

export const SettingsTransactionsScreen = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <HeaderBack />
                <Text style={styles.title}>Transactions</Text>
                <View style={{ width: 40 }} />
            </View>
            
            <FlatList
                data={TRANSACTIONS}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item, index }) => (
                    <SettingsRow
                        title={item.title}
                        subtitle={item.date}
                        rightElement={
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={[styles.amount, { color: item.amount.startsWith('+') ? COLORS.success : COLORS.text }]}>
                                    {item.amount}
                                </Text>
                                <Text style={styles.status}>{item.status}</Text>
                            </View>
                        }
                        isLast={index === TRANSACTIONS.length - 1}
                    />
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        marginBottom: SPACING.m,
    },
    title: {
        fontSize: 18,
        fontFamily: FONT_FAMILY.header,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    list: {
        paddingHorizontal: SPACING.l,
    },
    amount: {
        fontFamily: FONT_FAMILY.balance,
        fontSize: 14,
        fontWeight: '600',
    },
    status: {
        fontSize: 10,
        color: '#666',
        marginTop: 2,
    }
});
