import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { 
    getHolders, 
    getPredictionHolders,
    Holder, 
    MIN_SHARES_FOR_CHAT 
} from '../../data/social';
import { getHoldingPosition } from '../../utils/holdingResolvers';
import { checkAccess } from '../../lib/permissions';
import { Lock, MessageCircle } from 'lucide-react-native';
import { getEntityMetrics } from '../../lib/mockMetrics';

const GAP = 8;

interface ArtistHoldersProps {
  entityId?: string;
  type?: 'ARTIST' | 'LABEL' | 'PREDICTION';
  initialViewMode?: any; 
  onJoinPress?: () => void;
}

export const ArtistHolders = ({ entityId = 'a1', type = 'ARTIST', onJoinPress }: ArtistHoldersProps) => {
  const navigation = useNavigation<any>();
  const [holders, setHolders] = useState<Holder[]>([]);
  const [userShares, setUserShares] = useState(0);
  const [hasAccess, setHasAccess] = useState(false);
  const [joinCost, setJoinCost] = useState(0);

  const [predictionHolders, setPredictionHolders] = useState<{yes: Holder[], no: Holder[]}>({yes: [], no: []});

  useEffect(() => {
    if (type === 'PREDICTION') {
        setPredictionHolders(getPredictionHolders(entityId));
    } else {
        setHolders(getHolders(entityId));
    }
    const accessInfo = checkAccess('me', entityId);
    setUserShares(accessInfo.shares);
    setHasAccess(accessInfo.canRead);

    // Calculate Entry Cost
    const metrics = getEntityMetrics(entityId);
    if (metrics) {
        const cost = metrics.price * MIN_SHARES_FOR_CHAT;
        setJoinCost(cost);
    }
  }, [entityId, type]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
        {/* Metrics Grid (2x2) */}
        <View style={styles.metricsContainer}>
            <View style={styles.metricsRow}>
                <MetricCard label="Total Holders" value={(holders.length * 124).toLocaleString()} />
                <MetricCard label="Top Holder %" value="12.5%" />
            </View>
            <View style={styles.metricsRow}>
                <MetricCard label="Avg Buy Price" value="$0.42" />
                <MetricCard label="Circulating" value="240k" />
            </View>
        </View>

        {/* Chat Promo Card */}
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
                       : `You need ${MIN_SHARES_FOR_CHAT} shares to access chat.`}
                 </Text>
                 <TouchableOpacity 
                    style={[
                        styles.promoBtn, 
                        hasAccess && styles.promoBtnSecondary,
                        !hasAccess && styles.promoBtnPrimary
                    ]}
                    onPress={() => {
                        if (hasAccess) {
                            navigation.navigate('HoldersChat', { entityId });
                        } else {
                            if (onJoinPress) onJoinPress();
                        }
                    }}
                 >
                     <Text style={[
                         styles.promoBtnText, 
                         hasAccess ? styles.promoBtnTextSecondary : styles.promoBtnTextPrimary
                     ]}>
                         {hasAccess ? 'Open Chat' : 'Join Chat'}
                     </Text>
                     {!hasAccess && <Lock size={14} color="#000" style={{marginLeft: 6}} />}
                 </TouchableOpacity>
            </View>
        </View>

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Holders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Holders', { entityId, type })}>
                <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
        </View>
    </View>
  );

  if (type === 'PREDICTION') {
      return (
        <View style={styles.container}>
            <View style={styles.splitHeader}>
                <View style={{flex: 1}}>
                    <Text style={styles.splitTitle}>Yes holders</Text>
                </View>
                <View style={{flex: 1, paddingLeft: 16}}>
                    <Text style={styles.splitTitle}>No holders</Text>
                </View>
            </View>
            
            <View style={{ flexDirection: 'row' }}>
                {/* YES Column */}
                <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.05)', paddingRight: 8 }}>
                    {predictionHolders.yes.slice(0, 10).map((h, i) => (
                        <HolderItem 
                            key={h.id} 
                            holder={h} 
                            rank={0} 
                            compact 
                            side="YES"
                            onPress={() => {
                                const position = getHoldingPosition(h, { type, entityId, name: 'Prediction', side: 'YES' });
                                navigation.navigate('HoldingDetails', { position });
                            }}
                        />
                    ))}
                </View>
                {/* NO Column */}
                <View style={{ flex: 1, paddingLeft: 16 }}>
                    {predictionHolders.no.slice(0, 10).map((h, i) => (
                        <HolderItem 
                            key={h.id} 
                            holder={h} 
                            rank={0} 
                            compact 
                            side="NO"
                            onPress={() => {
                                const position = getHoldingPosition(h, { type, entityId, name: 'Prediction', side: 'NO' });
                                navigation.navigate('HoldingDetails', { position });
                            }}
                        />
                    ))}
                </View>
            </View>

            <TouchableOpacity 
                style={styles.seeAllBtn} 
                onPress={() => navigation.navigate('Holders', { entityId, type })}
            >
                <Text style={styles.seeAll}>See All Holders</Text>
            </TouchableOpacity>
        </View>
      );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={holders}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
            <HolderItem 
                holder={item} 
                rank={index + 1} 
                onPress={() => {
                   const position = getHoldingPosition(item, { type, entityId, name: 'Loading...' }); // name might be fetched async or missing in this scope, but it's acceptable for now as resolver handles it.
                   navigation.navigate('HoldingDetails', { position });
                }}
            />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false} 
      />
    </View>
  );
};

const MetricCard = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const HolderItem = ({ holder, rank, compact, onPress, side }: { holder: Holder; rank: number; compact?: boolean; onPress?: () => void; side?: 'YES' | 'NO' }) => (
    <TouchableOpacity 
        style={[styles.holderRow, compact && styles.holderRowCompact]}
        activeOpacity={0.7}
        onPress={onPress}
        disabled={!onPress}
    >
        {rank > 0 && <Text style={styles.rank}>#{rank}</Text>}
        <Image source={{ uri: holder.avatar }} style={styles.avatar} />
        
        <View style={styles.holderInfo}>
            <Text style={[styles.holderName, compact && {fontSize: 13}]}>{holder.name}</Text>
            <Text style={[
                styles.sharesText, 
                compact && {fontSize: 11},
                side === 'YES' && { color: COLORS.success }, // Green for YES
                side === 'NO' && { color: COLORS.error }      // Red for NO
            ]}>
                {(holder as any)._side ? `${(holder as any)._side} ` : ''}{holder.shares.toLocaleString()} shares
            </Text>
        </View>
        
        {!compact && (
            <View style={styles.holderStats}>
                <Text style={styles.valueText}>${holder.value?.toLocaleString()}</Text>
                {holder.percent && <Text style={styles.percentText}>{holder.percent.toFixed(2)}%</Text>}
            </View>
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
      // Removed top padding to defer to parent
  },
  listContent: {
      paddingBottom: 40,
  },
  headerContainer: {
      marginBottom: 8,
      // Removed paddingHorizontal to defer to parent
  },
  // Metrics
  metricsContainer: {
      marginBottom: 24,
      gap: 8,
  },
  metricsRow: {
      flexDirection: 'row',
      gap: 8,
  },
  metricCard: {
      flex: 1, // Adapts to parent width
      backgroundColor: '#111',
      borderRadius: 12,
      padding: 16,
      justifyContent: 'center',
  },
  metricLabel: {
      color: '#999',
      fontFamily: FONT_FAMILY.header, 
      fontSize: 12,
  },
  metricValue: {
      color: '#FFF',
      fontFamily: FONT_FAMILY.header,
      fontWeight: '700', 
      fontSize: 14, 
      marginBottom: 4,
  },

  // Promo Card
  promoCard: {
      backgroundColor: '#111',
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
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
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
  },
  promoBtnPrimary: {
      backgroundColor: '#FFF',
  },
  promoBtnSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#FFF',
  },
  promoBtnText: {
      fontSize: 13,
      fontWeight: '600',
      fontFamily: FONT_FAMILY.header,
  },
  promoBtnTextPrimary: {
      color: '#000',
  },
  promoBtnTextSecondary: {
      color: '#FFF',
  },

  sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#666',
      letterSpacing: 1,
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
  },
  seeAll: {
      fontSize: 12,
      fontFamily: FONT_FAMILY.header,
      color: COLORS.primary,
      fontWeight: '600',
  },

  // Holder Row
  holderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
      // Removed paddingHorizontal
  },
  rank: {
      width: 30,
      fontSize: 12,
      color: '#666',
      fontFamily: FONT_FAMILY.body,
  },
  avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
      backgroundColor: '#333',
  },
  holderInfo: {
      flex: 1,
  },
  holderName: {
      fontSize: 15,
      color: '#FFF',
      fontFamily: FONT_FAMILY.header,
      marginBottom: 2,
  },
  sharesText: {
      fontSize: 13,
      color: '#999',
  },
  holderStats: {
      alignItems: 'flex-end',
  },
  valueText: {
      fontSize: 14,
      color: '#FFF',
      fontWeight: '600',
      marginBottom: 2,
  },
  percentText: {
      fontSize: 12,
      color: COLORS.success, 
  },
  splitHeader: {
      flexDirection: 'row',
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#222',
      paddingBottom: 8,
  },
  splitTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFF',
  },
  holderRowCompact: {
      paddingVertical: 8,
      borderBottomWidth: 0,
  },
  seeAllBtn: {
      alignItems: 'center',
      paddingVertical: 16,
      marginTop: 8,
  }
});
