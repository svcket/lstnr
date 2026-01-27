import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { X, ArrowUpRight, ArrowDownLeft, TrendingUp, Search, Filter } from 'lucide-react-native';
import { getHolderProfile, HolderProfile, HoldingPosition, HoldingActivityItem } from '../utils/holdingResolvers';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

export const HoldingDetailsSheet = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const initialPosition: HoldingPosition = route.params?.position;
  
  // View State
  const [activeTab, setActiveTab] = useState<'POSITIONS' | 'SHARES' | 'ACTIVITY'>('POSITIONS');
  const [subTab, setSubTab] = useState<'ACTIVE' | 'CLOSED'>('ACTIVE');
  const [sharesSubTab, setSharesSubTab] = useState<'ARTIST' | 'LABEL'>('ARTIST');
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'VALUE' | 'PNL'>('VALUE');

  if (!initialPosition) return null;

  // Derive full profile
  const profile = useMemo(() => getHolderProfile(initialPosition.holderId, initialPosition), [initialPosition]);

  // Filter & Sort Logic
  const filteredPositions = useMemo(() => {
    let data; 
    
    // 1. Initial Data Source based on Tab
    if (activeTab === 'POSITIONS') {
        // POSITIONS TAB: Shows Predictions (Active / Closed)
        // If Active: Show active predictions + active shares? 
        // User asked to SEPARATE Shares into a new tab.
        // So Positions = PREDICTIONS (mostly) or maybe ALL.
        // But if we separate, Positions should be strictly Predictions?
        // "we could have a shares tab there where beneath it active and closed for positions"
        // Let's assume Positions = Predictions.
        data = subTab === 'ACTIVE' ? profile.positions : profile.closedPositions;
        data = data.filter(p => p.entityType === 'PREDICTION');
    } else if (activeTab === 'SHARES') {
        // SHARES TAB: Shows Artists / Labels
        // These are always "Active" in the current mock model usually, but could be closed.
        // Assuming we show Active holdings for now.
        // Filter by Subtype
        data = profile.positions.filter(p => {
             if (sharesSubTab === 'ARTIST') return p.entityType === 'SHARE'; // 'SHARE' is the legacy type for Artist
             if (sharesSubTab === 'LABEL') return p.entityType === 'LABEL';
             return false;
        });
    } else {
        return []; // Activity handled separately
    }
    
    // 2. Search Filter
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        data = data.filter(p => 
            p.entityTitle.toLowerCase().includes(q) || 
            p.entitySymbol?.toLowerCase().includes(q)
        );
    }

    // 3. Sorting
    return [...data].sort((a, b) => {
        if (sortBy === 'VALUE') return b.value - a.value;
        if (sortBy === 'PNL') return (b.pnlValue || 0) - (a.pnlValue || 0);
        return 0;
    });
  }, [profile, activeTab, subTab, sharesSubTab, searchQuery, sortBy]);

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={() => navigation.goBack()} 
      />
      
      <View style={styles.sheetContainer}>
        {/* Handlebar */}
        <View style={styles.handleContainer}>
            <View style={styles.handle} />
        </View>

        {/* Header: User & Stats */}
        <View style={styles.header}>
            {/* Same as before... */}
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{ uri: initialPosition.holderAvatarUrl }} style={styles.avatar} />
                    <View>
                        <Text style={styles.holderName}>{initialPosition.holderName}</Text>
                        <Text style={styles.context}>$YZY Holder</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                     <Text style={{color: '#FFF', fontWeight: '600'}}>Done</Text>
                </TouchableOpacity>
             </View>

             {/* Top Stats Row */}
             <View style={styles.statsRow}>
                 <View>
                     <Text style={styles.statsLabel}>Positions Value</Text>
                     <Text style={styles.statsValue}>${profile.stats.totalValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</Text>
                 </View>
                 <View style={styles.dividerV} />
                 <View>
                     <Text style={styles.statsLabel}>Biggest Win</Text>
                     <Text style={styles.statsValue}>${profile.stats.biggestWin.toLocaleString()}</Text>
                 </View>
                 <View style={styles.dividerV} />
                 <View>
                     <Text style={styles.statsLabel}>Predictions</Text>
                     <Text style={styles.statsValue}>{profile.stats.predictionsCount}</Text>
                 </View>
             </View>

             {/* PnL Card */}
             <View style={styles.pnlCard}>
                 <View style={styles.pnlHeader}>
                     <View>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                            <TrendingUp size={14} color={COLORS.success} />
                            <Text style={styles.pnlLabel}>Profit/Loss</Text>
                        </View>
                        <Text style={styles.pnlValue}>${profile.stats.pnlValue.toFixed(2)}</Text>
                        <Text style={styles.pnlSub}>Past Month</Text>
                     </View>
                     <View style={styles.pnlRight}>
                         <View style={styles.timeTag}><Text style={styles.timeTagText}>1M</Text></View>
                     </View>
                 </View>
                 
                 {/* Chart */}
                 <View style={styles.chartContainer}>
                    <MockChart data={profile.stats.chartData} color={COLORS.success} />
                 </View>
             </View>
        </View>

        {/* Main Tabs */}
        <View style={styles.tabs}>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'POSITIONS' && styles.tabActive]} 
                onPress={() => setActiveTab('POSITIONS')}
            >
                <Text style={[styles.tabText, activeTab === 'POSITIONS' && styles.tabTextActive]}>Positions</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'SHARES' && styles.tabActive]} 
                onPress={() => setActiveTab('SHARES')}
            >
                <Text style={[styles.tabText, activeTab === 'SHARES' && styles.tabTextActive]}>Shares</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'ACTIVITY' && styles.tabActive]} 
                onPress={() => setActiveTab('ACTIVITY')}
            >
                <Text style={[styles.tabText, activeTab === 'ACTIVITY' && styles.tabTextActive]}>Activity</Text>
            </TouchableOpacity>
        </View>

        {/* Sub-Filters Toolbar (For Positions OR Shares) */}
        {(activeTab === 'POSITIONS' || activeTab === 'SHARES') && (
            <View style={styles.toolbar}>
                {/* Search Bar - Expanded */}
                {searchVisible ? (
                    <View style={styles.searchContainer}>
                        <Search size={16} color="#666" />
                        <TextInput 
                            style={styles.searchInput}
                            placeholder="Search assets..."
                            placeholderTextColor="#666"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                        <TouchableOpacity onPress={() => {setSearchVisible(false); setSearchQuery('');}}>
                            <X size={16} color="#666" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Sub Tabs: Context Aware */}
                        <View style={styles.pillContainer}>
                            {activeTab === 'POSITIONS' ? (
                                <>
                                    <TouchableOpacity 
                                        style={[styles.pill, subTab === 'ACTIVE' && styles.pillActive]}
                                        onPress={() => setSubTab('ACTIVE')}
                                    >
                                        <Text style={[styles.pillText, subTab === 'ACTIVE' && styles.pillTextActive]}>Active</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.pill, subTab === 'CLOSED' && styles.pillActive]}
                                        onPress={() => setSubTab('CLOSED')}
                                    >
                                        <Text style={[styles.pillText, subTab === 'CLOSED' && styles.pillTextActive]}>Closed</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <TouchableOpacity 
                                        style={[styles.pill, sharesSubTab === 'ARTIST' && styles.pillActive]}
                                        onPress={() => setSharesSubTab('ARTIST')}
                                    >
                                        <Text style={[styles.pillText, sharesSubTab === 'ARTIST' && styles.pillTextActive]}>Artists</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.pill, sharesSubTab === 'LABEL' && styles.pillActive]}
                                        onPress={() => setSharesSubTab('LABEL')}
                                    >
                                        <Text style={[styles.pillText, sharesSubTab === 'LABEL' && styles.pillTextActive]}>Labels</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        {/* Right Tools: Search & Sort */}
                        <View style={styles.toolIconRow}>
                            <TouchableOpacity style={styles.toolIconBtn} onPress={() => setSearchVisible(true)}>
                                <Search size={20} color="#888" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.toolIconBtn} 
                                onPress={() => setSortBy(prev => prev === 'VALUE' ? 'PNL' : 'VALUE')}
                            >
                                <Filter size={20} color={sortBy === 'VALUE' ? '#888' : COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
            {activeTab !== 'ACTIVITY' ? ( // Show filtered positions for both POSITIONS and SHARES tabs
                <View>
                    {filteredPositions.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No positions found</Text>
                        </View>
                    ) : (
                        filteredPositions.map((pos) => (
                            <PositionRow key={pos.id} item={pos} />
                        ))
                    )}
                </View>
            ) : (
                <View>
                    {profile.activity.map(item => (
                        <ActivityRow key={item.id} item={item} />
                    ))}
                </View>
            )}
        </ScrollView>
      </View>
    </View>
  );
};


const PositionRow = ({ item }: { item: HoldingPosition }) => {
    const isProfit = (item.pnlValue || 0) >= 0;
    const pnlColor = isProfit ? COLORS.success : COLORS.error;
    const isClosed = item.shares === 0;

    return (
        <View style={[styles.posRow, { opacity: isClosed ? 0.7 : 1 }]}>
            <View style={styles.posLeft}>
                <View style={styles.posIcon}>
                     {item.outcomeSide ? (
                         <Text style={{fontSize: 10, color: '#FFF'}}>{item.outcomeSide === 'YES' ? 'Y' : 'N'}</Text>
                     ) : (
                         <Text style={{fontSize: 10, color: '#FFF'}}>{item.entitySymbol?.[1] || '?'}</Text>
                     )}
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.posTitle} numberOfLines={1}>{item.entityTitle}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                        {item.outcomeSide && (
                            <Text style={[styles.posBadge, {color: item.outcomeSide === 'YES' ? COLORS.success : COLORS.error}]}>
                                {item.outcomeSide}
                            </Text>
                        )}
                        <Text style={styles.posSub}>
                            {isClosed ? 'Closed' : `${item.shares.toLocaleString()} shares`}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.posRight}>
                <Text style={styles.posValue}>${item.value.toLocaleString(undefined, {minimumFractionDigits: 2})}</Text>
                <Text style={[styles.posPnl, {color: pnlColor}]}>
                    {isProfit ? '+' : ''}${(item.pnlValue || 0).toFixed(2)} ({Math.abs(item.pnlPercent || 0).toFixed(1)}%)
                </Text>
            </View>
        </View>
    );
};

const ActivityRow = ({ item }: { item: HoldingActivityItem }) => {
    const isBuy = item.type === 'BUY' || item.type === 'PREDICTION_BUY';
    const isPrediction = item.type.includes('PREDICTION');
    const color = isBuy ? COLORS.success : COLORS.error;
    
    // Icon Logic
    const Icon = isBuy ? ArrowDownLeft : ArrowUpRight;
    const bg = isBuy ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';

    return (
    <View style={styles.posRow}>
        <View style={styles.posLeft}>
            <View style={[styles.posIcon, { backgroundColor: bg }]}>
                <Icon size={16} color={color} />
            </View>
            <View>
                <Text style={styles.posTitle}>{isPrediction ? (item.subtitle || 'Prediction') : (isBuy ? 'Bought Shares' : 'Sold Shares')}</Text>
                <Text style={styles.posSub}>{item.timestamp}</Text>
            </View>
        </View>
        <View style={styles.posRight}>
            <Text style={styles.posValue}>
                {isBuy ? '+' : '-'}{item.sharesDelta.toLocaleString()}
            </Text>
            <Text style={styles.posSub}>@ ${item.price.toFixed(2)}</Text>
        </View>
    </View>
    );
};

const MockChart = ({ data, color }: { data: number[], color: string }) => {
    // Generate simple SVG path from data
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const h = 60;
    const w = width - 80;
    const step = w / (data.length - 1);
    
    // Line Path
    const points = data.map((d, i) => {
        const x = i * step;
        const y = h - ((d - min) / range) * h;
        return `${x},${y}`;
    });
    const d = `M ${points.join(' L ')}`;

    // Area Path
    const areaD = `${d} L ${points[points.length-1].split(',')[0]},${h} L 0,${h} Z`;

    return (
        <Svg height={h} width="100%">
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={color} stopOpacity="0.2" />
                    <Stop offset="1" stopColor={color} stopOpacity="0" />
                </LinearGradient>
            </Defs>
            <Path d={areaD} fill="url(#grad)" />
            <Path d={d} fill="none" stroke={color} strokeWidth="2" />
        </Svg>
    );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheetContainer: {
    backgroundColor: '#111', 
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 10,
    height: '92%', 
  },
  handleContainer: {
      alignItems: 'center',
      marginBottom: 10,
  },
  handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#333',
  },
  header: {
      marginBottom: 20,
  },
  avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#333',
      marginRight: 10,
  },
  holderName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFF',
      fontFamily: FONT_FAMILY.header,
  },
  context: {
      fontSize: 12,
      color: '#888',
      fontFamily: FONT_FAMILY.body,
  },
  closeBtn: {
      backgroundColor: '#222',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
  },
  statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
  },
  statsLabel: {
      fontSize: 12,
      color: '#888',
      marginBottom: 4,
  },
  statsValue: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFF',
      fontFamily: FONT_FAMILY.header,
  },
  dividerV: {
      width: 1,
      backgroundColor: '#333',
      height: '80%',
      alignSelf: 'center',
  },
  pnlCard: {
      backgroundColor: '#1a1a1a', 
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: '#333',
      height: 160,
  },
  pnlHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 10,
  },
  pnlLabel: {
      fontSize: 12,
      color: '#999',
      marginLeft: 4,
  },
  pnlValue: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFF',
      fontFamily: FONT_FAMILY.header,
      marginVertical: 4,
  },
  pnlSub: {
        fontSize: 12,
        color: '#666',
  },
  pnlRight: {
      
  },
  timeTag: {
      backgroundColor: '#162b48',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
  },
  timeTagText: {
      color: '#2589ff',
      fontSize: 12,
      fontWeight: '600',
  },
  chartContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      marginHorizontal: -10, // Bleed chart
      marginBottom: -10,
  },
  tabs: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#333',
      marginBottom: 16,
  },
  tab: {
      paddingVertical: 12,
      marginRight: 24,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
  },
  tabActive: {
      borderBottomColor: '#FFF', // Or primary
  },
  tabText: {
      fontSize: 15,
      color: '#666',
      fontWeight: '600',
  },
  tabTextActive: {
      color: '#FFF',
  },
  posRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#222',
  },
  posLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
  },
  posIcon: {
      width: 40,
      height: 40,
      borderRadius: 6,
      backgroundColor: '#333',
      alignItems: 'center',
      justifyContent: 'center',
  },
  posTitle: {
      fontSize: 14,
      color: '#FFF',
      fontWeight: '500', 
      marginBottom: 2,
  },
  posSub: {
      fontSize: 12,
      color: '#666',
  },
  posBadge: {
      fontSize: 11,
      fontWeight: '700',
  },
  posRight: {
      alignItems: 'flex-end',
  },
  posValue: {
      fontSize: 14,
      color: '#FFF',
      fontWeight: '600',
  },
  posPnl: {
      fontSize: 12,
      color: COLORS.success,
  },
  toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      height: 36,
  },
  pillContainer: {
      flexDirection: 'row',
      backgroundColor: '#222',
      borderRadius: 8,
      padding: 2,
  },
  pill: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 6,
  },
  pillActive: {
      backgroundColor: '#444',
  },
  pillText: {
      color: '#888',
      fontSize: 13,
      fontWeight: '600',
  },
  pillTextActive: {
      color: '#FFF',
  },
  toolIconRow: {
      flexDirection: 'row',
      gap: 12,
  },
  toolIconBtn: {
      padding: 6,
      backgroundColor: '#222',
      borderRadius: 8,
  },
  searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#222',
      borderRadius: 8,
      paddingHorizontal: 10,
      height: 36,
      gap: 8,
  },
  searchInput: {
      flex: 1,
      color: '#FFF',
      fontSize: 14,
      paddingVertical: 0,
      height: '100%',
  },
  emptyState: {
      paddingVertical: 40,
      alignItems: 'center',
  },
  emptyStateText: {
      color: '#666',
      fontSize: 14,
  }
});
