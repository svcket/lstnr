import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { Search } from 'lucide-react-native';
import { HeaderBack } from '../components/common/HeaderBack';
import { TopAmountSummary } from '../components/common/TopAmountSummary';
import { getAllLabels, getPortfolio } from '../data/catalog';
import { FilterPill } from '../components/common/FilterPill';
import { FilterSheet } from '../components/common/FilterSheet';
import { 
    ARTIST_RANK_SORT, 
    TIME_FRAMES, 
    REGIONS,
    filterLabels
} from '../utils/filters';
import { getEntityMetrics } from '../lib/mockMetrics';
import { usePortfolioTotals } from '../hooks/usePortfolioTotals';
import { ICONS } from '../constants/assets';

export const LabelsScreen = () => {
    const navigation = useNavigation<any>();
    const [search, setSearch] = useState('');
    const { labelsValue } = usePortfolioTotals();
    const portfolio = getPortfolio();
    
    // Filter State
    const [rankSort, setRankSort] = useState('rank_asc');
    const [timeFrame, setTimeFrame] = useState('24h');
    const [region, setRegion] = useState('Global');
    
    // Sheet State
    const [activeSheet, setActiveSheet] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    // Data
    const labels = getAllLabels();

    const processedLabels = useMemo(() => {
        // 1. Filter
        const filtered = filterLabels(labels, { search, region });
        
        // 2. Sort
        return filtered.sort((a, b) => {
             const mA = getEntityMetrics(a.id);
             const mB = getEntityMetrics(b.id);

             switch(rankSort) {
                 case 'rank_asc': return (mB.marketCap || 0) - (mA.marketCap || 0); // Descending market cap
                 case 'price_asc': return (mA.price || 0) - (mB.price || 0);
                 case 'price_desc': return (mB.price || 0) - (mA.price || 0);
                 default: return 0;
             }
        });

    }, [labels, search, rankSort, region]);

    const renderItem = ({ item, index }: { item: typeof processedLabels[0], index: number }) => {
        const metrics = getEntityMetrics(item.id);
        const volume = timeFrame === '7d' ? metrics.volume24h * 7 : timeFrame === '30d' ? metrics.volume24h * 30 : metrics.volume24h;
        // Check if user owns any artist signed to this label OR if there's a specific label token logic (using artistId match for now as proxy or id check)
        // For simplicity, checking if we "own" the label by ID if it was in portfolio, OR if we strictly own shares of signed artists?
        // User request: "wallet icon to indicate labels i hold shares in". Assuming direct label shares or aggregated.
        // Let's assume direct label ID match in portfolio for now, adapting `getPortfolio` mock if needed, or strictly matching logic.
        // Actually, looking at portfolio mock, it has `artistId`. Let's assume labels can be "invested in" directly too or we check `signedArtists`.
        // Simplest interpretation: Check if we own ANY artist in `item.signedArtists`.
        const isOwned = portfolio.some(p => item.signedArtists.includes(p.artistId));
        
        return (
            <TouchableOpacity 
                style={styles.row} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('LabelDetail', { labelId: item.id })}
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
                    options: ARTIST_RANK_SORT, // Reuse options
                    selected: rankSort,
                    onSelect: (val: string) => setRankSort(val),
                    onReset: () => setRankSort('rank_asc'),
                    multi: false
                };
            case '24 h':
                return {
                    title: 'Timeframe',
                    options: TIME_FRAMES,
                    selected: timeFrame,
                    onSelect: (val: string) => setTimeFrame(val),
                    onReset: () => setTimeFrame('24h'),
                    multi: false
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
                {!isSearching ? (
                     <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <HeaderBack /> 
                            <Text style={styles.pageTitle}>Labels</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.searchButton}
                            onPress={() => setIsSearching(true)}
                            activeOpacity={0.7}
                        >
                            <Search size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.searchHeader}>
                        <View style={styles.searchInputContainer}>
                            <Search size={20} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
                            <TextInput 
                                style={styles.headerInput}
                                placeholder="Search labels..."
                                placeholderTextColor={COLORS.textSecondary}
                                value={search}
                                onChangeText={setSearch}
                                autoFocus
                            />
                        </View>
                        <TouchableOpacity onPress={() => {
                            setIsSearching(false);
                            setSearch('');
                        }}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Amount Summary */}
                <TopAmountSummary 
                    label="Your Shares" 
                    amount={labelsValue} 
                />

                {/* Filters */}
                <View style={{ marginBottom: 16 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
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
                            label="Region" 
                            value={region}
                            isActive={region !== 'Global'} 
                            onPress={() => setActiveSheet('Region')} 
                        />
                    </ScrollView>
                </View>

                {/* List */}
                <FlatList
                    data={processedLabels}
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
        paddingBottom: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    pageTitle: {
        fontSize: 20,
        fontFamily: FONT_FAMILY.balance,
        fontWeight: '700',
        color: '#FFF',
    },
    searchButton: {
        padding: 8,
    },
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
        gap: 12,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        height: 40,
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    headerInput: {
        flex: 1,
        fontFamily: FONT_FAMILY.body,
        fontSize: 16,
        color: '#FFF',
        height: '100%',
    },
    cancelText: {
        fontFamily: FONT_FAMILY.body,
        fontSize: 16,
        color: '#FFF',
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
