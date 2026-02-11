import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, FONT_FAMILY } from '../constants/theme';

import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components/Card';
import { TrendingUp, TrendingDown, DollarSign, History, Mic2, Disc, Sparkles, Download } from 'lucide-react-native';

import { getArtistById, getPredictionById, getRecentActivity } from '../data/catalog';
import { getDeterministicAvatar } from '../lib/avatarResolver';
// import { LedgerStore } from '../lib/ledgerStore'; // Replaced by usePortfolio
import { usePortfolio } from '../hooks/usePortfolio';

// Removed hardcoded MOCK_HOLDINGS and MOCK_POSITIONS. Using catalog data.

const MOCK_HISTORY = [
    { id: 't1', type: 'BUY', asset: 'Neon Dust', amount: 200, date: '2025-05-15' },
    { id: 't2', type: 'SELL', asset: 'Steel Pulse', amount: 150, date: '2025-05-10' },
];

export const PortfolioScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();

    // Data Hook (Supabase or Mock)
    const { cashBalance, portfolioValue, holdings: portfolio, loading } = usePortfolio();

    // Predictions (Still mock for now until Phase 5)
    // const positions = getPredictionPortfolio(); 
    // const positionsValue = positions.reduce((acc, p) => acc + p.amount, 0); 
    // To simplify: let's ignore predictions in total for now or fetch them if possible. 
    // For now, assume prediction portfolio is empty or use mock if we want.
    // Let's keep prediction MOCK for now to not break UI if user has them.
    const positions: any[] = []; // Mock disabled for consistency, or fetch from hook later
    const positionsValue = 0;

    const totalBalance = cashBalance + portfolioValue + positionsValue;
    const availableBalance = cashBalance;

    const history = getRecentActivity(); // Keep this mock for now until TransactionRepo is built

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Portfolio</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>Total Balance</Text>
                    <Text style={styles.balanceValue}>${totalBalance.toFixed(2)}</Text>
                    <Text style={{ color: COLORS.success, fontWeight: 'bold' }}>+$612.40 (+4.8%) <Text style={{ color: '#888', fontWeight: 'normal' }}>today</Text></Text>

                    {/* Withdraw Balance (Option A) */}
                    <View style={styles.withdrawDivider} />
                    <View style={styles.withdrawRow}>
                        <Text style={styles.withdrawLabel}>Available to withdraw</Text>
                        <Text style={styles.withdrawValue}>${availableBalance.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.actionsContainer}
                >
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => (navigation as any).navigate('Artists')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconCircle}>
                            <Mic2 size={24} color="#FFF" />
                        </View>
                        <Text style={styles.actionLabel}>Artists</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => (navigation as any).navigate('Labels')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconCircle}>
                            <Disc size={24} color="#FFF" />
                        </View>
                        <Text style={styles.actionLabel}>Labels</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => (navigation as any).navigate('Predictions')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconCircle}>
                            <Sparkles size={24} color="#FFF" />
                        </View>
                        <Text style={styles.actionLabel}>Predict</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => (navigation as any).navigate('Withdraw')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconCircle}>
                            <Download size={24} color="#FFF" />
                        </View>
                        <Text style={styles.actionLabel}>Withdraw</Text>
                    </TouchableOpacity>
                </ScrollView>

                <Text style={styles.sectionTitle}>Artist Shares</Text>
                {portfolio.map((item) => {
                    const price = item.currentPrice;
                    const value = item.value;
                    // ROI calc (placeholder 0 for now as avgEntry not in view yet)
                    const roi = 0;

                    return (
                        <Card key={item.assetId} style={styles.holdingCard}>
                            <TouchableOpacity
                                style={styles.holdingRow}
                                activeOpacity={0.7}
                                onPress={() => (navigation as any).navigate('ArtistDetail', { artistId: item.assetId })}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <Image
                                        source={{ uri: item.avatarUrl }}
                                        style={{ width: 40, height: 40, borderRadius: 10 }}
                                    />
                                    <View>
                                        <Text style={styles.holdingName}>{item.name}</Text>
                                        <Text style={styles.holdingShares}>{item.shares} shares</Text>
                                    </View>
                                </View>
                                <View style={styles.holdingRight}>
                                    <Text style={styles.holdingValue}>${value.toFixed(2)}</Text>
                                    <View style={styles.roiContainer}>
                                        {roi >= 0 ? <TrendingUp size={12} color={COLORS.success} /> : <TrendingDown size={12} color={COLORS.error} />}
                                        <Text style={[styles.roi, { color: roi >= 0 ? COLORS.success : COLORS.error }]}>
                                            {roi.toFixed(1)}%
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Card>
                    );
                })}

                <Text style={styles.sectionTitle}>Market Positions</Text>
                {positions.map((item) => {
                    const pred = getPredictionById(item.predictionId);
                    return (
                        <Card key={item.predictionId} style={styles.positionCard}>
                            <TouchableOpacity
                                style={styles.holdingRow}
                                activeOpacity={0.7}
                                onPress={() => (navigation as any).navigate('PredictionDetail', { predictionId: item.predictionId })}
                            >
                                <View style={styles.positionInfo}>
                                    <Text style={styles.positionQ} numberOfLines={1}>{pred?.question || 'Prediction'}</Text>
                                    <View style={[styles.badge, { backgroundColor: item.outcomeId === 'yes' ? COLORS.success : COLORS.error }]}>
                                        <Text style={styles.badgeText}>{item.outcomeId.toUpperCase()}</Text>
                                    </View>
                                </View>
                                <View style={styles.holdingRight}>
                                    <Text style={styles.holdingValue}>${item.amount.toFixed(2)}</Text>
                                </View>
                            </TouchableOpacity>
                        </Card>
                    );
                })}

                <Text style={styles.sectionTitle}>History</Text>
                {history.map((item) => (
                    <View key={item.id} style={styles.historyRow}>
                        <View style={styles.historyIcon}>
                            <History size={16} color={COLORS.textSecondary} />
                        </View>
                        <View style={styles.historyInfo}>
                            <Text style={styles.historyType}>{item.text}</Text>
                            <Text style={styles.historyDate}>{item.date}</Text>
                        </View>
                        <Text style={styles.historyAmount}>{item.amount}</Text>
                    </View>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SPACING.m, // 16px
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: SPACING.m,
    },
    balanceContainer: {
        backgroundColor: COLORS.surface,
        padding: SPACING.l,
        borderRadius: BORDER_RADIUS.l,
        marginBottom: SPACING.xl,
    },
    balanceLabel: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZE.s,
    },
    balanceValue: {
        color: COLORS.text,
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: SPACING.s,
    },
    breakdown: {
        flexDirection: 'row',
        gap: SPACING.xl,
        marginTop: SPACING.m,
        borderTopWidth: 1,
        borderColor: COLORS.border,
        paddingTop: SPACING.m,
    },
    breakdownItem: {

    },
    breakdownLabel: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZE.xs,
    },
    breakdownValue: {
        color: COLORS.text,
        fontWeight: 'bold',
    },

    holdingCard: {
        padding: SPACING.m,
    },
    holdingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    holdingName: {
        color: COLORS.text,
        fontWeight: 'bold',
        fontSize: FONT_SIZE.m,
    },
    holdingShares: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZE.s,
    },
    holdingRight: {
        alignItems: 'flex-end',
    },
    holdingValue: {
        color: COLORS.text,
        fontWeight: 'bold',
        fontSize: FONT_SIZE.m,
    },
    roiContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    roi: {
        fontSize: FONT_SIZE.xs,
        fontWeight: 'bold',
    },
    positionCard: {
        padding: SPACING.m,
    },
    positionInfo: {
        flex: 1,
        marginRight: SPACING.m,
    },
    positionQ: {
        color: COLORS.text,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: COLORS.background,
        fontWeight: 'bold',
        fontSize: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12, // Gap between buttons
        marginBottom: SPACING.xl,
        paddingRight: 16, // Padding for scroll end
    },
    actionBtn: {
        width: 100, // Fixed width for square-ish look
        height: 100,
        backgroundColor: COLORS.surface, // Updated from #151515
        borderRadius: 24, // Soft rounded corners
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    iconCircle: {
        marginBottom: 48,
    },
    withdrawDivider: {
        height: 1,
        backgroundColor: '#333',
        width: '100%',
        marginTop: 12,
        marginBottom: 12,
    },
    withdrawRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 8, // slight padding for alignment
    },
    withdrawLabel: {
        color: '#888',
        fontSize: 14,
        fontFamily: FONT_FAMILY.body,
    },
    withdrawValue: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: FONT_FAMILY.medium,
        fontWeight: '600',
    },
    actionLabel: {
        marginTop: 8,
        fontSize: 12,
        color: COLORS.textSecondary,
        fontFamily: FONT_FAMILY.medium,
    },
    sectionTitle: {
        color: '#FFF',
        fontFamily: 'ClashDisplay-Medium',
        fontSize: 14,
        fontWeight: '600',
    },
    historyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.m,
        borderBottomWidth: 1,
        borderColor: COLORS.surface,
    },
    historyIcon: {
        marginRight: SPACING.m,
    },
    historyInfo: {
        flex: 1,
    },
    historyType: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
    historyDate: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZE.xs,
    },
    historyAmount: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
});
