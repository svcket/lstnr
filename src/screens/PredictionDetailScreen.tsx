import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { Share, MessageCircle, Lock, Monitor, ShieldCheck, Info, ChevronDown, ChevronUp } from 'lucide-react-native';
import { ArtistTabs, TabType } from '../components/artist/ArtistTabs';
import { ArtistComments } from '../components/artist/ArtistComments';
import { ArtistHolders } from '../components/artist/ArtistHolders';
import { ArtistActivity } from '../components/artist/ArtistActivity';
import { getPredictionDetail, PredictionDetail } from '../data/catalog';
import { FilterSheet } from '../components/common/FilterSheet';
import { UnifiedMarketChart, ChartSeries } from '../components/charts/UnifiedMarketChart';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { ShareSheet } from '../components/artist/ShareSheet';
import { getUserSharesInfo, MIN_SHARES_FOR_CHAT, getPredictionHolders } from '../data/social';

const { width } = Dimensions.get('window');
const TIMEFRAMES = ['1M', '5M', '10M', '1H', '1D', 'ALL'];

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const PredictionDetailScreen = ({ route }: any) => {
    const { predictionId } = route.params || { predictionId: 'p1' };
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();

    const [detail, setDetail] = useState<PredictionDetail | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('Details');
    const [tradeSheetOpen, setTradeSheetOpen] = useState(false);
    const [shareSheetVisible, setShareSheetVisible] = useState(false);
    const [prohibitionsOpen, setProhibitionsOpen] = useState(false);
    
    // Chart State
    const [viewSide, setViewSide] = useState<'yes' | 'no'>('yes');
    // Chart State
    const [chartSeries, setChartSeries] = useState<number[] | ChartSeries[]>([]);
    const [activeTimeframe, setActiveTimeframe] = useState('1D');
    const [scrubbedProb, setScrubbedProb] = useState<number | null>(null);
    const [showAllOutcomes, setShowAllOutcomes] = useState(false);

    // Chat Access
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const data = getPredictionDetail(predictionId);
        setDetail(data);
        if (data) {
            // Check type
            if (data.marketType === 'multi-range') {
                // Map outcomes to series
                // Safe cast as we know catalog hydrates this
                const outcomes: any[] = data.outcomes;
                const series: ChartSeries[] = outcomes.map(o => ({
                    data: data.chartData.map((d: any) => d[o.id] || o.probability),
                    color: o.color
                }));
                setChartSeries(series);
            } else {
                // Binary
                const yesData = data.chartData.map(d => d.yesProb || (d as any).yes);
                const noData = yesData.map(y => 100 - y);
                
                // Using slightly more vibrant colors (Tailwind -500 series)
                const yesSeries: ChartSeries = { data: yesData, color: '#22c55e', strokeWidth: 3, opacity: 1 };
                const noSeries: ChartSeries = { data: noData, color: '#ef4444', strokeWidth: 3, opacity: 1 };
                
                if (viewSide === 'yes') {
                    // YES is primary, NO is background
                    setChartSeries([
                        { ...yesSeries, isActive: true }, 
                        { ...noSeries, strokeWidth: 2, opacity: 0.5, isActive: false }
                    ]);
                } else {
                    // NO is primary, YES is background
                    setChartSeries([
                        { ...noSeries, isActive: true },
                        { ...yesSeries, strokeWidth: 2, opacity: 0.5, isActive: false }
                    ]);
                }
            }
        }

        const info = getUserSharesInfo(predictionId); 
        setHasAccess(info.hasAccess);
    }, [predictionId, activeTimeframe, viewSide]);

    if (!detail) return <View style={styles.loading}><Text style={{color: '#FFF'}}>Loading...</Text></View>;

    const currentProb = detail.outcomes[0].probability;
    // Adjust display probability logic for NO side
    const workingProb = viewSide === 'yes' ? currentProb : (100 - currentProb);
    const displayProb = scrubbedProb !== null ? scrubbedProb : workingProb;

    // Data for Axis
    // Calc min/max based on type
    let minVal = 0, maxVal = 100;
    if (Array.isArray(chartSeries) && chartSeries.length > 0) {
        if (typeof chartSeries[0] === 'number') {
            minVal = Math.min(...(chartSeries as number[]));
            maxVal = Math.max(...(chartSeries as number[]));
        } else {
             // Multi
             const all = (chartSeries as ChartSeries[]).flatMap(s => s.data);
             if (all.length > 0) {
                 minVal = Math.min(...all);
                 maxVal = Math.max(...all);
             }
        }
    }
    
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                 <HeaderBack />
                 <Text style={styles.headerTitle}>Predictions</Text>
                 <TouchableOpacity onPress={() => setShareSheetVisible(true)}>
                     <Share size={24} color={COLORS.white} />
                 </TouchableOpacity>
            </View>

            <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
                {/* 1. Hero Chart Section */}
                <View style={styles.heroSection}>
                     <ScreenContainer px={16}>
                        <View style={styles.heroHeader}>
                             <View style={styles.titleRow}>
                                <Text style={styles.question}>{detail.question}</Text>
                             </View>
                             
                             {/* Legend / Prob Display for Multi-Range */}
                             {detail.marketType === 'multi-range' && (
                                 <View style={styles.legendContainer}>
                                     {detail.outcomes.slice(0, 2).map((o: any) => (
                                         <View key={o.id} style={styles.legendItem}>
                                             <View style={[styles.legendDot, { backgroundColor: o.color }]} />
                                             <Text style={styles.legendText}>
                                                 {o.name} <Text style={{color: '#FFF'}}>{Math.round(o.probability)}%</Text>
                                             </Text>
                                         </View>
                                     ))}
                                     {detail.outcomes.length > 2 && (
                                         <Text style={styles.legendMore}>+{detail.outcomes.length - 2} more</Text>
                                     )}
                                 </View>
                             )}
                        </View>
                     
                        {/* Unified Chart */}
                        <UnifiedMarketChart 
                             mode={detail.marketType === 'multi-range' ? 'MULTI' : 'DUAL'}
                             series={chartSeries as ChartSeries[]} 
                             height={220} 
                             // ScreenContainer already subtracts 32px (16*2) from width if we weren't flexible
                             // But here we want the chart to be mostly full width inside the container?
                             // Actually user said "Consistent padding (16px)". 
                             // If ScreenContainer applies padding, width is available width.
                             width={width - 32} 
                             onScrub={(val) => setScrubbedProb(val)}
                             timeframes={TIMEFRAMES}
                             activeTimeframe={activeTimeframe}
                             onTimeframeChange={setActiveTimeframe}
                        />

                        {/* Make Prediction - Two Big Pills */}
                        <View style={styles.predictionSection}>
                            <Text style={styles.sectionTitle}>Make your prediction</Text>
                            
                            {detail.marketType === 'multi-range' ? (
                                <View style={styles.outcomesList}>
                                    {detail.outcomes.slice(0, showAllOutcomes ? undefined : 3).map((outcome, idx) => (
                                        <OutcomeRow 
                                            key={outcome.id}
                                            outcome={outcome as any}
                                            volume={Math.floor(detail.volume * ((outcome as any).probability / 100))}
                                            onPress={() => setTradeSheetOpen(true)}
                                            isFirst={idx === 0} 
                                            marketType={detail.marketType}
                                        />
                                    ))}
                                    {detail.outcomes.length > 3 && (
                                        <TouchableOpacity 
                                            style={styles.showMoreBtn}
                                            onPress={() => {
                                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                                setShowAllOutcomes(!showAllOutcomes);
                                            }}
                                        >
                                            <Text style={styles.showMoreText}>
                                                {showAllOutcomes ? 'Show Less' : `Show ${detail.outcomes.length - 3} More Outcomes`}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ) : (
                                <BinaryChoiceButtons 
                                    yesPercent={Math.round(detail.outcomes.find(o => o.id === 'yes')?.probability || 0)}
                                    noPercent={Math.round(detail.outcomes.find(o => o.id === 'no')?.probability || 0) || (100 - Math.round(detail.outcomes.find(o => o.id === 'yes')?.probability || 0))}
                                    yesLabel={detail.outcomes[0].name.toUpperCase() === 'YES' ? 'YES' : detail.outcomes[0].name.slice(0, 3).toUpperCase()} // SF/SEA logic
                                    noLabel={detail.outcomes[1].name.toUpperCase() === 'NO' ? 'NO' : detail.outcomes[1].name.slice(0, 3).toUpperCase()}
                                    onPickYes={() => { setViewSide('yes'); setTradeSheetOpen(true); }}
                                    onPickNo={() => { setViewSide('no'); setTradeSheetOpen(true); }}
                                />
                            )}
                        </View>
                    </ScreenContainer>
                </View>

                {/* 2. Tabs (Sticky) */}
                <ArtistTabs 
                    activeTab={activeTab} 
                    onTabPress={setActiveTab} 
                    tabs={['Details', 'Comments', 'Holders', 'Activity']}
                    mode="fixed" 
                    style={{ marginBottom: 0 }}
                />

                {/* 3. Tab Content */}
                <View style={[styles.tabContent, { minHeight: 800 }]}>
                    <ScreenContainer px={16}>
                        {activeTab === 'Details' && (
                            /* Stack Container with Gap */
                            <View style={styles.detailsStack}>
                                {/* 1. Chat Promo Card */}
                                <View style={styles.promoCard}>
                                    <View style={{flexDirection: 'column', gap: 4, flex: 1}}>
                                        <Text style={styles.promoTitleSimple}>Start a conversation!</Text>
                                        <Text style={styles.promoSubtitle}>Join {detail.volume > 10000 ? '1.2k' : '15'} others discussing this event</Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={styles.promoBtn}
                                        onPress={() => {
                                            if (hasAccess) {
                                                navigation.navigate('HoldersChat', { entityId: predictionId });
                                            } else {
                                                setTradeSheetOpen(true);
                                            }
                                        }}
                                    >
                                        <Text style={styles.promoBtnText}>
                                            {hasAccess ? 'Join Chat' : 'Buy to Join'}
                                        </Text>
                                        {!hasAccess && <Lock size={14} color="#000" style={{marginLeft: 6}} />}
                                    </TouchableOpacity>
                                </View>

                                {/* 2. About */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>About</Text>
                                    <Text style={styles.bodyText}>{detail.description}</Text>
                                </View>

                                {/* 3. Rules/Disclosures */}
                                <View style={styles.rulesRow}>
                                    <TouchableOpacity style={styles.rulePill}>
                                        <Text style={styles.ruleText}>View rules</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.rulePill}>
                                        <Text style={styles.ruleText}>View disclosures</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* 4. Timeline */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Timeline and payout</Text>
                                    <TimelineItem label="Market Open" value={new Date(detail.marketOpenAt).toLocaleDateString()} isFirst />
                                    <TimelineItem label="Market Closes" value={detail.marketCloseRule} />
                                    <TimelineItem label="Payout Available" value={detail.payoutNote} isLast />
                                </View>

                                {/* 5. Trading Prohibitions */}
                                <View style={styles.section}>
                                    <TouchableOpacity 
                                        style={styles.accordionHeader}
                                        onPress={() => {
                                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                            setProhibitionsOpen(!prohibitionsOpen);
                                        }}
                                    >
                                        <Text style={styles.sectionTitle}>Trading Prohibitions</Text>
                                        {prohibitionsOpen ? <ChevronUp size={20} color="#FFF" /> : <ChevronDown size={20} color="#FFF" />}
                                    </TouchableOpacity>
                                    {prohibitionsOpen && (
                                        <View style={styles.accordionContent}>
                                            <Text style={styles.bodyText}>
                                                The following are prohibited from trading this contract: Current and former players, coaches, and staff of the league, association, or organization(s) governing the event.
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                
                                <View style={{ height: 40 }} />
                            </View>
                        )}

                        {activeTab === 'Comments' && <ArtistComments entityId={predictionId} />}
                        
                        {activeTab === 'Holders' && <PredictionHolders entityId={predictionId} />}
                        
                        {activeTab === 'Activity' && <ArtistActivity artist={{ id: predictionId } as any} />}
                    </ScreenContainer>
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

            <ShareSheet
                visible={shareSheetVisible}
                onClose={() => setShareSheetVisible(false)}
                artistName={detail.question}
            />
        </View>
    );
};

const BinaryChoiceButtons = ({ yesPercent, noPercent, yesLabel = 'YES', noLabel = 'NO', onPickYes, onPickNo }: any) => {
    return (
        <View style={styles.binaryChoiceContainer}>
            <TouchableOpacity 
                style={[styles.binaryChoiceBtn, styles.btnYes]} 
                onPress={onPickYes}
                activeOpacity={0.8}
            >
                <View style={styles.binaryBtnContent}>
                    <Text style={styles.binaryLabel}>{yesLabel}</Text>
                    <Text style={styles.binaryPercent}>{yesPercent}%</Text>
                </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.binaryChoiceBtn, styles.btnNo]} 
                onPress={onPickNo}
                activeOpacity={0.8}
            >
                <View style={styles.binaryBtnContent}>
                    <Text style={styles.binaryLabel}>{noLabel}</Text>
                    <Text style={styles.binaryPercent}>{noPercent}%</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const OutcomeRow = ({ outcome, volume, onPress, isFirst, marketType }: any) => {
    return (
        <View style={styles.outcomeRow}>
             {/* Icon/Logo */}
             <View style={[styles.outcomeIcon, { backgroundColor: outcome.color }]}>
                 {marketType === 'multi-range' ? (
                      <Text style={{color: '#FFF', fontWeight: 'bold'}}>{outcome.name.charAt(0)}</Text>
                 ) : (
                      isFirst ? <ShieldCheck size={20} color="#FFF" /> : <Monitor size={20} color="#FFF" />
                 )}
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

const PredictionHolders = ({ entityId }: { entityId: string }) => {
    const { yes, no } = getPredictionHolders(entityId);
    
    return (
        <View style={styles.holdersContainer}>
            {/* YES Column */}
            <View style={styles.holderColumn}>
                <Text style={styles.holderHeader}>Yes holders</Text>
                {yes.map(holder => (
                    <View key={holder.id} style={styles.holderRow}>
                        <Image source={{ uri: holder.avatar }} style={styles.holderAvatar} />
                        <View>
                            <Text style={styles.holderName}>{holder.name}</Text>
                            <Text style={[styles.holderShares, { color: '#4ADE80' }]}>{holder.shares} shares</Text>
                        </View>
                    </View>
                ))}
            </View>

             {/* NO Column */}
             <View style={styles.holderColumn}>
                <Text style={styles.holderHeader}>No holders</Text>
                {no.map(holder => (
                    <View key={holder.id} style={styles.holderRow}>
                        <Image source={{ uri: holder.avatar }} style={styles.holderAvatar} />
                         <View>
                            <Text style={styles.holderName}>{holder.name}</Text>
                            <Text style={[styles.holderShares, { color: '#F87171' }]}>{holder.shares} shares</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

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
    chartToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 24,
    },
    chartToggleItem: {
        alignItems: 'flex-start',
        paddingVertical: 4,
        opacity: 0.8,
    },
    chartToggleItemActive: {
        opacity: 1,
    },
    chartToggleDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#333',
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
        marginTop: 16,
        marginBottom: 16,
    },

    // TAB CONTENT
    tabContent: {
        paddingTop: 16,
        backgroundColor: COLORS.black,
    },
    detailsStack: {
        gap: 16,
    },
    
    // BINARY BUTTONS (Two Big Pills)
    binaryChoiceContainer: {
        flexDirection: 'row',
        gap: 12, // Space between buttons
    },
    binaryChoiceBtn: {
        flex: 1,
        height: 64, // Big touch target
        borderRadius: 20, 
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    btnYes: {
        backgroundColor: '#1b4d3e', // Deep Green
        borderWidth: 1,
        borderColor: '#22c55e', // Bright border
    },
    btnNo: {
        backgroundColor: '#451a1a', // Deep Red
        borderWidth: 1,
        borderColor: '#ef4444', // Bright border
    },
    binaryBtnContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    binaryLabel: {
        fontSize: 18,
        fontWeight: '800', // Extra bold
        color: '#FFF',
        fontFamily: FONT_FAMILY.balance,
        letterSpacing: 0.5,
    },
    binaryPercent: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        fontFamily: FONT_FAMILY.balance,
    },

    // Outcome Rows
    outcomesList: {
        gap: 12,
    },
    outcomeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
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

    // SECTIONS
    section: {
        marginBottom: 0,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONT_FAMILY.header,
        color: '#FFF',
        marginBottom: 16,
        fontWeight: '700',
    },
    bodyText: {
        fontSize: 15,
        color: '#CCC',
        fontFamily: FONT_FAMILY.body, // Ensure this exists or use default
        lineHeight: 24,
    },
    
    // ... (Keep existing rules/accordion styles)
    
    // RULES PILLS
    rulesRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    rulePill: {
        backgroundColor: '#181818',
        paddingHorizontal: 16,
        paddingVertical: 10, 
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    ruleText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: FONT_FAMILY.header,
    },

    // ACCORDION
    accordionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    accordionContent: {
        marginTop: 16, 
    },

    // PROMO CARD
    promoCard: {
      backgroundColor: '#111',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: '#222',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    promoTitleSimple: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        fontFamily: FONT_FAMILY.header,
    },
    promoSubtitle: {
        fontSize: 13,
        color: '#999',
        fontFamily: FONT_FAMILY.body,
    },
    promoBtn: {
      backgroundColor: '#FFF',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: 90,
      justifyContent: 'center',
    },
    promoBtnText: {
      color: '#000',
      fontSize: 14,
      fontWeight: '700',
    },

    // HOLDERS SPLIT
    holdersContainer: {
        flexDirection: 'row',
        gap: 24,
    },
    // ... rest of holders logic

    holderColumn: {
        flex: 1,
    },
    holderHeader: {
        fontSize: 16,
        fontFamily: FONT_FAMILY.header,
        color: '#FFF',
        marginBottom: 16,
        fontWeight: '700',
    },
    holderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    holderAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
        backgroundColor: '#333',
    },
    holderName: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: FONT_FAMILY.header,
        fontWeight: '600',
        marginBottom: 2,
    },
    holderShares: {
        fontSize: 12,
        fontWeight: '500',
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
    
    // LEGEND
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        color: '#999',
        fontSize: 14,
        fontFamily: FONT_FAMILY.body,
    },
    legendMore: {
        color: '#666',
        fontSize: 12,
    },
    
    // SHOW MORE
    showMoreBtn: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    showMoreText: {
        color: '#666',
        fontSize: 13,
        fontWeight: '600',
    },


});
