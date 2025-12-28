import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { TrendingUp, TrendingDown, DollarSign, History } from 'lucide-react-native';

const MOCK_HOLDINGS = [
  { id: 'h1', name: 'Neon Dust', shares: 15, avgPrice: 40.50, currentPrice: 45.20 },
  { id: 'h2', name: 'Luna Tide', shares: 8, avgPrice: 32.00, currentPrice: 28.90 },
];

const MOCK_POSITIONS = [
  { id: 'p1', question: 'Neon Dust Top 50', type: 'YES', amount: 50, price: 0.65, value: 50 },
];

const MOCK_HISTORY = [
    { id: 't1', type: 'BUY', asset: 'Neon Dust', amount: 200, date: '2025-05-15' },
    { id: 't2', type: 'SELL', asset: 'Steel Pulse', amount: 150, date: '2025-05-10' },
];

export const PortfolioScreen = () => {
    const { user } = useAuth();

    const portfolioValue = MOCK_HOLDINGS.reduce((acc, h) => acc + (h.shares * h.currentPrice), 0);
    const positionsValue = MOCK_POSITIONS.reduce((acc, p) => acc + (p.amount * p.price), 0); // Simplified value
    const totalBalance = (user?.balance || 0) + portfolioValue + positionsValue;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Portfolio</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>Total Balance</Text>
                    <Text style={styles.balanceValue}>${totalBalance.toFixed(2)}</Text>
                    <View style={styles.breakdown}>
                        <View style={styles.breakdownItem}>
                            <Text style={styles.breakdownLabel}>Cash</Text>
                            <Text style={styles.breakdownValue}>${user?.balance.toFixed(2)}</Text>
                        </View>
                        <View style={styles.breakdownItem}>
                            <Text style={styles.breakdownLabel}>Assets</Text>
                            <Text style={styles.breakdownValue}>${(portfolioValue + positionsValue).toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Artist Shares</Text>
                {MOCK_HOLDINGS.map((item) => {
                    const value = item.shares * item.currentPrice;
                    const roi = ((item.currentPrice - item.avgPrice) / item.avgPrice) * 100;
                    return (
                        <Card key={item.id} style={styles.holdingCard}>
                            <View style={styles.holdingRow}>
                                <View>
                                    <Text style={styles.holdingName}>{item.name}</Text>
                                    <Text style={styles.holdingShares}>{item.shares} shares</Text>
                                </View>
                                <View style={styles.holdingRight}>
                                    <Text style={styles.holdingValue}>${value.toFixed(2)}</Text>
                                    <View style={styles.roiContainer}>
                                        {roi >= 0 ? <TrendingUp size={12} color={COLORS.success} /> : <TrendingDown size={12} color={COLORS.error} />}
                                        <Text style={[styles.roi, { color: roi >= 0 ? COLORS.success : COLORS.error }]}>
                                            {Math.abs(roi).toFixed(1)}%
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    );
                })}

                <Text style={styles.sectionTitle}>Market Positions</Text>
                {MOCK_POSITIONS.map((item) => (
                    <Card key={item.id} style={styles.positionCard}>
                         <View style={styles.holdingRow}>
                                <View style={styles.positionInfo}>
                                    <Text style={styles.positionQ} numberOfLines={1}>{item.question}</Text>
                                    <View style={[styles.badge, { backgroundColor: item.type === 'YES' ? COLORS.success : COLORS.error }]}>
                                        <Text style={styles.badgeText}>{item.type}</Text>
                                    </View>
                                </View>
                                <View style={styles.holdingRight}>
                                     <Text style={styles.holdingValue}>${(item.amount * item.price).toFixed(2)}</Text>
                                </View>
                        </View>
                    </Card>
                ))}

                <Text style={styles.sectionTitle}>History</Text>
                {MOCK_HISTORY.map((item) => (
                    <View key={item.id} style={styles.historyRow}>
                        <View style={styles.historyIcon}>
                            <History size={16} color={COLORS.textSecondary} />
                        </View>
                        <View style={styles.historyInfo}>
                            <Text style={styles.historyType}>{item.type} {item.asset}</Text>
                            <Text style={styles.historyDate}>{item.date}</Text>
                        </View>
                        <Text style={styles.historyAmount}>${item.amount}</Text>
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
    padding: SPACING.l,
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
  sectionTitle: {
      color: COLORS.text,
      fontSize: FONT_SIZE.l,
      fontWeight: 'bold',
      marginBottom: SPACING.m,
      marginTop: SPACING.m,
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
