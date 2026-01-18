import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { Search, ChevronDown } from 'lucide-react-native';
import { HeaderBack } from '../components/common/HeaderBack';
import { TopAmountSummary } from '../components/common/TopAmountSummary';
import { getAllArtists, getPortfolio } from '../data/catalog';
import { FilterPill } from '../components/common/FilterPill';
import { FilterSheet } from '../components/common/FilterSheet';
import { 
    ARTIST_RANK_SORT, 
    ARTIST_GENRES, 
    REGIONS, 
    TIME_FRAMES, 
    sortArtists, 
    filterArtists,
    FilterOption
} from '../utils/filters';
import { getEntityMetrics } from '../lib/mockMetrics';
import { ICONS } from '../constants/assets'; // Imported

import { usePortfolioTotals } from '../hooks/usePortfolioTotals';

export const ArtistsScreen = () => {
    const navigation = useNavigation<any>();
    const [search, setSearch] = useState('');
    const { artistsValue } = usePortfolioTotals();
    const portfolio = getPortfolio();
    
    // Filter State
    const [rankSort, setRankSort] = useState('rank_asc');
    const [timeFrame, setTimeFrame] = useState('24h');
    const [genres, setGenres] = useState<string[]>(['All']);
    const [region, setRegion] = useState('Global');
    
    // Sheet State
    const [activeSheet, setActiveSheet] = useState<string | null>(null);

    // Data
    const baseArtists = getAllArtists();
    // Deduping for stable list (logic from previous step was duplicating for length, let's keep it but make it stable)
    const artists = useMemo(() => [...baseArtists, ...baseArtists, ...baseArtists].map((a, i) => ({ ...a, id: `${a.id}_${i}` })), [baseArtists]);

    const processedArtists = useMemo(() => {
        // 1. Filter
        const filtered = filterArtists(artists, { genre: genres, region, search });
        // 2. Sort
        return sortArtists(filtered, rankSort);
    }, [artists, genres, region, search, rankSort]);

    const renderItem = ({ item, index }: { item: typeof processedArtists[0], index: number }) => {
        // Generate metrics based on timeframe... simply mocked for now based on '24h' field multiplier check
        // For standard "24h" display:
        // FIX: Verify item.metrics exists. If not, fetch it.
        const metrics = (item as any).metrics || getEntityMetrics(item.id.split('_')[0]); // Fallback safely
        const volume = timeFrame === '7d' ? metrics.volume24h * 7 : timeFrame === '30d' ? metrics.volume24h * 30 : metrics.volume24h;
        const isOwned = portfolio.some(p => p.artistId === item.id.split('_')[0]);
        
        return (
            <TouchableOpacity 
                style={styles.row} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ArtistDetail', { artistId: item.id })}
            >
                {/* Rank Column */}
                <View style={styles.rankCol}>
                    {index === 0 && <Text style={styles.medal}>🥇</Text>}
                    {index === 1 && <Text style={styles.medal}>🥈</Text>}
                    {index === 2 && <Text style={styles.medal}>🥉</Text>}
                    {index > 2 && <Text style={styles.rankText}>{index + 1}</Text>}
                </View>

                {/* Avatar */}
                <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />

                {/* Name & Vol */}
                <View style={styles.infoCol}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.name}>{item.name}</Text>
                        {isOwned && (
                            <Image 
                                source={ICONS.navWalletActive} 
                                style={{ width: 14, height: 14, tintColor: COLORS.textSecondary }} 
                                resizeMode="contain"
                            />
                        )}
                    </View>
                    <Text style={styles.vol}>${formatCompact(volume)} Vol.</Text>
                </View>

                {/* Price & Change */}
                <View style={styles.priceCol}>
                    <Text style={styles.price}>{formatCurrency(metrics.price)}</Text>
                    <Text style={[
                        styles.change, 
                        { color: metrics.changeTodayPct >= 0 ? COLORS.success : COLORS.error }
                    ]}>
                        {metrics.changeTodayPct > 0 ? '+' : ''}{metrics.changeTodayPct.toFixed(1)}%
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    // Sheet Config Logic
    const getSheetConfig = () => {
        switch (activeSheet) {
            case 'Rank':
                return {
                    title: 'Sort by',
                    options: ARTIST_RANK_SORT,
                    selected: rankSort,
                    onSelect: (val: string) => setRankSort(val),
                    onReset: () => setRankSort('rank_asc'),
                    multi: false
                };
            case '24 h': // Match the label
                return {
                    title: 'Timeframe',
                    options: TIME_FRAMES,
                    selected: timeFrame,
                    onSelect: (val: string) => setTimeFrame(val),
                    onReset: () => setTimeFrame('24h'),
                    multi: false
                };
            case 'Genres':
                return {
                    title: 'Genres',
                    options: ARTIST_GENRES,
                    selected: genres,
                    onSelect: (val: string) => {
                        if (val === 'All') {
                            setGenres(['All']);
                        } else {
                            // Toggle logic
                            let newGenres = genres.includes('All') ? [] : [...genres];
                            if (newGenres.includes(val)) {
                                newGenres = newGenres.filter(g => g !== val);
                            } else {
                                newGenres.push(val);
                            }
                            if (newGenres.length === 0) newGenres = ['All'];
                            setGenres(newGenres);
                        }
                    },
                    onReset: () => setGenres(['All']),
                    multi: true
                };
            case 'Region':
                return {
                    title: 'Region',
                    options: REGIONS,
                    selected: region,
                    onSelect: (val: string) => setRegion(val),
                    onReset: () => setRegion('Global'),
                    multi: false
                };
            default:
                return null;
        }
    };

    const sheetConfig = getSheetConfig();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <HeaderBack />
                    <Text style={styles.headerTitle}>Artists</Text>
                    <View style={{ width: 40 }} /> 
                </View>

                {/* Amount Summary */}
                <TopAmountSummary 
                    label="Your Shares" 
                    amount={artistsValue} 
                />

                {/* Search Bar */}
                <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                     <View style={styles.searchContainer}>
                        <Search size={20} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
                        <TextInput 
                          style={styles.searchInput}
                          placeholder="Artists, labels, URL"
                          placeholderTextColor={COLORS.textSecondary}
                          value={search}
                          onChangeText={setSearch}
                        />
                      </View>
                </View>

                {/* Filters */}
                <View style={{ marginBottom: 16 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
                        {/* Manual mapping to allow specific labels matching the screenshot/spec */}
                        <FilterPill 
                            label="Rank" 
                            isActive={rankSort !== 'rank_asc'} 
                            onPress={() => setActiveSheet('Rank')} 
                        />
                        <FilterPill 
                            label={timeFrame === '24h' ? '24 h' : timeFrame === '7d' ? '7 d' : '30 d'} 
                            isActive={timeFrame !== '24h'} 
                            onPress={() => setActiveSheet('24 h')} 
                        />
                        <FilterPill 
                            label="Genres" 
                            value={genres}
                            isActive={!genres.includes('All')} 
                            onPress={() => setActiveSheet('Genres')} 
                        />
                         <FilterPill 
                            label="Region" 
                            value={region}
                            isActive={region !== 'Global'} 
                            onPress={() => setActiveSheet('Region')} 
                        />
                    </ScrollView>
                </View>

                {/* List */}
                <FlatList
                    data={processedArtists}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>

            {/* Filter Sheet */}
            {sheetConfig && (
                <FilterSheet
                    visible={!!activeSheet}
                    onClose={() => setActiveSheet(null)}
                    title={sheetConfig.title}
                    options={sheetConfig.options}
                    selectedValues={sheetConfig.selected}
                    onSelect={sheetConfig.onSelect}
                    onReset={sheetConfig.onReset}
                    multiSelect={sheetConfig.multi}
                />
            )}
        </View>
    );
};

// ... Helpers ...
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
        paddingTop: 8, 
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
        fontWeight: '600', 
        color: '#FFF',
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        height: 52,
        borderRadius: 26,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    searchInput: {
        flex: 1,
        fontFamily: FONT_FAMILY.body,
        color: '#FFF',
        fontSize: 15,
        height: '100%',
    },
    filterPill: {
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
    filterText: {
        color: '#FFF',
        fontSize: 13,
        fontFamily: FONT_FAMILY.medium,
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
