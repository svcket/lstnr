import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { PX_16, PX_8, PX_12, PX_24, LAYOUT } from '../constants/spacing';
import { ICONS } from '../constants/assets';
import { BottomNav } from '../components/home/BottomNav';
import { TRENDING_ARTISTS, POPULAR_LABELS, TOP_PREDICTIONS } from '../data/explore';
import { Search, ChevronRight, Bookmark, Bell } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

// --- TYPES ---
type FilterType = 'All' | 'Artists' | 'Predictions' | 'Ending soon';

// --- COMPONENTS ---

// 1. Search Bar
const SearchBar = ({ value, onChange }: { value: string, onChange: (t: string) => void }) => (
  <View style={styles.searchContainer}>
    <Search size={20} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
    <TextInput 
      style={styles.searchInput}
      placeholder="Artists, labels, predictions, URL"
      placeholderTextColor={COLORS.textSecondary}
      value={value}
      onChangeText={onChange}
    />
  </View>
);

// 2. Chip
const FilterChip = ({ label, isActive, onPress }: { label: FilterType, isActive: boolean, onPress: () => void }) => (
  <TouchableOpacity 
    style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.chipText, isActive ? styles.chipTextActive : styles.chipTextInactive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// 3. Section Header
const SectionHeader = ({ title }: { title: string }) => (
  <TouchableOpacity style={styles.sectionHeader} activeOpacity={0.7}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Image 
      source={ICONS.chevronRight} 
      style={{ width: 16, height: 16, tintColor: COLORS.text }} 
      resizeMode="contain"
    />
  </TouchableOpacity>
);

// 4. Large Card Container
const BigCard = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.bigCard}>
    {children}
  </View>
);

// 5. Artist/Label Row
const EntityRow = ({ item, isLast, onPress }: { item: any, isLast: boolean, onPress?: () => void }) => (
  <TouchableOpacity style={styles.entityRow} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.entityLeft}>
      <Image source={typeof item.avatar === 'string' ? { uri: item.avatar } : { uri: item.logo }} style={styles.entityAvatar} />
      <View>
        <Text style={styles.entityName}>{item.name}</Text>
        <Text style={styles.entityVol}>{item.volume}</Text>
      </View>
    </View>
    <View style={styles.entityRight}>
      <Text style={styles.entityPrice}>{item.price}</Text>
      <Text style={[styles.entityChange, { color: item.isPositive ? COLORS.success : COLORS.error }]}>
        {item.change}
      </Text>
    </View>
    {!isLast && <View style={styles.rowDivider} />}
  </TouchableOpacity>
);

// 6. Prediction Card (Type A - Binary)
const PredictionCardA = ({ item }: { item: any }) => {
     const size = 48;
     const strokeWidth = 4;
     const radius = (size - strokeWidth) / 2;
     const circumference = radius * 2 * Math.PI;
     const progress = (item.chance / 100) * circumference;
     const color = '#4ADE80'; 

     return (
        <View style={styles.predCard}>
             <View style={styles.predHeader}>
                 <Text style={styles.predQuestion}>{item.question}</Text>
                 <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        <Circle cx={size/2} cy={size/2} r={radius} stroke="#333" strokeWidth={strokeWidth} fill="transparent" />
                        <Circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="transparent" 
                                strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={circumference - progress}
                                strokeLinecap="round" rotation="-90" origin={`${size/2}, ${size/2}`} />
                    </Svg>
                    <View style={{ position: 'absolute', alignItems: 'center' }}>
                        <Text style={{ fontFamily: FONT_FAMILY.balance, fontWeight: '700', fontSize: 10, color: '#FFF' }}>{item.chance}%</Text>
                        <Text style={{ fontFamily: FONT_FAMILY.body, fontSize: 7, color: '#999' }}>Chance</Text>
                    </View>
                 </View>
             </View>

             <View style={styles.predActions}>
                 <TouchableOpacity style={[styles.predBtn, { backgroundColor: 'rgba(74, 222, 128, 0.15)' }]}>
                     <Text style={[styles.predBtnText, { color: '#4ADE80' }]}>Yes {item.yesPrice}</Text>
                 </TouchableOpacity>
                 <View style={{ width: 12 }} />
                 <TouchableOpacity style={[styles.predBtn, { backgroundColor: 'rgba(248, 113, 113, 0.15)' }]}>
                     <Text style={[styles.predBtnText, { color: '#F87171' }]}>No {item.noPrice}</Text>
                 </TouchableOpacity>
             </View>

             <View style={styles.predFooter}>
                 <Text style={styles.predVol}>{item.volume}</Text>
                 <Bookmark size={20} color="#666" />
             </View>
        </View>
     );
}

// 7. Prediction Card (Type B - Multi)
const PredictionCardB = ({ item }: { item: any }) => (
    <View style={styles.predCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
             <Image source={{ uri: 'https://i.pravatar.cc/100?u=grammy' }} style={{ width: 40, height: 40, borderRadius: 8, marginRight: 12 }} />
             <Text style={[styles.predQuestion, { flex: 1 }]}>{item.question}</Text>
        </View>
        
        <View style={{ marginTop: 16, marginBottom: 16, gap: 12 }}>
            {item.candidates.map((cand: any, idx: number) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: FONT_FAMILY.header, color: '#FFF', fontSize: 13 }}>{cand.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                         <Text style={{ fontFamily: FONT_FAMILY.balance, fontWeight: '700', color: '#FFF', fontSize: 13 }}>{cand.pct}</Text>
                         <View style={[styles.miniPill, { backgroundColor: 'rgba(74, 222, 128, 0.15)' }]}><Text style={{ color: '#4ADE80', fontSize: 10, fontWeight: '700' }}>Yes</Text></View>
                         <View style={[styles.miniPill, { backgroundColor: 'rgba(248, 113, 113, 0.15)' }]}><Text style={{ color: '#F87171', fontSize: 10, fontWeight: '700' }}>No</Text></View>
                    </View>
                </View>
            ))}
        </View>

        <View style={styles.predFooter}>
             <Text style={styles.predVol}>{item.volume}</Text>
             <Bookmark size={20} color="#666" />
        </View>
    </View>
);

// --- MAIN SCREEN ---
export const ExploreScreen = () => {
    const navigation = useNavigation<any>();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterType>('All');

    // Filtering Logic
    const filteredArtists = useMemo(() => {
         if (filter === 'Predictions') return [];
         if (!search) return TRENDING_ARTISTS;
         return TRENDING_ARTISTS.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
    }, [search, filter]);

    const filteredLabels = useMemo(() => {
        if (filter === 'Predictions') return [];
        if (!search) return POPULAR_LABELS;
        return POPULAR_LABELS.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
   }, [search, filter]);

    const filteredPredictions = useMemo(() => {
        if (filter === 'Artists') return [];
        let preds = TOP_PREDICTIONS;
        if (filter === 'Ending soon') {
            preds = [...preds].sort((a, b) => a.endTime.localeCompare(b.endTime));
        }
        if (search) {
            preds = preds.filter(p => p.question.toLowerCase().includes(search.toLowerCase()));
        }
        return preds;
    }, [search, filter]);
    

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                
                {/* Header (From Wallet) */}
                <View style={styles.header}>
                  <Text style={styles.greeting}>Good evening</Text>
                  <View style={styles.headerRight}>
                    <TouchableOpacity 
                      onPress={() => navigation.navigate('Updates')}
                      activeOpacity={0.7}
                    >
                      <View>
                        <Bell size={24} color={COLORS.text} />
                        <View style={styles.unreadDot} />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.7}>
                       <View style={[styles.headerIconContainer, styles.avatarContainer]}>
                         <Text style={{ fontSize: 20 }}>👻</Text>
                       </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Content */}
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* Search & Chips */}
                    <View style={{ paddingHorizontal: PX_16, marginBottom: 16 }}>
                         <SearchBar value={search} onChange={setSearch} />
                    </View>

                    <View style={{ marginBottom: 24 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: PX_16, gap: PX_8 }}>
                            {(['All', 'Artists', 'Predictions', 'Ending soon'] as FilterType[]).map(f => (
                                <FilterChip key={f} label={f} isActive={filter === f} onPress={() => setFilter(f)} />
                            ))}
                        </ScrollView>
                    </View>

                    {/* SECTION 1: ARTISTS */}
                    {filteredArtists.length > 0 && (
                        <View style={styles.section}>
                            <SectionHeader title="Trending Artists" />
                            <BigCard>
                                {filteredArtists.map((item, index) => (
                                    <EntityRow 
                                      key={item.id} 
                                      item={item} 
                                      isLast={index === filteredArtists.length - 1} 
                                      onPress={() => navigation.navigate('ArtistDetail', { artistId: item.id })}
                                    />
                                ))}
                            </BigCard>
                        </View>
                    )}

                    {/* SECTION 2: LABELS */}
                    {filteredLabels.length > 0 && (
                        <View style={styles.section}>
                            <SectionHeader title="Popular Record Labels" />
                            <BigCard>
                                {filteredLabels.map((item, index) => (
                                    <EntityRow 
                                      key={item.id} 
                                      item={item} 
                                      isLast={index === filteredLabels.length - 1} 
                                      onPress={() => navigation.navigate('LabelDetail', { labelId: item.id })} 
                                    />
                                ))}
                            </BigCard>
                        </View>
                    )}

                    {/* SECTION 3: PREDICTIONS */}
                    {filteredPredictions.length > 0 && (
                        <View style={styles.section}>
                             <SectionHeader title="Top Predictions" />
                             <View style={{ gap: PX_16 }}>
                                 {filteredPredictions.map(item => (
                                     item.type === 'binary' 
                                        ? <PredictionCardA key={item.id} item={item} /> 
                                        : <PredictionCardB key={item.id} item={item} />
                                 ))}
                             </View>
                        </View>
                    )}
                    
                    <View style={{ height: 100 }} /> 
                </ScrollView>

                <BottomNav activeTab="Explore" />
            </SafeAreaView>
        </View>
    );
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PX_16,
        paddingTop: 16,
        paddingBottom: 16, 
    },
    greeting: {
        fontFamily: FONT_FAMILY.balance,
        fontSize: 24,
        color: COLORS.text,
        letterSpacing: 0,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#181818',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    avatarContainer: {
        backgroundColor: '#181818',
        borderColor: '#333',
    },
    unreadDot: {
        position: 'absolute',
        top: -2,
        right: 0,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.error, 
    },
    scrollContent: {
        paddingTop: 0,
        paddingBottom: 80,
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
    chip: {
        height: 40, 
        paddingHorizontal: 16,
        borderRadius: LAYOUT.chipRadius,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    chipActive: {
        backgroundColor: '#FFF',
        borderColor: '#FFF',
    },
    chipInactive: {
        backgroundColor: '#111',
        borderColor: 'rgba(255,255,255,0.1)',
    },
    chipText: {
        fontFamily: FONT_FAMILY.header,
        fontSize: 13,
        fontWeight: '500',
    },
    chipTextActive: {
        color: '#000',
    },
    chipTextInactive: {
        color: '#FFF',
    },
    section: {
        marginBottom: LAYOUT.sectionSpacing,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: PX_16,
        marginBottom: PX_12,
        gap: 8,
    },
    sectionTitle: {
        fontFamily: FONT_FAMILY.header,
        fontSize: 20,
        color: '#FFF',
    },
    bigCard: {
        backgroundColor: '#111111',
        marginHorizontal: PX_16,
        borderRadius: 16,
        paddingHorizontal: PX_16, // FIXED: Only horizontal
        // padding: PX_16, removed
        overflow: 'hidden',
    },
    entityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16, // FIXED: Increased to 16
    },
    entityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    entityAvatar: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#222',
    },
    entityName: {
        fontFamily: FONT_FAMILY.header,
        fontSize: 16,
        color: '#FFF',
        marginBottom: 2,
    },
    entityVol: {
        fontFamily: FONT_FAMILY.body,
        fontSize: 12,
        color: 'rgba(255,255,255,0.45)',
    },
    entityRight: {
        alignItems: 'flex-end',
    },
    entityPrice: {
        fontFamily: FONT_FAMILY.balance,
        fontWeight: '700',
        fontSize: 16,
        color: '#FFF',
        marginBottom: 2,
    },
    entityChange: {
        fontFamily: FONT_FAMILY.balance,
        fontWeight: '700',
        fontSize: 12,
    },
    rowDivider: {
        position: 'absolute',
        bottom: 0,
        left: 60, 
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    // Prediction Cards
    predCard: {
        backgroundColor: '#111111',
        borderRadius: 16, 
        padding: 16,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    predHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    predQuestion: {
        flex: 1,
        fontFamily: FONT_FAMILY.header,
        fontSize: 16,
        color: '#FFF',
        marginRight: 16,
        lineHeight: 22,
    },
    predActions: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    predBtn: {
        flex: 1,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    predBtnText: {
        fontFamily: FONT_FAMILY.balance,
        fontWeight: '700',
        fontSize: 14,
    },
    predFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    predVol: {
        fontFamily: FONT_FAMILY.body,
        fontSize: 12,
        color: '#666',
    },
    miniPill: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    }
});
