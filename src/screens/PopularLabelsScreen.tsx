import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { ChevronLeft } from 'lucide-react-native';
import { getAllLabels } from '../data/catalog';
import { getEntityMetrics } from '../lib/mockMetrics';

export const PopularLabelsScreen = () => {
    const navigation = useNavigation<any>();
    
    // Populate list
    const baseLabels = getAllLabels();
    const labels = [...baseLabels, ...baseLabels, ...baseLabels].map((l, i) => ({ ...l, id: `${l.id}_${i}` }));

    const data = useMemo(() => {
        return labels.map((label, index) => ({
            ...label,
            rank: index + 1,
            metrics: getEntityMetrics(label.id.split('_')[0]), 
        }));
    }, [labels]);

    const formatCompact = (num: number) => {
        return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
    };
    
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const renderItem = ({ item }: { item: typeof data[0] }) => {
        return (
            <TouchableOpacity 
                style={styles.row} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('LabelDetail', { labelId: item.id.split('_')[0] })}
            >
                {/* Rank */}
                <View style={styles.rankCol}>
                    {item.rank === 1 && <Text style={styles.medal}>🥇</Text>}
                    {item.rank === 2 && <Text style={styles.medal}>🥈</Text>}
                    {item.rank === 3 && <Text style={styles.medal}>🥉</Text>}
                    {item.rank > 3 && <Text style={styles.rankText}>{item.rank}</Text>}
                </View>

                {/* Avatar */}
                <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />

                {/* Name */}
                <View style={styles.infoCol}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.vol}>{item.symbol}</Text>
                </View>

                {/* Metrics */}
                <View style={styles.priceCol}>
                    <Text style={styles.price}>{formatCompact(item.metrics.marketCap)}</Text>
                    <Text style={[
                        styles.change, 
                        { color: item.metrics.changeTodayPct >= 0 ? COLORS.success : COLORS.error }
                    ]}>
                        {item.metrics.changeTodayPct > 0 ? '+' : ''}{item.metrics.changeTodayPct.toFixed(1)}%
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <ChevronLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Popular Labels</Text>
                </View>

                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
        gap: 8,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
    headerTitle: {
        fontSize: 20,
        fontFamily: FONT_FAMILY.medium,
        fontWeight: '600',
        color: '#FFF',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 40,
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
    },
    rankCol: { width: 32, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
    medal: { fontSize: 20 },
    rankText: { color: '#FFF', fontSize: 16, fontFamily: FONT_FAMILY.balance, fontWeight: '700' },
    avatar: { width: 48, height: 48, borderRadius: 10, backgroundColor: '#222', marginRight: 12 },
    infoCol: { flex: 1, justifyContent: 'center' },
    name: { color: '#FFF', fontSize: 16, fontFamily: FONT_FAMILY.balance, fontWeight: '700', marginBottom: 2 },
    vol: { color: '#888', fontSize: 12, fontFamily: FONT_FAMILY.body },
    priceCol: { alignItems: 'flex-end', justifyContent: 'center' },
    price: { color: '#FFF', fontSize: 16, fontFamily: FONT_FAMILY.balance, fontWeight: '700', marginBottom: 2 },
    change: { fontSize: 12, fontFamily: FONT_FAMILY.balance, fontWeight: '700' },
});
