import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONT_FAMILY, SPACING } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { getPredictionById, Prediction, getArtistById } from '../data/catalog';
import { LineChart } from '../components/LineChart';
import { BuySellBar } from '../components/artist/BuySellBar';
import { Info, Share, Copy, Clock, Users, ArrowUpRight, MessageCircle } from 'lucide-react-native';
import { formatCompact } from '../data/catalog';
import { mockSeries } from '../lib/mockMetrics';
import { ArtistComments } from '../components/artist/ArtistComments';

const { width } = Dimensions.get('window');

// Mock chart data generator adapted for probability (0-100)
const getProbSeries = (seed: number) => {
    // Generate a series that stays between 0-100
    const points = [];
    let val = 50;
    for (let i = 0; i < 40; i++) {
        const change = (Math.random() - 0.5) * 10;
        val = Math.max(1, Math.min(99, val + change));
        points.push(val);
    }
    return points;
};

export const PredictionDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { predictionId } = route.params || {};
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [chartSeries, setChartSeries] = useState<number[]>([]);
    const [scrubbedVal, setScrubbedVal] = useState<number | null>(null);
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<'Comments' | 'Activity'>('Comments');

    useEffect(() => {
        if (predictionId) {
            const p = getPredictionById(predictionId);
            if (p) {
                setPrediction(p);
                setChartSeries(getProbSeries(predictionId.length));
            }
        }
    }, [predictionId]);

    if (!prediction) return <View style={styles.loading}><Text style={{color: '#FFF'}}>Loading...</Text></View>;

    const currentValue = scrubbedVal ?? (chartSeries[chartSeries.length - 1] || 50);
    const isMulti = prediction.marketType === 'multi-range';

    return (
        <KeyboardAvoidingView 
           style={{flex: 1, backgroundColor: COLORS.background}} 
           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
           keyboardVerticalOffset={0}
        >
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <HeaderBack />
                <View style={styles.headerActions}>
                    <TouchableOpacity><Share size={24} color="#FFF" /></TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    {prediction.relatedEntityId && (
                        <EntityBadge entityId={prediction.relatedEntityId} navigation={navigation} />
                    )}
                    <Text style={styles.question}>{prediction.question}</Text>
                    
                    <View style={styles.metaRow}>
                        <Clock size={14} color="#666" />
                        <Text style={styles.metaText}>Resolves {new Date(prediction.deadline).toLocaleDateString()}</Text>
                        <View style={styles.metaDivider} />
                        <Users size={14} color="#666" />
                        <Text style={styles.metaText}>$ {formatCompact(prediction.volume)} Vol.</Text>
                    </View>
                </View>

                {/* Main Outcome Display / Chart Header */}
                <View style={styles.chartHeader}>
                   <View>
                       <Text style={styles.probValue}>{currentValue.toFixed(1)}%</Text>
                       <Text style={styles.probLabel}>Probability</Text>
                   </View>
                </View>

                {/* Chart */}
                <View style={styles.chartContainer}>
                    <LineChart 
                        data={chartSeries}
                        width={width}
                        height={160}
                        color={currentValue > 50 ? COLORS.success : '#F5A623'}
                        onScrub={setScrubbedVal}
                    />
                </View>

                {/* Outcomes List (Multi) or Yes/No Stats (Binary) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Outcomes</Text>
                    <View style={styles.outcomesCard}>
                        {prediction.marketType === 'multi-range' ? (
                            prediction.outcomes.map((outcome, idx) => (
                                <View key={outcome.id}>
                                    <View style={styles.outcomeRow}>
                                        <Text style={styles.outcomeName}>{outcome.name}</Text>
                                        <View style={{alignItems: 'flex-end'}}>
                                            <Text style={styles.outcomePercent}>{outcome.chance}%</Text>
                                            <Text style={styles.outcomePrice}>{outcome.price}¢</Text>
                                        </View>
                                    </View>
                                    {idx < prediction.outcomes.length - 1 && <View style={styles.divider} />}
                                </View>
                            ))
                        ) : (
                            // Binary View
                            <View>
                                <View style={styles.outcomeRow}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                                        <View style={[styles.dot, {backgroundColor: COLORS.success}]} />
                                        <Text style={styles.outcomeName}>Yes</Text>
                                    </View>
                                    <View style={{alignItems: 'flex-end'}}>
                                        <Text style={[styles.outcomePercent, {color: COLORS.success}]}>{prediction.chance}%</Text>
                                        {/* Mock price from probability */}
                                        <Text style={styles.outcomePrice}>{(prediction.chance / 100).toFixed(2)}¢</Text>
                                    </View>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.outcomeRow}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                                        <View style={[styles.dot, {backgroundColor: COLORS.error}]} />
                                        <Text style={styles.outcomeName}>No</Text>
                                    </View>
                                    <View style={{alignItems: 'flex-end'}}>
                                        <Text style={[styles.outcomePercent, {color: COLORS.error}]}>{100 - prediction.chance}%</Text>
                                        <Text style={styles.outcomePrice}>{((100 - prediction.chance) / 100).toFixed(2)}¢</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* Tabs for content */}
                <View style={styles.tabsRow}>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'Comments' && styles.activeTab]}
                        onPress={() => setActiveTab('Comments')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Comments' && styles.activeTabText]}>Comments</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'Activity' && styles.activeTab]}
                        onPress={() => setActiveTab('Activity')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Activity' && styles.activeTabText]}>Activity</Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                <View style={styles.tabContent}>
                    {activeTab === 'Comments' ? (
                        <ArtistComments />
                    ) : (
                        <View style={{padding: 32, alignItems: 'center'}}>
                            <Text style={{color: '#666', fontFamily: FONT_FAMILY.body}}>Recent trading activity...</Text>
                        </View>
                    )}
                </View>

            </ScrollView>

            {/* Sticky Buy/Sell Action */}
            <BuySellBar 
                onBuy={() => console.log('Buy')}
                onSell={() => console.log('Sell')}
                price={prediction.marketType === 'binary' ? `$${(prediction.chance / 100).toFixed(2)}` : undefined}
            />
        </View>
        </KeyboardAvoidingView>
    );
};

const EntityBadge = ({ entityId, navigation }: { entityId: string, navigation: any }) => {
    // Try finding in Artists first, then Labels (simplified mock lookup)
    const artist = getArtistById(entityId); 
    // const label = getLabelById(entityId); // If needed

    if (!artist) return null;

    return (
        <TouchableOpacity 
            style={styles.entityBadge}
            onPress={() => navigation.push('ArtistDetail', { artistId: artist.id })}
        >
            <Image source={{ uri: artist.avatarUrl }} style={styles.badgeAvatar} />
            <Text style={styles.badgeName}>{artist.name}</Text>
            <ArrowUpRight size={12} color="#999" />
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loading: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 16,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    titleSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    question: {
        fontFamily: FONT_FAMILY.medium,
        fontSize: 22,
        color: '#FFF',
        marginBottom: 12,
        lineHeight: 30,
    },
    entityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#181818',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginBottom: 12,
        gap: 6,
    },
    badgeAvatar: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    badgeName: {
        fontFamily: FONT_FAMILY.medium,
        fontSize: 13,
        color: '#FFF',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaText: {
        fontFamily: FONT_FAMILY.body,
        fontSize: 13,
        color: '#999',
    },
    metaDivider: {
        width: 1,
        height: 12,
        backgroundColor: '#333',
    },
    
    // Chart
    chartHeader: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    probValue: {
        fontFamily: FONT_FAMILY.balance,
        fontSize: 32,
        fontWeight: '700',
        color: '#FFF',
    },
    probLabel: {
        fontFamily: FONT_FAMILY.body,
        fontSize: 13,
        color: '#666',
    },
    chartContainer: {
        marginBottom: 32,
    },

    // Outcomes
    section: {
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    sectionTitle: {
        fontFamily: FONT_FAMILY.medium,
        fontSize: 18,
        color: '#FFF',
        marginBottom: 16,
    },
    outcomesCard: {
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#222',
    },
    outcomeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    outcomeName: {
        fontFamily: FONT_FAMILY.medium,
        fontSize: 16,
        color: '#FFF',
    },
    outcomePercent: {
        fontFamily: FONT_FAMILY.balance,
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
    outcomePrice: {
        fontFamily: FONT_FAMILY.body,
        fontSize: 12,
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#222',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    // Tabs
    tabsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
        gap: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    tab: {
        paddingBottom: 16,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#FFF',
    },
    tabText: {
        fontFamily: FONT_FAMILY.medium,
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        color: '#FFF',
    },
    tabContent: {
        minHeight: 300,
    },
});
