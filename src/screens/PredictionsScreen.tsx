import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { Search, ChevronDown } from 'lucide-react-native';
import { HeaderBack } from '../components/common/HeaderBack';
import { TopSummaryBlock } from '../components/common/TopSummaryBlock';
import { usePortfolioTotals } from '../hooks/usePortfolioTotals';
import { getAllPredictions } from '../data/catalog';
import { PredictionCard } from '../components/artist/PredictionCard';
import { FilterPill } from '../components/common/FilterPill';
import { FilterSheet } from '../components/common/FilterSheet';
import { 
    PRED_OUTCOMES, 
    TIME_FRAMES, 
    PRED_END_DATES, 
    REGIONS, 
    filterPredictions 
} from '../utils/filters';

export const PredictionsScreen = () => {
    const navigation = useNavigation<any>();
    const [search, setSearch] = useState('');
    const { predictionsValue } = usePortfolioTotals(); // Hook usage
    
    // Filters
    const [outcome, setOutcome] = useState('All');
    const [timeFrame, setTimeFrame] = useState('24h'); // For volume display? Or just sorting
    const [endDate, setEndDate] = useState('Anytime');
    const [region, setRegion] = useState('Global');

    const [activeSheet, setActiveSheet] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    // Populate list
    const basePreds = getAllPredictions();
    const predictions = [...basePreds, ...basePreds].map((p, i) => ({ ...p, id: `${p.id}_${i}` }));

    const filteredPredictions = useMemo(() => {
        return filterPredictions(predictions, {
            search,
            outcome,
            date: endDate,
            region
        });
    }, [predictions, search, outcome, endDate, region]);

    const renderItem = ({ item }: { item: typeof predictions[0] }) => {
        // Restore original ID for navigation/logic (strip _index suffix)
        const originalId = item.id.split('_')[0];
        const realPrediction = { ...item, id: originalId };
        return <PredictionCard prediction={realPrediction as any} />;
    };

    const getSheetConfig = () => {
        switch (activeSheet) {
            case 'Outcome':
                return {
                    title: 'Market Type',
                    options: PRED_OUTCOMES,
                    selected: outcome,
                    onSelect: setOutcome,
                    onReset: () => setOutcome('All')
                };
            case '24 h':
                return {
                    title: 'Timeframe',
                    options: TIME_FRAMES,
                    selected: timeFrame,
                    onSelect: setTimeFrame,
                    onReset: () => setTimeFrame('24h')
                };
            case 'End date':
                return {
                    title: 'Ends In',
                    options: PRED_END_DATES,
                    selected: endDate,
                    onSelect: setEndDate,
                    onReset: () => setEndDate('Anytime')
                };
            case 'Region':
                return {
                    title: 'Region',
                    options: REGIONS,
                    selected: region,
                    onSelect: setRegion,
                    onReset: () => setRegion('Global')
                };
            default: return null;
        }
    }
    const sheetConfig = getSheetConfig();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                {!isSearching ? (
                     <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <HeaderBack /> 
                            <Text style={styles.pageTitle}>Predictions</Text>
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
                                placeholder="Search predictions..."
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
                <TopSummaryBlock 
                    label="Open Positions" 
                    value={predictionsValue} 
                />



                {/* Filters */}
                <View style={{ marginBottom: 16 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
                        <FilterPill label="Outcome" value={outcome} isActive={outcome !== 'All'} onPress={() => setActiveSheet('Outcome')} />
                        <FilterPill label={timeFrame === '24h' ? '24 h' : timeFrame === '7d' ? '7 d' : '30 d'} isActive={timeFrame !== '24h'} onPress={() => setActiveSheet('24 h')} />
                        <FilterPill label="End date" value={endDate} isActive={endDate !== 'Anytime'} onPress={() => setActiveSheet('End date')} />
                        <FilterPill label="Region" value={region} isActive={region !== 'Global'} onPress={() => setActiveSheet('Region')} />
                    </ScrollView>
                </View>

                <FlatList
                    data={filteredPredictions}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>

            {sheetConfig && (
                <FilterSheet
                    visible={!!activeSheet}
                    onClose={() => setActiveSheet(null)}
                    title={sheetConfig.title}
                    options={sheetConfig.options}
                    selectedValues={sheetConfig.selected}
                    onSelect={sheetConfig.onSelect}
                    onReset={sheetConfig.onReset}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    safeArea: { flex: 1 },
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
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
    headerTitle: {
        fontSize: 18,
        fontFamily: FONT_FAMILY.medium,
        fontWeight: '600',
        color: '#FFF',
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
});
