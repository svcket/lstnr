import React from 'react';
import { View, Text, StyleSheet, StatusBar, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { ICONS } from '../constants/assets';
import { ActivityItem } from '../data/catalog';

export const TransactionDetailScreen = () => {
    const route = useRoute();
    const { activity } = route.params as { activity: ActivityItem };

    if (!activity) return null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <HeaderBack />
                    <Text style={styles.headerTitle}>Transaction Details</Text>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.hero}>
                        <Image 
                            source={activity.isMoneyOut ? ICONS.activityOut : ICONS.activityIn} 
                            style={styles.heroIcon} 
                            resizeMode="contain" 
                        />
                        <Text style={styles.amount}>{activity.amount}</Text>
                        <Text style={styles.status}>{activity.status}</Text>
                    </View>

                    <View style={styles.card}>
                        <DetailRow label="Transaction" value={activity.text} />
                        <DetailRow label="Type" value={activity.type} />
                        <DetailRow label="Date" value={activity.date} />
                        <DetailRow label="Time" value={activity.time} />
                        <DetailRow label="Reference ID" value={activity.id.toUpperCase()} copyable />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const DetailRow = ({ label, value, copyable }: { label: string, value: string, copyable?: boolean }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, copyable && styles.copyable]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 24,
        gap: 12,
        justifyContent: 'flex-start',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: FONT_FAMILY.balance,
        fontWeight: '700',
        color: '#FFF',
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 32,
    },
    heroIcon: {
        width: 64,
        height: 64,
        marginBottom: 16,
    },
    amount: {
        fontSize: 40,
        fontFamily: FONT_FAMILY.balance,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 8,
    },
    status: {
        fontSize: 14,
        fontFamily: FONT_FAMILY.medium,
        color: COLORS.success,
        backgroundColor: 'rgba(0, 255, 157, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        overflow: 'hidden',
    },
    card: {
        backgroundColor: '#111',
        borderRadius: 24,
        padding: 24,
        gap: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: '#888',
        fontFamily: FONT_FAMILY.body,
    },
    value: {
        fontSize: 15,
        color: '#FFF',
        fontFamily: FONT_FAMILY.medium,
        textAlign: 'right',
        flex: 1,
        marginLeft: 24,
    },
    copyable: {
        fontFamily: FONT_FAMILY.mono || 'System',
        fontSize: 13,
        color: '#AAA',
    }
});
