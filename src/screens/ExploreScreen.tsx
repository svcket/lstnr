import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { PX_16, PX_8, PX_12, PX_24, LAYOUT } from '../constants/spacing';
import { ICONS } from '../constants/assets';
import { BottomNav } from '../components/home/BottomNav';
// import { TRENDING_ARTISTS, POPULAR_LABELS, TOP_PREDICTIONS } from '../data/explore'; // REMOVED
import { getAllArtists, getAllLabels, getAllPredictions } from '../data/catalog';
import { getEntityMetrics } from '../lib/mockMetrics';
import { EntityRow } from '../components/common/EntityRow';
import { PredictionCard } from '../components/artist/PredictionCard'; // Unified Card
import { Search, ChevronRight, Bookmark, Bell } from 'lucide-react-native';
import Svg, { Circle, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

// --- TYPES ---
type FilterType = 'All' | 'Artists' | 'Labels' | 'Predictions' | 'Ending soon';

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
const SectionHeader = ({ title, onPress }: { title: string, onPress?: () => void }) => (
  <TouchableOpacity style={styles.sectionHeader} activeOpacity={0.7} onPress={onPress}>
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



// 6. Prediction Card A/B Removed (Using shared PredictionCard)

// --- MAIN SCREEN ---
// --- MAIN SCREEN ---
export const ExploreScreen = () => {
    const navigation = useNavigation<any>();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterType>('All');

    // Dynamic Greeting
    // Dynamic Greeting
    const [langIndex, setLangIndex] = useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setLangIndex(prev => (prev + 1) % 6); 
        }, 20000); 
        return () => clearInterval(interval);
    }, []);

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        const timeOfDay = (hour >= 5 && hour < 12) ? 'morning' : (hour >= 12 && hour < 17) ? 'afternoon' : 'evening';
        
        const greetings = [
            { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' }, // EN
            { morning: 'Buenos días', afternoon: 'Buenas tardes', evening: 'Buenas noches' }, // ES
            { morning: 'Bonjour', afternoon: 'Bon après-midi', evening: 'Bonsoir' }, // FR
            { morning: 'Guten Morgen', afternoon: 'Guten Tag', evening: 'Guten Abend' }, // DE
            { morning: 'おはよう', afternoon: 'こんにちは', evening: 'こんばんは' }, // JP
            { morning: 'Buongiorno', afternoon: 'Buon pomeriggio', evening: 'Buonasera' }, // IT
        ];
        
        const lang = greetings[langIndex % greetings.length];
        return lang[timeOfDay];
    }, [langIndex]);

    // Data Sources
    const allArtists = getAllArtists();
    const allLabels = getAllLabels();
    const allPredictions = getAllPredictions();

    // Helper to format currency
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    // Filtering Logic
    const filteredArtists = useMemo(() => {
         if (filter === 'Predictions') return [];
         let results = allArtists;
         if (search) results = results.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
         return results;
    }, [search, filter, allArtists]);

    const filteredLabels = useMemo(() => {
        if (filter === 'Predictions') return [];
        let results = allLabels;
        if (search) results = results.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
        return results;
   }, [search, filter, allLabels]);

    const filteredPredictions = useMemo(() => {
        if (filter === 'Artists') return [];
        let preds = allPredictions;
        if (filter === 'Ending soon') {
            preds = [...preds].sort((a, b) => a.deadline.localeCompare(b.deadline));
        }
        if (search) {
            preds = preds.filter(p => p.question.toLowerCase().includes(search.toLowerCase()));
        }
        return preds;
    }, [search, filter, allPredictions]);
    

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                
                {/* Header (From Wallet) */}
                <View style={styles.header}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 24, marginRight: 4 }}>👋🏾</Text>
                      <View style={{ height: 32, width: 220, justifyContent: 'center' }}>
                          <Svg height="32" width="100%">
                              <Defs>
                                  <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                                      <Stop offset="0" stopColor="#C99315" stopOpacity="1" />
                                      <Stop offset="1" stopColor="#F53636" stopOpacity="1" />
                                  </LinearGradient>
                              </Defs>
                              <SvgText
                                  fill="url(#grad)"
                                  fontSize="24"
                                  fontWeight="600"
                                  fontFamily={FONT_FAMILY.balance}
                                  x="0"
                                  y="24"
                              >
                                  {greeting}!
                              </SvgText>
                          </Svg>
                      </View>
                  </View>
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
                            {(['All', 'Artists', 'Labels', 'Predictions', 'Ending soon'] as FilterType[]).map(f => (
                                <FilterChip 
                                    key={f} 
                                    label={f} 
                                    isActive={filter === f} 
                                    onPress={() => {
                                        if (f === 'Artists') {
                                            navigation.navigate('Artists');
                                        } else if (f === 'Labels') {
                                            navigation.navigate('Labels');
                                        } else if (f === 'Predictions') {
                                            navigation.navigate('Predictions');
                                        } else if (f === 'Ending soon') {
                                            navigation.navigate('EndingSoon');
                                        } else {
                                            setFilter(f);
                                        }
                                    }} 
                                />
                            ))}
                        </ScrollView>
                    </View>

                    {/* SECTION 1: ARTISTS */}
                    {filteredArtists.length > 0 && (
                        <View style={styles.section}>
                            <SectionHeader 
                                title="Trending Artists" 
                                onPress={() => navigation.navigate('TrendingArtists')}
                            />
                            <BigCard>
                                {filteredArtists.slice(0, 6).map((artist, index, arr) => {
                                    const metrics = getEntityMetrics(artist.id);
                                    return (
                                    <EntityRow 
                                      key={artist.id} 
                                      name={artist.name}
                                      avatarUrl={artist.avatarUrl}
                                      symbol={artist.symbol}
                                      price={formatCurrency(metrics.price)}
                                      changePct={metrics.changeTodayPct}
                                      volume={formatCompact(metrics.volume24h)}
                                      isLast={index === arr.length - 1} 
                                      onPress={() => navigation.navigate('ArtistDetail', { artistId: artist.id })}
                                    />
                                )})}
                            </BigCard>
                        </View>
                    )}

                    {/* SECTION 2: LABELS */}
                    {filteredLabels.length > 0 && (
                        <View style={styles.section}>
                            <SectionHeader 
                                title="Popular Record Labels" 
                                onPress={() => navigation.navigate('PopularLabels')}
                            />
                            <BigCard>
                                {filteredLabels.slice(0, 6).map((label, index, arr) => {
                                    const metrics = getEntityMetrics(label.id);
                                    return (
                                    <EntityRow 
                                      key={label.id} 
                                      name={label.name}
                                      avatarUrl={label.avatarUrl}
                                      symbol={label.symbol}
                                      price={formatCurrency(metrics.price)} // Using Price for consistency, could be MCap
                                      changePct={metrics.changeTodayPct}
                                      volume={formatCompact(metrics.volume24h)}
                                      isLast={index === arr.length - 1} 
                                      onPress={() => navigation.navigate('LabelDetail', { labelId: label.id })} 
                                    />
                                )})}
                            </BigCard>
                        </View>
                    )}

                    {/* SECTION 3: PREDICTIONS */}
                    {filteredPredictions.length > 0 && (
                        <View style={styles.section}>
                             <SectionHeader 
                                title="Top Predictions" 
                                onPress={() => navigation.navigate('TopPredictions')}
                             />
                             {/* Gutter 16px enforced via padding. Spacing handled by card component margin (will set to 12px) */}
                             <View style={{ paddingHorizontal: PX_16, gap: 12 }}>
                                 {filteredPredictions.map(item => (
                                     <PredictionCard key={item.id} prediction={item} />
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

// Helper for volume formatting
const formatCompact = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
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
        fontWeight: '600', // Semibold weight
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
        fontFamily: FONT_FAMILY.medium, // Explicit Medium
        fontSize: 13,
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
        marginBottom: 16, // Enforce 16px spacing from header to content
        gap: 8,
    },
    sectionTitle: {
        fontFamily: FONT_FAMILY.medium, // Explicit Medium
        fontSize: 20,
        color: '#FFF',
    },
    bigCard: {
        backgroundColor: '#111111',
        marginHorizontal: PX_16,
        borderRadius: 16,
        paddingHorizontal: PX_16, 
        overflow: 'hidden',
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
        fontFamily: FONT_FAMILY.medium, // Explicit Medium
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
