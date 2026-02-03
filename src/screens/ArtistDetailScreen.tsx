import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_FAMILY } from '../constants/theme';
import { getArtistById, Artist, getAllArtists } from '../data/catalog';
import { getEntityMetrics, mockSeries, getHoldersList } from '../lib/mockMetrics';
import { HeaderBack } from '../components/common/HeaderBack';
import { EntityRow } from '../components/common/EntityRow';
import { CreatorCard } from '../components/common/CreatorCard';
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
import { useToast } from '../context/ToastContext';
import { GradientEye } from '../components/common/GradientEye';

const { width } = Dimensions.get('window');
const TIMEFRAMES = ['1m', '5m', '10m', '15m', '30m', 'All'];

export const ArtistDetailScreen = ({ route, navigation }: any) => {
  const { artistId, initialTab, openChat } = route.params || { artistId: 'a1' };
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [chartSeries, setChartSeries] = useState<number[]>([]);
  
  const [activeTab, setActiveTab] = useState<TabType>('Details');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
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
      const newState = !isWatchlisted;
      setIsWatchlisted(newState);
      if (newState) {
          showToast('Artist added to watchlist', 'success');
      }
  };

  useEffect(() => {
    const data = getArtistById(artistId);
    if (data) {
        setArtist(data);
        const m = getEntityMetrics(artistId);
        setMetrics(m);
        // Generate chart based on ID + timeframe (mock)
        const series = mockSeries(123 + TIMEFRAMES.indexOf(activeTimeframe), 40); 
        setChartSeries(series);
    }
  }, [artistId, activeTimeframe]);

  if (!artist || !metrics) return <View style={styles.loading}><Text style={{color: '#FFF'}}>Loading...</Text></View>;

  // Chart Data Logic
  const minPrice = Math.min(...chartSeries);
  const maxPrice = Math.max(...chartSeries);
  const currentPrice = chartSeries[chartSeries.length - 1];

  const formatCompact = (num: number) => {
      return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
  };

  const getSocialIcon = (label: string) => {
    const size = 14;
    const color = '#999';
    const l = label.toLowerCase();
    
    if (l.includes('website')) return <Globe size={size} color={color} />;
    if (l.includes('spotify')) return <Music size={size} color={color} />;
    if (l.includes('apple')) return <Disc size={size} color={color} />;
    if (l.includes('you')) return <PlayCircle size={size} color={color} />;
    if (l.includes('x') || l.includes('twitter')) return <Twitter size={size} color={color} />;
    if (l.includes('insta')) return <Instagram size={size} color={color} />;
    if (l.includes('discord')) return <MessageCircle size={size} color={color} />;
    
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
          <Image source={{ uri: artist.avatarUrl }} style={styles.avatar} />
          <View>
             <Text style={styles.headerName}>{artist.name}</Text>
             <View style={styles.tickerRow}>
                <Text style={styles.headerTicker}>{artist.symbol}</Text>
                <Copy size={12} color="#666" style={{ marginLeft: 4 }} />
             </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleWatchlist} activeOpacity={0.7}>
             {isWatchlisted ? (
                 <GradientEye size={24} />
             ) : (
                 <Eye size={24} color="#FFF" />
             )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShareSheetVisible(true)}>
             <Share size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        stickyHeaderIndices={[2]} // Pin the tabs
      >
        {/* KPI Row */}
        <View style={styles.kpiContainer}>
           <View>
              <View style={styles.kpiRow}>
                 <Text style={styles.kpiValue}>{formatCompact(metrics.marketCap)}</Text>
                 <Text style={styles.kpiLabel}> MC</Text>
              </View>
              <Text style={styles.kpiChange}>+{metrics.changeTodayPct.toFixed(2)}% Today</Text>
           </View>
           <View style={{alignItems: 'flex-end'}}>
              <View style={styles.kpiRow}>
                 <Text style={styles.kpiValue}>{formatCompact(metrics.ath)}</Text>
                 <Text style={styles.kpiLabel}> ATH</Text>
              </View>
           </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
           <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <LineChart 
                  data={chartSeries} 
                  width={width - 48} // Reserve space for Y-axis
                  height={180} 
                  color={COLORS.success} 
                  onScrub={(value) => setScrubbedPrice(value)}
                />
              </View>
              {/* Right Y-Axis */}
              <View style={styles.yAxis}>
                 <Text style={[styles.axisLabel, scrubbedPrice !== null ? { color: COLORS.white, fontWeight: '700' } : undefined]}>
                    ${(scrubbedPrice !== null ? scrubbedPrice : currentPrice).toFixed(2)}
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

        {/* Tabs */}
        <ArtistTabs activeTab={activeTab} onTabPress={setActiveTab} />

        {/* CONTENT */}
        {activeTab === 'Comments' ? (
            <View style={styles.tabContent}>
                <ArtistComments entityId={artist.id} />
            </View>
        ) : activeTab === 'Holders' ? (
             <View style={styles.tabContent}>
                <ArtistHolders 
                   entityId={artist.id}
                   initialViewMode={openChat ? 'Chat' : 'Holders'}
                   onJoinPress={() => setTradeSheetMode('BUY')}
                /> 
             </View>
        ) : activeTab === 'Activity' ? (
              <View style={styles.tabContent}>
                <ArtistActivity artist={artist as any} />
              </View>
        ) : activeTab === 'Predictions' ? (
              <View style={styles.tabContent}>
                <ArtistPredictions entityId={artist.id} name={artist.name} />
              </View>
        ) : activeTab === 'Details' && (
               <View style={styles.tabContent}>
                 {/* Stats Grid */}
                 <View style={styles.grid}>
                    <StatCard label="Price" value={'$' + metrics.price.toFixed(2)} />
                    <StatCard label="Volume (24h)" value={formatCompact(metrics.volume24h)} />
                    <StatCard label="Market Cap" value={formatCompact(metrics.marketCap)} />
                    <StatCard label="Holders" value={metrics.holders.toLocaleString()} />
                 </View>

                 {/* Bio Card (Includes Metrics + Links) */}
                 <Text style={styles.sectionHeader}>Artist Bio</Text>
                 <View style={styles.bioCard}>
                    <Text style={styles.bioText}>{artist.bio}</Text>
                    <View style={styles.divider} />
                    
                    <BioMetric 
                       label="Circulating Supply" 
                       value={metrics.circulatingSupply.toLocaleString()} 
                       description="Represents the total number of shares currently held by investors. Higher supply typically means higher liquidity."
                       onPressInfo={openInfo}
                    />
                    <BioMetric 
                       label="Market Confidence Score" 
                       value={`${metrics.marketConfidenceScore.value}% (${metrics.marketConfidenceScore.level})`} 
                       color={metrics.marketConfidenceScore.value > 70 ? COLORS.success : '#F5A623'}
                       description="A composite score (0-100%) reflecting market sentiment. Calculated from volume trends, holder retention, and price stability."
                       onPressInfo={openInfo}
                    />
                    <BioMetric 
                       label="Momentum" 
                       value={metrics.momentum} 
                       description="Indicates the current trend direction. Bullish means buying pressure is increasing, while Bearish suggests selling pressure."
                       onPressInfo={openInfo}
                    />

                    {/* Social Links (Inside Bio Card now) */}
                    {artist.links && Object.keys(artist.links).length > 0 && (
                       <View style={styles.linksContainer}>
                          <View style={styles.divider} />
                          <View style={styles.socialsRow}>
                             {Object.entries(artist.links).map(([label, url]) => (
                               <TouchableOpacity key={label} style={styles.socialPill}>
                                  {getSocialIcon(label)}
                                  <Text style={styles.socialText}>{label}</Text>
                               </TouchableOpacity>
                             ))}
                          </View>
                       </View>
                    )}
                 </View>

                 {/* Created By Section */}
                 {artist.createdBy && (
                    <CreatorCard creator={artist.createdBy} />
                 )}

                 {/* Similar Artists */}
                 <Text style={styles.sectionHeader}>Similar Artists</Text>
                 <View style={styles.similarCard}>
                    {getAllArtists().filter(a => a.id !== artist.id).slice(0, 3).map((simArtist, index, arr) => {
                        const simMetrics = getEntityMetrics(simArtist.id);
                        return (
                            <EntityRow 
                                key={simArtist.id}
                                name={simArtist.name}
                                avatarUrl={simArtist.avatarUrl}
                                price={'$' + simMetrics.price.toFixed(2)}
                                changePct={simMetrics.changeTodayPct}
                                volume={formatCompact(simMetrics.volume24h)}
                                isLast={index === arr.length - 1}
                                onPress={() => navigation.push('ArtistDetail', { artistId: simArtist.id })}
                            />
                        );
                    })}
                 </View>
               </View>
            )}
      </ScrollView>

      {/* Buy/Sell Footer */}
      <BuySellBar 
         onBuy={() => setTradeSheetMode('BUY')}
         onSell={() => setTradeSheetMode('SELL')}
      />

       <TradeSheet 
         visible={!!tradeSheetMode} 
         mode={tradeSheetMode || 'BUY'} 
         artistName={artist.name}
         ticker={artist.symbol}
         sharePrice={metrics.price}
         mcs={metrics.marketConfidenceScore.value}
         avatarUrl={artist.avatarUrl}
         onClose={() => setTradeSheetMode(null)}
         onConfirm={(val: any) => { 
           console.log('Trade', val); 
           setTradeSheetMode(null); 
           showToast(`${tradeSheetMode === 'BUY' ? 'Purchase' : 'Sale'} successful!`, 'success');
         }}
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
          artistName={artist.name}
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
    backgroundColor: COLORS.background,
  },
  loading: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  
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
    gap: 20, // +4px as requested (16 -> 20)
  },

  scrollContent: {
  },

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
    fontWeight: '700', // Explicit Bold
    fontSize: 18, // 18-20px
    color: '#FFF',
  },
  kpiLabel: {
    fontFamily: FONT_FAMILY.header, // Medium
    fontSize: 14, // Smaller
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
    fontSize: 12, // Increased +2px (10->12)
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tfPillActive: {
    backgroundColor: '#181818',
  },
  tfText: {
    color: '#666',
    fontFamily: FONT_FAMILY.header, // Medium
    fontSize: 14, // Increased +2px
  },
  tfTextActive: {
    color: '#FFF',
  },

  // Tab Content
  tabContent: {
    paddingHorizontal: 16,
    minHeight: Dimensions.get('window').height, // Ensure height persists to keep header sticky
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, // Reduced to 8px as requested
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: COLORS.surface, // Updated from #111
    borderRadius: 12,
    padding: 16,
    width: (width - 32 - 8) / 2, // Adjusted for 8px gap
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
    fontFamily: FONT_FAMILY.body,
  },
  statValue: {
    color: '#FFF',
    fontSize: 14, // Reduced to 14px as requested
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700', // Explicit Bold
    marginBottom: 4,
  },

  // Bio
  bioCard: {
    backgroundColor: COLORS.surface, // Updated from #111
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
    marginBottom: 16, // Increased to 16px as requested
  },
  bioLabel: {
    fontSize: 14, // Reverted to 14px as requested
    fontFamily: FONT_FAMILY.header, // Medium/Regular
    color: '#999',
  },
  bioValue: {
    fontSize: 14, // Reduced to 14px as requested
    fontFamily: FONT_FAMILY.balance, // Bold
    fontWeight: '700', // Explicit Bold
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
    backgroundColor: COLORS.surface, // Updated from #181818 if needed, but #181818 is close to surface. Kept as is or surface? Let's use surface or explicitly #181818.
    // Actually, let's keep it consistent. #181818 is approx surface.
    backgroundColor: '#181818', 
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
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

  // Creator
  creatorSection: {
    marginBottom: 40,
  },
  sectionHeader: {
    color: '#FFF',
    fontSize: 18, // UPDATED: Standardized to 18px
    fontFamily: FONT_FAMILY.header,
    marginBottom: 16,
  },
  similarCard: {
      backgroundColor: COLORS.surface, // Updated from #111
      borderRadius: 16,
      paddingHorizontal: 16,
      marginBottom: 40,
  },
});
