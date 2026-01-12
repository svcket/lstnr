import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { ChevronLeft } from 'lucide-react-native';
import { getAllArtists } from '../data/catalog';
import { getEntityMetrics } from '../lib/mockMetrics';

export const TrendingArtistsScreen = () => {
    const navigation = useNavigation();
    // Populate list to ensure we have > 5 items
    const baseArtists = getAllArtists();
    const artists = [...baseArtists, ...baseArtists, ...baseArtists].map((a, i) => ({ ...a, id: `${a.id}_${i}` }));

    // Sort by some metric if needed, for now just use the list order
    // In a real app we'd sort by volume or change
    const sortedArtists = useMemo(() => {
        return artists.map((artist, index) => ({
            ...artist,
            rank: index + 1,
            metrics: getEntityMetrics(artist.id.split('_')[0]), // Use original ID for metrics
        }));
    }, [artists]);

    const renderItem = ({ item }: { item: typeof sortedArtists[0] }) => {
        return (
            <TouchableOpacity 
                style={styles.row} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ArtistDetail', { artistId: item.id } as never)}
            >
                {/* Rank Column */}
                <View style={styles.rankCol}>
                    {item.rank === 1 && (
                        <Text style={styles.medal}>🥇</Text>
                    )}
                    {item.rank === 2 && (
                        <Text style={styles.medal}>🥈</Text>
                    )}
                    {item.rank === 3 && (
                        <Text style={styles.medal}>🥉</Text>
                    )}
                    {item.rank > 3 && (
                        <Text style={styles.rankText}>{item.rank}</Text>
                    )}
                </View>

                {/* Avatar */}
                <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />

                {/* Name & Vol */}
                <View style={styles.infoCol}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.vol}>${formatCompact(item.metrics.volume24h)} Vol.</Text>
                </View>

                {/* Price & Change */}
                <View style={styles.priceCol}>
                    <Text style={styles.price}>{formatCurrency(item.metrics.price)}</Text>
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
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backBtn} 
                        onPress={() => navigation.goBack()}
                    >
                        <ChevronLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Trending Artists</Text>
                    <View style={styles.backBtn} /> 
                </View>

                {/* List */}
                <FlatList
                    data={sortedArtists}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </View>
    );
};

// Helpers
const formatCompact = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
};

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8, // Added little top padding for balance
        paddingBottom: 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: FONT_FAMILY.medium,
        fontWeight: '600', // Semibold
        color: '#FFF',
        textAlign: 'center',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 0, // Zero top padding, relies on Header bottom padding
        paddingBottom: 40,
        gap: 16, // Explicit 16px gap
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        // Removed vertical padding to strictly follow gap spacing, or minimize it
        // paddingVertical: 12 -> 0?
        height: 56, // Fixed height for consistency
    },
    rankCol: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    medal: {
        fontSize: 20,
    },
    rankText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: FONT_FAMILY.balance,
        fontWeight: '700',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: '#222',
        marginRight: 12,
    },
    infoCol: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: FONT_FAMILY.balance,
        fontWeight: '700',
        marginBottom: 2,
    },
    vol: {
        color: '#888',
        fontSize: 12,
        fontFamily: FONT_FAMILY.body,
    },
    priceCol: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    price: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: FONT_FAMILY.balance,
        fontWeight: '700',
        marginBottom: 2,
    },
    change: {
        fontSize: 12,
        fontFamily: FONT_FAMILY.balance,
        fontWeight: '700',
    },
});
