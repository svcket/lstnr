import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { HeaderBack } from '../../components/common/HeaderBack';
import { getPortfolio, getArtistById, getPredictionPortfolio, getPredictionById } from '../../data/catalog';
import { getDeterministicAvatar } from '../../lib/avatarResolver';
import { LedgerStore } from '../../lib/ledgerStore';
import { useToast } from '../../context/ToastContext';
import { TradeSheet } from '../../components/artist/TradeSheet';

// Tab Component
const Tabs = ({ active, onChange }: { active: 'Shares' | 'Predictions', onChange: (mode: 'Shares' | 'Predictions') => void }) => (
    <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, active === 'Shares' && styles.tabActive]} onPress={() => onChange('Shares')}>
            <Text style={[styles.tabText, active === 'Shares' && styles.tabTextActive]}>Shares</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, active === 'Predictions' && styles.tabActive]} onPress={() => onChange('Predictions')}>
            <Text style={[styles.tabText, active === 'Predictions' && styles.tabTextActive]}>Predictions</Text>
        </TouchableOpacity>
    </View>
);

// ... imports
import { usePortfolio } from '../../hooks/usePortfolio';
import { USE_SUPABASE } from '../../services/supabase/client';

export const SellToWithdrawScreen = () => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState<'Shares' | 'Predictions'>('Shares');
    const [selectedItem, setSelectedItem] = useState<any>(null); // For TradeSheet
    const { showToast } = useToast();

    // Use Hook
    const { holdings, loading } = usePortfolio();

    const shares = holdings.map(p => {
        return {
            id: p.id,
            type: 'SHARE',
            title: p.name,
            subtitle: `${p.shares} shares • $${p.value.toFixed(2)}`,
            avatar: { uri: p.avatarUrl },
            value: p.value,
            raw: p,
            artistId: p.assetId,
            marketId: p.marketId || undefined, // Pass marketId
            symbol: p.symbol,
            currentPrice: p.currentPrice
        };
    });

    const predictions = getPredictionPortfolio().map(p => {
        const pred = getPredictionById(p.predictionId);
        return {
            id: p.predictionId,
            type: 'PREDICTION',
            title: pred?.question || 'Unknown Prediction',
            subtitle: `Value: $${p.amount.toFixed(2)}`,
            avatar: null, // Could use icon
            value: p.amount,
            raw: p,
            predictionId: p.predictionId
        };
    });

    const data: any[] = activeTab === 'Shares' ? shares : predictions;

    const handleSell = (item: any) => {
        if (activeTab === 'Shares') {
            setSelectedItem(item); // Open TradeSheet
        } else {
            // Mock instant sell for predictions for now, or could use same sheet
            LedgerStore.creditSettlement(item.value);
            showToast(`Sold position for $${item.value.toFixed(2)}`, 'success');
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <HeaderBack />
                    <Text style={styles.headerTitle}>Sell to Withdraw</Text>
                </View>

                <Tabs active={activeTab} onChange={setActiveTab} />

                {loading ? (
                    <Text style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>Loading...</Text>
                ) : (
                    <FlatList
                        data={data}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.row} onPress={() => handleSell(item)}>
                                <View style={styles.rowLeft}>
                                    {activeTab === 'Shares' ? (
                                        <Image source={item.avatar} style={styles.avatar} />
                                    ) : (
                                        <View style={styles.iconBox}><Text style={{ fontSize: 16 }}>🎲</Text></View>
                                    )}
                                    <View style={{ flex: 1, marginRight: 8 }}>
                                        <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
                                        <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
                                    </View>
                                </View>
                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>Sell</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <Text style={styles.empty}>No {activeTab.toLowerCase()} available to sell.</Text>
                        }
                    />
                )}

                {/* Reuse TradeSheet for Shares */}
                {selectedItem && activeTab === 'Shares' && (
                    <TradeSheet
                        visible={true}
                        mode={'SELL'}
                        artistName={selectedItem.title || ''}
                        ticker={selectedItem.symbol || ''}
                        sharePrice={selectedItem.currentPrice || 15}
                        mcs={85} // Mock or fetch
                        marketId={selectedItem.marketId}
                        onClose={() => setSelectedItem(null)}
                        onConfirm={(amount: number, _isShares: boolean) => {
                            // If mock mode, do manual credit, else reliance on Supabase is handled by TradeSheet
                            if (!USE_SUPABASE) {
                                const proceeds = amount; // It's passed as USD amount usually? Or TradeSheet handles execution?
                                // TradeSheet handles execution!
                                // We just need to refresh or show toast.
                            }
                            setSelectedItem(null);
                            showToast(`Sell Order Executed`, 'success');
                            // Ideally refresh portfolio here
                        }}
                    />
                )}

            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 12,
    },
    headerTitle: {
        fontFamily: FONT_FAMILY.header,
        fontWeight: '600',
        fontSize: 18,
        color: COLORS.text,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
        gap: 12,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
    },
    tabActive: {
        backgroundColor: '#FFF',
    },
    tabText: {
        color: '#888',
        fontFamily: FONT_FAMILY.header,
        fontSize: 14,
    },
    tabTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surface,
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    avatar: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#333'
    },
    iconBox: {
        width: 40, height: 40, borderRadius: 8, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center'
    },
    rowTitle: {
        color: '#FFF',
        fontFamily: FONT_FAMILY.medium,
        fontSize: 16,
    },
    rowSubtitle: {
        color: '#888',
        fontFamily: FONT_FAMILY.body,
        fontSize: 13,
    },
    btn: {
        backgroundColor: '#222', // Dark button
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    btnText: {
        color: COLORS.success, // Green text
        fontWeight: '600',
        fontSize: 14,
    },
    empty: {
        textAlign: 'center',
        color: '#666',
        marginTop: 40,
        fontFamily: FONT_FAMILY.body,
    }
});
