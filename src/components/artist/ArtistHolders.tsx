import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { 
    getHolders, 
    Holder, 
    MIN_SHARES_FOR_CHAT 
} from '../../data/social';
import { checkAccess } from '../../lib/permissions';
import { Lock, MessageCircle } from 'lucide-react-native';

const GAP = 8;

interface ArtistHoldersProps {
  entityId?: string;
  initialViewMode?: any; 
}

export const ArtistHolders = ({ entityId = 'a1' }: ArtistHoldersProps) => {
  const navigation = useNavigation<any>();
  const [holders, setHolders] = useState<Holder[]>([]);
  const [userShares, setUserShares] = useState(0);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
      setHolders(getHolders(entityId));
      const accessInfo = checkAccess('me', entityId);
      setUserShares(accessInfo.shares);
      setHasAccess(accessInfo.canRead);
  }, [entityId]);

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
                       : `Hold at least ${MIN_SHARES_FOR_CHAT} shares to join.`}
                 </Text>
                 <TouchableOpacity 
                    style={[styles.promoBtn, !hasAccess && styles.promoBtnLocked]}
                    onPress={() => {
                        if (hasAccess) {
                            navigation.navigate('HoldersChat', { entityId });
                        } else {
                            console.log('Open Trade Sheet');
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

        <Text style={styles.sectionTitle}>Top Holders</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={holders}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <HolderItem holder={item} rank={index + 1} />}
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

const HolderItem = ({ holder, rank }: { holder: Holder; rank: number }) => (
    <View style={styles.holderRow}>
        <Text style={styles.rank}>#{rank}</Text>
        <Image source={{ uri: holder.avatar }} style={styles.avatar} />
        
        <View style={styles.holderInfo}>
            <Text style={styles.holderName}>{holder.name}</Text>
            <Text style={styles.sharesText}>{holder.shares.toLocaleString()} shares</Text>
        </View>
        
        <View style={styles.holderStats}>
            <Text style={styles.valueText}>${holder.value?.toLocaleString()}</Text>
            {holder.percent && <Text style={styles.percentText}>{holder.percent.toFixed(2)}%</Text>}
        </View>
    </View>
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

  sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#666',
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 1,
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
});
