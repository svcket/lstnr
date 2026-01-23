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
import { getPredictionDetail, PredictionDetail, getAllPredictions, getArtistById, formatCompact } from '../data/catalog';
import { FilterSheet } from '../components/common/FilterSheet';
import { UnifiedMarketChart } from '../components/charts/UnifiedMarketChart';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { ShareSheet } from '../components/artist/ShareSheet';
import { InfoSheet } from '../components/common/InfoSheet';
import { TradeSheet } from '../components/artist/TradeSheet';
import { getUserSharesInfo, MIN_SHARES_FOR_CHAT, getPredictionHolders } from '../data/social';
import { useToast } from '../context/ToastContext';

const { width } = Dimensions.get('window');
const TIMEFRAMES = ['1m', '5m', '10m', '15m', '30m', 'All'];

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const PredictionDetailScreen = ({ route }: any) => {
    const { predictionId, initialTab } = route.params || { predictionId: 'p1' };
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { showToast } = useToast();

    const [detail, setDetail] = useState<PredictionDetail | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('Details');

    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    const [tradeSheetOpen, setTradeSheetOpen] = useState(false);
    const [shareSheetVisible, setShareSheetVisible] = useState(false);
    const [prohibitionsOpen, setProhibitionsOpen] = useState(false);
    const [infoSheetType, setInfoSheetType] = useState<'rules' | 'disclosures' | null>(null);
    
    const CHART_WIDTH = Dimensions.get('window').width - 90;

    // Multi-Range Selection
    const [selectedOutcome, setSelectedOutcome] = useState<any>(null);

    // Chart State
    const [viewSide, setViewSide] = useState<'yes' | 'no'>('yes');
    const [chartSeries, setChartSeries] = useState<any[]>([]);
    const [activeTimeframe, setActiveTimeframe] = useState('15m');
    const [scrubbedProb, setScrubbedProb] = useState<number | null>(null);
    const [showAllOutcomes, setShowAllOutcomes] = useState(false);
    
    // Info Sheet State
    const [infoSheetData, setInfoSheetData] = useState<{title: string, content: string} | null>(null);
    const [scrubbedValues, setScrubbedValues] = useState<Record<string, number> | null>(null);

    // Chat Access
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const data = getPredictionDetail(predictionId);
        setDetail(data);
        if (data) {
            if (data.marketType === 'multi-range') {
                const outcomes: any[] = data.outcomes;
                const series = outcomes.slice(0, 5).map(o => ({
                    data: data.chartData.map((d: any) => d[o.id] || o.probability),
                    color: o.color,
                    name: o.name
                }));
                setChartSeries(series);
            } else {
                const yesData = data.chartData.map(d => d.yesProb || (d as any).yes);
                const noData = yesData.map(y => 100 - y);
                
                const yesSeries = { data: yesData, color: '#22c55e', strokeWidth: 3, opacity: 1, name: 'YES' };
                const noSeries = { data: noData, color: '#ef4444', strokeWidth: 3, opacity: 1, name: 'NO' };
                
                if (viewSide === 'yes') {
                    setChartSeries([
                        { ...yesSeries, isActive: true }, 
                        { ...noSeries, strokeWidth: 3, opacity: 0.5, isActive: false }
                    ]);
                } else {
                    setChartSeries([
                        { ...noSeries, isActive: true },
                        { ...yesSeries, strokeWidth: 3, opacity: 0.5, isActive: false }
                    ]);
                }
            }
        }
        const info = getUserSharesInfo(predictionId); 
        setHasAccess(info.hasAccess);
    }, [predictionId, activeTimeframe, viewSide]);

    if (!detail) return <View style={styles.loading}><Text style={{color: '#FFF'}}>Loading...</Text></View>;

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <HeaderBack />
                    <Text style={styles.headerTitle}>Predictions</Text>
                 </View>
                 <TouchableOpacity onPress={() => setShareSheetVisible(true)}>
                     <Share size={24} color={COLORS.white} />
                 </TouchableOpacity>
            </View>

            <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
                <View style={styles.heroSection}>
                     <ScreenContainer px={16}>
                        <View style={styles.heroHeader}>
                             <View style={styles.titleRow}>
                                <Text style={styles.question}>{detail.question}</Text>
                             </View>
                             
                             {detail.marketType === 'multi-range' && (
                                 <View style={styles.legendContainer}>
                                     {detail.outcomes.map((o: any) => (
                                         <View key={o.id} style={styles.legendItem}>
                                             <View style={[styles.legendDot, { backgroundColor: o.color }]} />
                                             <Text style={styles.legendText}>
                                                 {o.name} <Text style={{color: '#FFF'}}>{Math.round(o.probability)}%</Text>
                                             </Text>
                                         </View>
                                     ))}
                                 </View>
                             )}
                        </View>
                     
                        {detail.marketType === 'multi-range' ? (
                            <View style={{ marginLeft: -16, width: width, marginBottom: 24 }}>
                                <UnifiedMarketChart 
                                    series={chartSeries}
                                    mode="MULTI"
                                    width={width} // Full Bleed
                                    height={220}
                                    timeframes={[]}
                                    onScrubIndex={(idx) => {
                                        if (idx === null || idx < 0 || !detail.chartData[idx]) {
                                            setScrubbedValues(null);
                                        } else {
                                            const point = detail.chartData[idx];
                                            const values: Record<string, number> = {};
                                            detail.outcomes.forEach((o: any) => {
                                                values[o.id] = (point as any)[o.id] || o.probability;
                                            });
                                            setScrubbedValues(values);
                                        }
                                    }}
                                />
                            </View>
                        ) : (
                        <View style={{ marginLeft: -16, width: width, marginBottom: 24 }}>
                            <View style={{ height: 260 }}>
                                {/* NO Chart (Top) */}
                                <View style={{ height: 130, overflow: 'hidden' }}>
                                    <UnifiedMarketChart 
                                        series={[{ 
                                            data: chartSeries[1]?.data || [], 
                                            color: '#EF4444', 
                                            strokeWidth: 3 
                                        }]}
                                        mode="SINGLE"
                                        width={CHART_WIDTH}
                                        height={130}
                                        onScrub={(val) => {
                                            // Optional: Sync logic here if we had state
                                        }}
                                    />
                                </View>
                                {/* YES Chart (Bottom) */}
                                <View style={{ height: 130, overflow: 'hidden', marginTop: -10 }}>
                                    <UnifiedMarketChart 
                                        series={[{ 
                                            data: chartSeries[0]?.data || [], 
                                            color: '#22C55E', 
                                            strokeWidth: 3 
                                        }]}
                                        mode="SINGLE"
                                        width={CHART_WIDTH}
                                        height={130}
                                    />
                                </View>

                                {/* Floating Labels (Right Aligned) */}
                                <View style={{ position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'space-between', paddingVertical: 40 }} pointerEvents="none">
                                    <View>
                                        <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '700', textAlign: 'right' }}>NO</Text>
                                        <Text style={{ color: '#EF4444', fontSize: 24, fontWeight: '800', textAlign: 'right' }}>{Math.round(100 - detail.outcomes[0].probability)}%</Text>
                                    </View>
                                    <View>
                                        <Text style={{ color: '#22C55E', fontSize: 13, fontWeight: '700', textAlign: 'right' }}>YES</Text>
                                        <Text style={{ color: '#22C55E', fontSize: 24, fontWeight: '800', textAlign: 'right' }}>{Math.round(detail.outcomes[0].probability)}%</Text>
                                    </View>
                                </View>
                            </View>
                         </View>
                        )}

                        <View style={styles.timeframeRow}>
                            {TIMEFRAMES.map((tf) => (
                                <TouchableOpacity
                                    key={tf}
                                    style={[styles.tfPill, activeTimeframe === tf && styles.tfPillActive]}
                                    onPress={() => setActiveTimeframe(tf)}
                                >
                                    <Text style={[styles.tfText, activeTimeframe === tf && styles.tfTextActive]}>{tf}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.predictionSection}>
                            <Text style={styles.sectionTitle}>Make your prediction</Text>
                            
                            {detail.marketType === 'multi-range' ? (
                                <View style={styles.outcomesList}>
                                    {detail.outcomes.slice(0, showAllOutcomes ? undefined : 3).map((outcome, idx) => (
                                        <OutcomeRow 
                                            key={outcome.id}
                                            outcome={outcome as any}
                                            volume={Math.floor(detail.volume * ((outcome as any).probability / 100))}
                                            displayProbability={scrubbedValues ? scrubbedValues[outcome.id] : (outcome as any).probability}
                                            onPress={() => {
                                                setSelectedOutcome(outcome);
                                                setTradeSheetOpen(true);
                                            }}
                                            isFirst={idx === 0} 
                                            marketType={detail.marketType}
                                        />
                                    ))}
                                    {detail.outcomes.length > 3 && (
                                        <TouchableOpacity 
                                            style={styles.showMoreBtn}
                                            activeOpacity={1}
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
                                <View style={styles.binaryBar}>
                                     <TouchableOpacity 
                                        style={[styles.actionBtn, styles.btnYes]} 
                                        onPress={() => { setViewSide('yes'); setSelectedOutcome(detail.outcomes[0]); setTradeSheetOpen(true); }}
                                        activeOpacity={0.8}
                                     >
                                         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Text style={[styles.actionText, styles.textYes]}>YES</Text>
                                            <Text style={[styles.actionText, styles.textYes]}>{Math.round(detail.outcomes.find(o => o.id === 'yes')?.probability || 0)}%</Text>
                                         </View>
                                     </TouchableOpacity>

                                     <TouchableOpacity 
                                        style={[styles.actionBtn, styles.btnNo]} 
                                        onPress={() => { setViewSide('no'); setSelectedOutcome(detail.outcomes[1]); setTradeSheetOpen(true); }}
                                        activeOpacity={0.8}
                                     >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Text style={[styles.actionText, styles.textNo]}>NO</Text>
                                            <Text style={[styles.actionText, styles.textNo]}>{Math.round(detail.outcomes.find(o => o.id === 'no')?.probability || 0)}%</Text>
                                        </View>
                                     </TouchableOpacity>
                                </View>
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

                <View style={[styles.tabContent, { minHeight: 800 }]}>
                    <ScreenContainer px={16}>
                        {activeTab === 'Details' && (
                            <View style={styles.detailsStack}>
                                <View style={styles.promoCard}>
                                    <View style={{flexDirection: 'column', gap: 4, flex: 1}}>
                                        <Text style={styles.promoTitleSimple}>Start a conversation!</Text>
                                        <Text style={styles.promoSubtitle}>Join {detail.volume > 10000 ? '1.2k' : '15'} others discussing this event</Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={styles.promoBtn}
                                        onPress={() => {
                                            navigation.navigate('HoldersChat', { entityId: predictionId, type: 'PREDICTION' });
                                        }}
                                    >
                                        <Text style={styles.promoBtnText}>
                                            {hasAccess ? 'Join Chat' : 'Join'}
                                        </Text>
                                        {!hasAccess && <Lock size={14} color="#000" style={{marginLeft: 6}} />}
                                    </TouchableOpacity>
                                </View>

                                {/* 2. About */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>About</Text>
                                    <Text style={styles.bodyText}>{detail.description}</Text>
                                    
                                    <View style={[styles.rulesRow, { marginTop: 20 }]}>
                                        <TouchableOpacity style={styles.rulePill} onPress={() => setInfoSheetType('rules')}>
                                            <Text style={styles.ruleText}>View rules</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.rulePill} onPress={() => setInfoSheetType('disclosures')}>
                                            <Text style={styles.ruleText}>View disclosures</Text>
                                        </TouchableOpacity>
                                    </View>
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
                                        <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Trading Prohibitions</Text>
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
                                
                                {/* Similar Predictions */}
                                <View>
                                    <Text style={styles.sectionTitle}>Similar Predictions</Text>
                                    <View style={styles.similarList}>
                                        {getAllPredictions().filter(p => p.id !== predictionId).slice(0, 3).map((simPred, index, arr) => {
                                            const relatedArtist = simPred.relatedEntityId ? getArtistById(simPred.relatedEntityId) : null;
                                            const chanceStr = simPred.marketType === 'binary' 
                                                ? (simPred.chance + '%') 
                                                : ((simPred as any).outcomes[0]?.chance + '%'); // Top outcome chance
                                            
                                            return (
                                                <TouchableOpacity 
                                                    key={simPred.id}
                                                    style={[styles.simRow, index === arr.length - 1 && { borderBottomWidth: 0 }]}
                                                    onPress={() => navigation.push('PredictionDetail', { predictionId: simPred.id })}
                                                >
                                                    <Image 
                                                        source={{ uri: relatedArtist?.avatarUrl || 'https://i.pravatar.cc/150' }} 
                                                        style={styles.simAvatar} 
                                                    />
                                                    <View style={{ flex: 1, gap: 4 }}>
                                                        <Text style={styles.simQuestion} numberOfLines={2}>{simPred.question}</Text>
                                                        <Text style={styles.simMeta}>{formatCompact(simPred.volume)} Vol • {chanceStr} Chance</Text>
                                                    </View>
                                                    <View style={styles.chevron}>
                                                         <Share size={16} color="#444" style={{ transform: [{ rotate: '-90deg' }] }}  />
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                                <View style={{ height: 40 }} />
                            </View>
                        )}
                {activeTab === 'Comments' && <ArtistComments entityId={predictionId} />}
                {activeTab === 'Holders' && (
                    <PredictionHolders 
                        entityId={predictionId} 
                        onBuyYes={() => { setViewSide('yes'); setSelectedOutcome(detail.outcomes[0]); setTradeSheetOpen(true); }}
                        onBuyNo={() => { setViewSide('no'); setSelectedOutcome(detail.outcomes[1]); setTradeSheetOpen(true); }}
                    />
                )}
                {activeTab === 'Activity' && <ArtistActivity artist={{ id: predictionId } as any} />}
            </ScreenContainer>
        </View>
    </ScrollView>

            {detail && (
                <TradeSheet
                    visible={tradeSheetOpen}
                    mode="BUY"
                    marketType={detail.marketType}
                    outcomeName={selectedOutcome?.name}
                    artistName={detail.marketType === 'multi-range' && selectedOutcome ? selectedOutcome.name : detail.question}
                    ticker={detail.marketType === 'multi-range' ? (selectedOutcome?.name || 'YES') : (viewSide === 'yes' ? 'YES' : 'NO')}
                    sharePrice={selectedOutcome?.probability ? selectedOutcome.probability / 100 : 0.5}
                    mcs={50}
                    onClose={() => setTradeSheetOpen(false)}
                    onConfirm={(amt, isShares) => {
                        console.log('Trade confirmed:', amt, isShares);
                        setTradeSheetOpen(false);
                        showToast(`Order placed successfully!`, 'success');
                    }}
                />
            )}

            <ShareSheet
                visible={shareSheetVisible}
                onClose={() => setShareSheetVisible(false)}
                artistName={detail.question}
            />

            <InfoSheet 
                visible={!!infoSheetType}
                onClose={() => setInfoSheetType(null)}
                title={infoSheetType === 'rules' ? 'Rules' : 'Disclosures'}
                content={infoSheetType === 'rules' ? ((detail as any).rules || 'Standard market rules apply.') : 'The following are prohibited from trading this contract: Current and former players, coaches, and staff of the league, association, or organization(s) governing the event.'}
            />
        </View>
    );
};

const OutcomeRow = ({ outcome, volume, onPress, isFirst, marketType, displayProbability }: any) => {
    return (
        <TouchableOpacity style={styles.outcomeRow} onPress={onPress} activeOpacity={0.7}>
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
                 <Text style={styles.outcomeBtnText}>{Math.round(displayProbability !== undefined ? displayProbability : outcome.probability)}%</Text>
             </TouchableOpacity>
        </TouchableOpacity>
    );
};

const TimelineItem = ({ label, value, isFirst, isLast }: any) => (
    <View style={styles.timelineItem}>
        <View style={styles.timelineLeft}>
            <View style={[styles.timelineDot, isFirst && { backgroundColor: COLORS.primary }]} />
            {!isLast && <View style={[styles.timelineLine, isFirst && { backgroundColor: COLORS.primary }]} />}
        </View>
        <View style={[styles.timelineContent, isLast && { paddingBottom: 0 }]}>
            <Text style={styles.timelineLabel}>{label}</Text>
            <Text style={styles.timelineValue}>{value}</Text>
        </View>
    </View>
);

const PredictionHolders = ({ entityId, onBuyYes, onBuyNo }: { entityId: string, onBuyYes: () => void, onBuyNo: () => void }) => {
    const { yes, no } = getPredictionHolders(entityId);
    
    return (
        <View style={styles.holdersContainer}>
            {/* YES Column */}
            <View style={styles.holderColumn}>
                <View style={styles.holderHeaderRow}>
                    <Text style={styles.holderHeader}>Yes holders</Text>
                </View>
                {yes.map(holder => (
                    <View key={holder.id} style={styles.holderRow}>
                        <Image source={{ uri: holder.avatar }} style={styles.holderAvatar} />
                        <View>
                            <Text style={styles.holderName}>{holder.name}</Text>
                            <Text style={[styles.holderShares, { color: '#4ADE80' }]}>{holder.shares} shares</Text>
                        </View>
                    </View>
                ))}
                <TouchableOpacity 
                    style={[styles.actionBtn, styles.btnYes, { height: 48, marginTop: 16 }]} 
                    onPress={onBuyYes}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.actionText, styles.textYes, { fontSize: 16 }]}>Buy Yes</Text>
                </TouchableOpacity>
            </View>

             {/* NO Column */}
             <View style={styles.holderColumn}>
                <View style={styles.holderHeaderRow}>
                     <Text style={styles.holderHeader}>No holders</Text>
                </View>
                {no.map(holder => (
                    <View key={holder.id} style={styles.holderRow}>
                        <Image source={{ uri: holder.avatar }} style={styles.holderAvatar} />
                         <View>
                            <Text style={styles.holderName}>{holder.name}</Text>
                            <Text style={[styles.holderShares, { color: '#F87171' }]}>{holder.shares} shares</Text>
                        </View>
                    </View>
                ))}
                <TouchableOpacity 
                    style={[styles.actionBtn, styles.btnNo, { height: 48, marginTop: 16 }]} 
                    onPress={onBuyNo}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.actionText, styles.textNo, { fontSize: 16 }]}>Buy No</Text>
                </TouchableOpacity>
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
    // LEGEND
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    legendText: {
        fontSize: 13,
        color: '#CCC',
        fontWeight: '500', 
    },
    legendMore: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
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
        marginBottom: 24,
    },

    // TAB CONTENT
    tabContent: {
        paddingTop: 8,
        backgroundColor: COLORS.black,
    },
    detailsStack: {
        gap: 24,
    },
    
    // BINARY BUTTONS (Two Big Pills)


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
        marginTop: 8, 
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
    
    // Similar Predictions
    similarList: {
        backgroundColor: '#111',
        borderRadius: 16,
        paddingHorizontal: 16,
    },
    simRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        gap: 12,
    },
    simAvatar: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#222',
    },
    simQuestion: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: FONT_FAMILY.medium,
        lineHeight: 20,
    },
    simMeta: {
        color: '#888',
        fontSize: 12,
        fontFamily: FONT_FAMILY.body,
    },
    chevron: {
        opacity: 0.5,
    },
    holderHeaderRow: {
        height: 48,
        justifyContent: 'center',
    },
    miniBuyBtn: {
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    miniBuyText: {
        fontSize: 13,
        fontWeight: '700',
        fontFamily: FONT_FAMILY.header,
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
    

    // SHOW MORE
    showMoreBtn: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    showMoreText: {
        color: COLORS.textSecondary,
        fontSize: 13,
        fontWeight: '600',
    },

    // BINARY BAR
    binaryBar: {
        flexDirection: 'row',
        gap: 16,
    },
    actionBtn: {
        flex: 1,
        height: 56,
        borderRadius: 28, // Pill
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        borderWidth: 1,
    },
    btnYes: {
        borderColor: '#00FF94', // Neon Green
    },
    btnNo: {
        borderColor: '#FF3B30', // Soft Red
    },
    actionText: {
        fontFamily: FONT_FAMILY.balance,
        fontSize: 16,
        fontWeight: '600',
    },
    textYes: {
        color: '#00FF94',
    },
    textNo: {
        color: '#FF3B30',
    },


});
