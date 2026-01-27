import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { getLabelById, Label, getArtistById, getAllLabels } from '../data/catalog';
import { getEntityMetrics, mockSeries, getHoldersList } from '../lib/mockMetrics';
import { HeaderBack } from '../components/common/HeaderBack';
import { CreatorCard } from '../components/common/CreatorCard';
import { EntityRow } from '../components/common/EntityRow';
import { Eye, Share, Copy, Info, Globe, Music, PlayCircle, Twitter, Instagram, MessageCircle, Disc } from 'lucide-react-native';
import { LineChart } from '../components/LineChart'; 
import { ArtistTabs, TabType } from '../components/artist/ArtistTabs';
import { BuySellBar } from '../components/artist/BuySellBar';
import { InfoModal } from '../components/common/InfoModal';
import { TradeSheet } from '../components/artist/TradeSheet';
import { ArtistComments } from '../components/artist/ArtistComments';
import { ArtistHolders } from '../components/artist/ArtistHolders';
import { ArtistActivity } from '../components/artist/ArtistActivity';
import { ArtistPredictions } from '../components/artist/ArtistPredictions';
import { ShareSheet } from '../components/artist/ShareSheet';

const { width } = Dimensions.get('window');
const TIMEFRAMES = ['1m', '5m', '10m', '15m', '30m', 'All'];

export const LabelDetailScreen = ({ route, navigation }: any) => {
    const { labelId } = route.params || { labelId: 'l1' };
    const insets = useSafeAreaInsets();
    
    // START: IDENTICAL STATE LOGIC TO ARTIST DETAIL
    const [label, setLabel] = useState<Label | null>(null);
    const [metrics, setMetrics] = useState<any>(null);
    const [chartSeries, setChartSeries] = useState<number[]>([]);
    
    const [activeTab, setActiveTab] = useState<TabType>('Details');
    const [activeTimeframe, setActiveTimeframe] = useState('15m');
    const [tradeSheetMode, setTradeSheetMode] = useState<'BUY' | 'SELL' | null>(null);
    const [infoModal, setInfoModal] = useState({ visible: false, title: '', description: '' });
    const [shareSheetVisible, setShareSheetVisible] = useState(false);
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [scrubbedPrice, setScrubbedPrice] = useState<number | null>(null);

    const openInfo = (title: string, description: string) => {
        setInfoModal({ visible: true, title, description });
    };

    const toggleWatchlist = () => {
        setIsWatchlisted(!isWatchlisted);
    };

    // FETCH DATA
    useEffect(() => {
        if(!labelId) return;
        const data = getLabelById(labelId);
        if (data) {
            setLabel(data);
            setMetrics(getEntityMetrics(labelId));
            setChartSeries(mockSeries(999 + TIMEFRAMES.indexOf(activeTimeframe), 40));
        }
    }, [labelId, activeTimeframe]);

    if (!label || !metrics) return <View style={styles.loading}><Text style={{color: '#FFF'}}>Loading...</Text></View>;

    // MOCK CHART DATA
    const minPrice = Math.min(...chartSeries);
    const maxPrice = Math.max(...chartSeries);
    const currentPrice = scrubbedPrice !== null ? scrubbedPrice : chartSeries[chartSeries.length - 1];

    const formatCompact = (num: number) => {
        return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
    };
    
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const getSocialIcon = (labelKey: string) => {
        const size = 14;
        const color = '#999';
        const l = labelKey.toLowerCase();
        if (l.includes('website')) return <Globe size={size} color={color} />;
        if (l.includes('spotify')) return <Music size={size} color={color} />;
        if (l.includes('apple')) return <Disc size={size} color={color} />;
        if (l.includes('you')) return <PlayCircle size={size} color={color} />;
        if (l.includes('x') || l.includes('twitter')) return <Twitter size={size} color={color} />;
        if (l.includes('insta')) return <Instagram size={size} color={color} />;
        return <Globe size={size} color={color} />;
    };

    return (
        <KeyboardAvoidingView 
           style={{flex: 1, backgroundColor: COLORS.background}} 
           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
           keyboardVerticalOffset={0}
        >
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <View style={styles.headerLeft}>
                    <HeaderBack />
                     {/* Label Avatar (No backround card) */}
                    <Image source={{ uri: label.avatarUrl }} style={styles.avatar} />
                    <View>
                        <Text style={styles.headerName}>{label.name}</Text>
                        <View style={styles.tickerRow}>
                            <Text style={styles.headerTicker}>{label.symbol}</Text>
                            <Copy size={12} color="#666" style={{ marginLeft: 4 }} />
                        </View>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={toggleWatchlist}>
                         <Eye size={24} color={isWatchlisted ? COLORS.primary : "#FFF"} fill={isWatchlisted ? COLORS.primary : "transparent"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShareSheetVisible(true)}>
                         <Share size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView 
                contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
                stickyHeaderIndices={[2]} // Sticky Tabs
            >
                {/* KPI Row (Same size as ArtistDetail) */}
                <View style={styles.kpiContainer}>
                   <View>
                      <View style={styles.kpiRow}>
                         <Text style={styles.kpiValue}>{formatCompact(metrics.marketCap)}</Text>
                         {/* Regular dimmed label */}
                         <Text style={styles.kpiLabel}> MC</Text>
                      </View>
                      <Text style={styles.kpiChange}>
                        {metrics.changeTodayPct > 0 ? '+' : ''}{metrics.changeTodayPct.toFixed(2)}% Today
                      </Text>
                   </View>
                   <View style={{alignItems: 'flex-end'}}>
                      <View style={styles.kpiRow}>
                         <Text style={styles.kpiValue}>{formatCompact(metrics.ath)}</Text>
                         <Text style={styles.kpiLabel}> ATH</Text>
                      </View>
                   </View>
                </View>

                {/* Chart Container */}
                <View style={styles.chartContainer}>
                   <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <LineChart 
                          data={chartSeries} 
                          width={width - 48} 
                          height={180} 
                          color={COLORS.success} 
                          onScrub={(value) => setScrubbedPrice(value)}
                        />
                      </View>
                      <View style={styles.yAxis}>
                         <Text style={[styles.axisLabel, scrubbedPrice !== null ? { color: COLORS.white, fontWeight: '700' } : undefined]}>
                            ${currentPrice.toFixed(2)}
                         </Text>
                         <Text style={styles.axisLabel}>${((maxPrice + minPrice)/2).toFixed(2)}</Text>
                         <Text style={styles.axisLabel}>${minPrice.toFixed(2)}</Text>
                      </View>
                   </View>
                   
                   {/* Timeframe Selector */}
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
                </View>

                 {/* Sticky Tabs */}
                 <ArtistTabs activeTab={activeTab} onTabPress={setActiveTab} />

                 {/* TAB CONTENT */}
                 {activeTab === 'Details' && (
                     <View style={styles.tabContent}>
                         {/* Stats Grid */}
                         <View style={styles.grid}>
                             <StatCard label="Price" value={'$' + metrics.price.toFixed(2)} />
                             <StatCard label="Volume (24h)" value={formatCompact(metrics.volume24h)} />
                             <StatCard label="Market Cap" value={formatCompact(metrics.marketCap)} />
                             <StatCard label="Holders" value={metrics.holders.toLocaleString()} />
                         </View>

                         {/* Label Bio */}
                         <Text style={styles.sectionHeader}>Label Bio</Text>
                         <View style={styles.bioCard}>
                             <Text style={styles.bioText}>{label.labelBio}</Text>
                             <View style={styles.divider} />
                             
                             <BioMetric 
                                label="Circulating Supply" 
                                value={metrics.circulatingSupply.toLocaleString()} 
                                description="Total shares held by investors."
                                onPressInfo={openInfo}
                             />
                             <BioMetric 
                                label="Market Confidence Score" 
                                value={`${metrics.marketConfidenceScore.value}% (${metrics.marketConfidenceScore.level})`} 
                                color={metrics.marketConfidenceScore.value > 70 ? COLORS.success : '#F5A623'}
                                description="Composite score reflecting market sentiment."
                                onPressInfo={openInfo}
                             />
                             <BioMetric 
                                label="Momentum" 
                                value={metrics.momentum} 
                                description="Current market trend direction."
                                onPressInfo={openInfo}
                             />

                             {/* Social Links */}
                             {label.links && Object.keys(label.links).length > 0 && (
                                <View style={styles.linksContainer}>
                                   <View style={styles.divider} />
                                   <View style={styles.socialsRow}>
                                      {Object.entries(label.links).map(([key, url]) => (
                                        <TouchableOpacity key={key} style={styles.socialPill}>
                                           {getSocialIcon(key)}
                                           <Text style={styles.socialText}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                                        </TouchableOpacity>
                                      ))}
                                   </View>
                                </View>
                             )}
                         </View>

                         {/* Signed Artists Section */}
                         <Text style={styles.sectionHeader}>Signed Artists</Text>
                         <View style={styles.signedArtistsCard}>
                             {label.signedArtists.map((artistId, index) => {
                                 const artist = getArtistById(artistId);
                                 if (!artist) return null;
                                 const artistMetrics = getEntityMetrics(artistId);
                                 return (
                                     <EntityRow 
                                         key={artist.id}
                                         name={artist.name}
                                         avatarUrl={artist.avatarUrl}
                                         price={formatCurrency(artistMetrics.price)}
                                         changePct={artistMetrics.changeTodayPct}
                                         volume={formatCompact(artistMetrics.volume24h)}
                                         isLast={index === label.signedArtists.length - 1}
                                         onPress={() => navigation.push('ArtistDetail', { artistId: artist.id })}
                                     />
                                 );
                             })}
                             {label.signedArtists.length === 0 && (
                                 <Text style={{ color: '#666', fontFamily: FONT_FAMILY.body, padding: 16 }}>No artists listed.</Text>
                             )}
                         </View>

                         {/* Created By Section (Strict Parity) */}
                         {label.createdBy && (
                             <CreatorCard creator={label.createdBy} />
                         )}

                         {/* Similar Labels */}
                         <Text style={styles.sectionHeader}>Similar Labels</Text>
                         <View style={styles.similarCard}>
                            {((global as any).getAllLabels ? (global as any).getAllLabels() : getAllLabels()).filter((l: any) => l.id !== label.id).slice(0, 3).map((simLabel: any, index: number, arr: any[]) => {
                                // Mock metrics for labels if they share the same ID space or just reuse getEntityMetrics
                                const simMetrics = getEntityMetrics(simLabel.id);
                                return (
                                    <EntityRow 
                                        key={simLabel.id}
                                        name={simLabel.name}
                                        avatarUrl={simLabel.avatarUrl}
                                        price={'$' + simMetrics.price.toFixed(2)}
                                        changePct={simMetrics.changeTodayPct}
                                        volume={formatCompact(simMetrics.volume24h)}
                                        isLast={index === arr.length - 1}
                                        onPress={() => navigation.push('LabelDetail', { labelId: simLabel.id })}
                                    />
                                );
                            })}
                         </View>
                     </View>
                 )}

                 {/* Helper Tabs (Placeholders / Reused Components) */}
                 {activeTab === 'Comments' && (
                     <View style={styles.tabContent}>
                         <ArtistComments />
                     </View>
                 )}
                 {activeTab === 'Holders' && (
                     <View style={styles.tabContent}>
                        <ArtistHolders 
                            entityId={label.id} 
                            onJoinPress={() => setTradeSheetMode('BUY')}
                        /> 
                     </View>
                 )}
                 {activeTab === 'Activity' && (
                      <View style={styles.tabContent}>
                          <ArtistActivity artist={label as any} />
                      </View>
                 )}
                 {activeTab === 'Predictions' && (
                      <View style={styles.tabContent}>
                          <ArtistPredictions entityId={label.id} name={label.name} />
                      </View>
                 )}

            </ScrollView>

            {/* Buy/Sell CTA */}
            <BuySellBar 
               onBuy={() => setTradeSheetMode('BUY')}
               onSell={() => setTradeSheetMode('SELL')}
            />

            {/* Sheets & Modals */}
            <TradeSheet 
               visible={!!tradeSheetMode} 
               mode={tradeSheetMode || 'BUY'} 
               artistName={label.name}
               ticker={label.symbol}
               sharePrice={metrics.price}
               mcs={metrics.marketConfidenceScore.value}
               onClose={() => setTradeSheetMode(null)}
               onConfirm={(val: any) => { setTradeSheetMode(null); }}
            />
            
            <InfoModal 
               visible={infoModal.visible}
               title={infoModal.title}
               description={infoModal.description}
               onClose={() => setInfoModal(prev => ({ ...prev, visible: false }))}
            />
            
            <ShareSheet 
               visible={shareSheetVisible}
               onClose={() => setShareSheetVisible(false)}
               artistName={label.name}
            />
        </View>
        </KeyboardAvoidingView>
    );
};

// Sub-components
const StatCard = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.statCard}>
       <Text style={styles.statValue}>{value}</Text>
       <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
  
  const BioMetric = ({ label, value, color = '#FFF', description, onPressInfo }: any) => (
    <View style={styles.bioRow}>
      <TouchableOpacity 
        activeOpacity={0.7}
        style={{flexDirection: 'row', alignItems: 'center', gap: 6}}
        onPress={() => onPressInfo && onPressInfo(label, description)}
      >
         <Text style={styles.bioLabel}>{label}</Text>
         <Info size={14} color="#666" />
      </TouchableOpacity>
      <Text style={[styles.bioValue, { color }]}>{value}</Text>
    </View>
  );

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loading: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40, 
        height: 40,
        borderRadius: 20,
        backgroundColor: '#333',
    },
    headerName: {
        fontFamily: FONT_FAMILY.medium, // Explicit Medium
        fontWeight: '600', // Semibold
        fontSize: 16,
        color: '#FFF',
    },
    tickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTicker: {
        fontFamily: FONT_FAMILY.body,
        fontSize: 14,
        color: '#999',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 20, // UPDATED: 16 + 4px extra = 20px
    },

    scrollContent: {},

    // KPI
    kpiContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    kpiRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    kpiValue: {
        fontFamily: FONT_FAMILY.balance, // Bold
        fontWeight: '700',
        fontSize: 18, 
        color: '#FFF',
    },
    kpiLabel: {
        fontFamily: FONT_FAMILY.header, 
        fontSize: 14,
        color: '#9A9A9A',
        marginLeft: 4,
    },
    kpiChange: {
        fontFamily: FONT_FAMILY.body,
        fontSize: 14,
        color: COLORS.success,
        marginTop: 4,
    },

    // Chart
    chartContainer: {
        marginBottom: 24,
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
    },
    tfPillActive: {
        backgroundColor: '#181818',
    },
    tfText: {
        color: '#666',
        fontFamily: FONT_FAMILY.header,
        fontSize: 16, // UPDATED: +2px (from 14 -> 16)
    },
    tfTextActive: {
        color: '#FFF',
    },

    // Tab Content
    tabContent: {
        paddingHorizontal: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8, // Strictly 8px
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 16,
        width: (width - 32 - 8) / 2, // width - padding*2 - gap / 2
    },
    statLabel: {
        color: '#999', 
        fontSize: 14, // Regular/Dimmed (was 12)
        fontFamily: FONT_FAMILY.body, // Regular
    },
    statValue: {
        color: '#FFF',
        fontSize: 14, // 14px
        fontFamily: FONT_FAMILY.balance, // Bold
        fontWeight: '700',
        marginBottom: 4,
    },

    // Bio
    bioCard: {
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 16,
        marginBottom: 32,
    },
    bioText: {
        fontSize: 14,
        fontFamily: FONT_FAMILY.body,
        color: '#CCC',
        lineHeight: 22,
        marginBottom: 16,
    },
    divider: {
        height: 1, 
        backgroundColor: '#222', 
        marginBottom: 16 
    },
    bioRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    bioLabel: {
        fontSize: 14,
        fontFamily: FONT_FAMILY.header,
        color: '#999',
    },
    bioValue: {
        fontSize: 14,
        fontFamily: FONT_FAMILY.balance, // Bold
        fontWeight: '700',
    },

    // Signed Artists
    signedArtistsCard: {
        backgroundColor: '#111',
        borderRadius: 16,
        paddingHorizontal: 16,
        marginBottom: 40,
    },
    // Removed local EntityRow styles as they are now in the component, except where they might be used by something else
    // Cleaning up to be safe
    
    // Creator (Copied from ArtistDetail)
    creatorSection: {
        marginBottom: 40,
    },
    
    // Shared Section Header
    sectionHeader: {
        color: '#FFF',
        fontSize: 18, // UPDATED: 18px Standard
        fontFamily: FONT_FAMILY.header, // Medium
        marginBottom: 16,
    },

    // Links
    linksContainer: {
        marginTop: 8,
    },
    socialsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    socialPill: {
        backgroundColor: '#181818',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6, 
    },
    socialText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: FONT_FAMILY.header, 
    },
    similarCard: {
        backgroundColor: '#111',
        borderRadius: 16,
        paddingHorizontal: 16,
        marginBottom: 40,
    },
});
