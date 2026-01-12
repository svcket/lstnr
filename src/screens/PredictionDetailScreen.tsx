import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { Share, MessageCircle, Lock, Monitor, ShieldCheck, Info } from 'lucide-react-native';
import { ArtistTabs, TabType } from '../components/artist/ArtistTabs';
import { ArtistComments } from '../components/artist/ArtistComments';
import { ArtistHolders } from '../components/artist/ArtistHolders';
import { ArtistActivity } from '../components/artist/ArtistActivity';
import { getPredictionDetail, PredictionDetail } from '../data/catalog';
import { FilterSheet } from '../components/common/FilterSheet';
import { LineChart } from '../components/LineChart';
import { getUserSharesInfo, MIN_SHARES_FOR_CHAT } from '../data/social';

const { width } = Dimensions.get('window');
const TIMEFRAMES = ['1M', '5M', '10M', '1H', '1D', 'ALL'];

export const PredictionDetailScreen = ({ route }: any) => {
    const { predictionId } = route.params || { predictionId: 'p1' };
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();

    const [detail, setDetail] = useState<PredictionDetail | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('Details');
    const [tradeSheetOpen, setTradeSheetOpen] = useState(false);
    
    // Chart State
    const [chartSeries, setChartSeries] = useState<number[]>([]);
    const [activeTimeframe, setActiveTimeframe] = useState('1D');
    const [scrubbedProb, setScrubbedProb] = useState<number | null>(null);

    // Chat Access
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const data = getPredictionDetail(predictionId);
        setDetail(data);
        if (data) {
            setChartSeries(data.chartData.map(d => d.yesProb));
        }

        const info = getUserSharesInfo(predictionId); 
        setHasAccess(info.hasAccess);
    }, [predictionId, activeTimeframe]);

    if (!detail) return <View style={styles.loading}><Text style={{color: '#FFF'}}>Loading...</Text></View>;

    const currentProb = detail.outcomes[0].probability;
    const displayProb = scrubbedProb !== null ? scrubbedProb : currentProb;

    // Data for Axis
    const minVal = chartSeries.length > 0 ? Math.min(...chartSeries) : 0;
    const maxVal = chartSeries.length > 0 ? Math.max(...chartSeries) : 100;
    
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                 <HeaderBack />
                 <Text style={styles.headerTitle}>Predictions</Text>
                 <TouchableOpacity>
                     <Share size={24} color={COLORS.white} />
                 </TouchableOpacity>
            </View>

            <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
                {/* 1. Hero Chart Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroHeader}>
                         <View style={styles.titleRow}>
                            <Text style={styles.question}>{detail.question}</Text>
                         </View>
                         
                         <View style={styles.probContainer}>
                             <Text style={styles.probValue}>{Math.round(displayProb)}%</Text>
                             <Text style={styles.probLabel}>Chance of Yes</Text>
                         </View>
                    </View>

                    {/* Chart with Y-Axis */}
                    <View style={styles.chartContainer}>
                        <View style={{ flexDirection: 'row' }}>
                             <View style={{ flex: 1 }}>
                                 <LineChart 
                                     data={chartSeries} 
                                     height={220} 
                                     width={width - 48} 
                                     color={detail.outcomes[0].color}
                                     onScrub={setScrubbedProb}
                                 />
                             </View>
                             
                             {/* Right Y-Axis */}
                             <View style={styles.yAxis}>
                                <Text style={[styles.axisLabel, scrubbedProb !== null ? { color: COLORS.white, fontWeight: '700' } : undefined]}>
                                   {Math.round(scrubbedProb !== null ? scrubbedProb : currentProb)}%
                                </Text>
                                <Text style={styles.axisLabel}>{Math.round((maxVal + minVal) / 2)}%</Text>
                                <Text style={styles.axisLabel}>{Math.round(minVal)}%</Text>
                             </View>
                        </View>
                    </View>

                    {/* Timeframe Pills */}
                    <View style={styles.timeframeRow}>
                       {TIMEFRAMES.map(tf => (
                          <TouchableOpacity 
                            key={tf} 
                            style={[styles.tfPill, activeTimeframe === tf && styles.tfPillActive]}
                            onPress={() => setActiveTimeframe(tf)}
                          >
                             <Text style={[styles.tfText, activeTimeframe === tf && styles.tfTextActive]}>{tf}</Text>
                          </TouchableOpacity>
                       ))}
                    </View>

                    {/* Make Prediction (Moved Above Tabs) */}
                    <View style={styles.predictionSection}>
                        <Text style={styles.sectionTitle}>Make your prediction</Text>
                        <View style={styles.outcomesList}>
                            {detail.outcomes.map((outcome, idx) => (
                                <OutcomeRow 
                                    key={outcome.id}
                                    outcome={outcome}
                                    volume={Math.floor(detail.volume * (outcome.probability / 100))}
                                    onPress={() => setTradeSheetOpen(true)}
                                    isFirst={idx === 0}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* 2. Tabs (Sticky) */}
                <ArtistTabs 
                    activeTab={activeTab} 
                    onTabPress={setActiveTab} 
                    tabs={['Details', 'Comments', 'Holders', 'Activity']}
                    mode="fixed" 
                    style={{ marginBottom: 16 }}
                />

                {/* 3. Tab Content */}
                <View style={styles.tabContent}>
                    {activeTab === 'Details' && (
                        <View>
                            {/* Group Chat Promo Card */}
                            <View style={styles.promoCard}>
                                <View style={styles.promoHeader}>
                                    <View style={styles.iconCircle}>
                                        <MessageCircle size={20} color={COLORS.primary} />
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.promoTitle}>Holders Chat</Text>
                                        <Text style={styles.promoSubtitle}>
                                            A private group for holders.
                                        </Text>
                                    </View>
                                </View>
                                
                                <View style={styles.promoFooter}>
                                     <Text style={styles.promoHelper}>
                                         {hasAccess 
                                           ? 'You have access to this group.' 
                                           : `Hold at least ${MIN_SHARES_FOR_CHAT} shares to join.`}
                                     </Text>
                                     <TouchableOpacity 
                                        style={[styles.promoBtn, !hasAccess && styles.promoBtnLocked]}
                                        onPress={() => {
                                            if (hasAccess) {
                                                navigation.navigate('HoldersChat', { entityId: predictionId });
                                            } else {
                                                setTradeSheetOpen(true);
                                            }
                                        }}
                                     >
                                         <Text style={[styles.promoBtnText, !hasAccess && styles.promoBtnTextLocked]}>
                                             {hasAccess ? 'Join Chat' : 'Buy to Join'}
                                         </Text>
                                         {!hasAccess && <Lock size={14} color="#000" style={{marginLeft: 6}} />}
                                     </TouchableOpacity>
                                </View>
                            </View>

                            {/* About */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>About</Text>
                                <Text style={styles.bodyText}>{detail.description}</Text>
                            </View>

                             {/* Timeline */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Timeline and payout</Text>
                                <TimelineItem label="Market Open" value={new Date(detail.marketOpenAt).toLocaleDateString()} isFirst />
                                <TimelineItem label="Market Closes" value={detail.marketCloseRule} />
                                <TimelineItem label="Payout Available" value={detail.payoutNote} isLast />
                            </View>
                            
                            <View style={{ height: 40 }} />
                        </View>
                    )}

                    {activeTab === 'Comments' && <ArtistComments entityId={predictionId} />}
                    
                    {activeTab === 'Holders' && <ArtistHolders entityId={predictionId} />}
                    
                    {activeTab === 'Activity' && <ArtistActivity artist={{ id: predictionId } as any} />}
                </View>
            </ScrollView>

            <FilterSheet 
                 visible={tradeSheetOpen} 
                 onClose={() => setTradeSheetOpen(false)} 
                 title="Trade Position" 
                 options={[{label: 'Buy Yes', value: 'yes'}, {label: 'Buy No', value: 'no'}]} 
                 selectedValues={[]} 
                 onSelect={() => setTradeSheetOpen(false)} 
             />
        </View>
    );
};

const OutcomeRow = ({ outcome, volume, onPress, isFirst }: any) => {
    return (
        <View style={styles.outcomeRow}>
             {/* Icon/Logo */}
             <View style={[styles.outcomeIcon, { backgroundColor: outcome.color }]}>
                 {/* Placeholder Icon */}
                 {isFirst ? <ShieldCheck size={20} color="#FFF" /> : <Monitor size={20} color="#FFF" />}
             </View>

             <View style={styles.outcomeInfo}>
                 <Text style={styles.outcomeName}>{outcome.name}</Text>
                 <Text style={styles.outcomeVol}>${volume.toLocaleString()} Vol</Text>
             </View>

             <TouchableOpacity style={styles.outcomeBtn} onPress={onPress}>
                 <Text style={styles.outcomeBtnText}>{outcome.probability}%</Text>
             </TouchableOpacity>
        </View>
    );
};

const TimelineItem = ({ label, value, isFirst, isLast }: any) => (
    <View style={styles.timelineItem}>
        <View style={styles.timelineLeft}>
            <View style={[styles.timelineDot, isFirst && { backgroundColor: COLORS.primary }]} />
            {!isLast && <View style={[styles.timelineLine, isFirst && { backgroundColor: COLORS.primary }]} />}
        </View>
        <View style={styles.timelineContent}>
            <Text style={styles.timelineLabel}>{label}</Text>
            <Text style={styles.timelineValue}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    loading: {
        flex: 1,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    headerTitle: {
        color: COLORS.white,
        fontFamily: FONT_FAMILY.header,
        fontWeight: '600', 
        fontSize: 16,
    },
    heroSection: {
        paddingBottom: 0,
    },
    heroHeader: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    titleRow: {
        marginBottom: 16,
    },
    question: {
        fontSize: 22,
        fontFamily: FONT_FAMILY.header,
        color: COLORS.white,
        lineHeight: 28,
        fontWeight: '600',
    },
    probContainer: {
    },
    probValue: {
        fontSize: 18,
        fontFamily: FONT_FAMILY.balance,
        color: COLORS.white,
        fontWeight: '700',
    },
    probLabel: {
        fontSize: 13,
        color: COLORS.textSecondary,
        fontWeight: '500', 
    },
    chartContainer: {
        height: 220,
        marginVertical: 16,
    },
    yAxis: {
        width: 48,
        justifyContent: 'space-between',
        paddingVertical: 10,
        alignItems: 'center',
    },
    axisLabel: {
        color: '#666',
        fontSize: 12,
        fontFamily: FONT_FAMILY.body,
    },
    timeframeRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 16,
        gap: 8,
    },
    tfPill: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent', // Default transparent
    },
    tfPillActive: {
        backgroundColor: '#181818',
    },
    tfText: {
        fontFamily: FONT_FAMILY.header,
        fontSize: 14,
        color: '#666',
    },
    tfTextActive: {
        color: '#FFF',
    },
    
    // Prediction Section (Hero)
    predictionSection: {
        marginTop: 24,
        paddingHorizontal: 16,
        marginBottom: 16,
    },

    // TAB CONTENT
    tabContent: {
        minHeight: 800, 
        paddingHorizontal: 16, 
        paddingTop: 0,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONT_FAMILY.header,
        color: '#FFF',
        marginBottom: 16,
    },
    bodyText: {
        fontSize: 15,
        color: '#CCC',
        lineHeight: 22,
    },
    
    // Outcome Rows
    outcomesList: {
        gap: 12,
    },
    outcomeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    outcomeIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    outcomeInfo: {
        flex: 1,
    },
    outcomeName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    outcomeVol: {
        color: '#666',
        fontSize: 12,
    },
    outcomeBtn: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 60,
        alignItems: 'center',
    },
    outcomeBtnText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 14,
    },

    // PROMO CARD
    promoCard: {
      backgroundColor: '#111',
      borderRadius: 16,
      padding: 16,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: '#222',
    },
    promoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.08)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    promoTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFF',
      fontFamily: FONT_FAMILY.header,
      marginBottom: 2,
    },
    promoSubtitle: {
      fontSize: 13,
      color: '#999',
    },
    promoFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    promoHelper: {
      fontSize: 12,
      color: '#666',
      flex: 1,
      marginRight: 12,
    },
    promoBtn: {
      backgroundColor: '#FFF',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    promoBtnLocked: {
      backgroundColor: COLORS.primary, // or brand color
    },
    promoBtnText: {
      color: '#000',
      fontSize: 13,
      fontWeight: '600',
    },
    promoBtnTextLocked: {
      color: '#000',
    },

    // TIMELINE
    timelineItem: {
        flexDirection: 'row',
        minHeight: 60,
    },
    timelineLeft: {
        width: 24,
        alignItems: 'center',
        marginRight: 16,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#333',
        borderWidth: 2,
        borderColor: '#000',
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#333',
        marginVertical: 4,
    },
    timelineContent: {
        flex: 1,
        paddingBottom: 24,
    },
    timelineLabel: {
        fontSize: 15,
        color: COLORS.white,
        marginBottom: 4,
        fontWeight: '600',
    },
    timelineValue: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
});
