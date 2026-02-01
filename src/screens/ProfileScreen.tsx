import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, FONT_FAMILY } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { Settings, Share2, Pencil } from 'lucide-react-native'; 
import { getUserProfile, HolderProfile, HoldingPosition } from '../utils/holdingResolvers';
import { HeaderBack } from '../components/common/HeaderBack';
import { HolderRow } from '../components/common/HolderRow';

const USER_AVATAR = require('../../assets/user_avatar.png');

const { width } = Dimensions.get('window');

// --- Components ---

const StatItem = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.statItem}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

// --- Screen ---

export const ProfileScreen = ({ navigation }: any) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<HolderProfile | null>(null);

    useEffect(() => {
        if (user) {
            const data = getUserProfile(user.id, user.name, user.avatar);
            setProfile(data);
        }
    }, [user]);

    // Derived from profile or user object
    const followers = user?.followers?.toLocaleString() || '0';
    const following = user?.following?.toLocaleString() || '0';
    const portfolioValue = profile ? `$${Math.floor(profile.stats.totalValue).toLocaleString()}` : '-';

    if (!user || !profile) return null;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            
            {/* Top Bar */}
            <View style={styles.topBar}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <HeaderBack /> 
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>
                <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('SettingsHome')}>
                    <Settings size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <Image source={USER_AVATAR} style={styles.avatar} />
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.handle}>{user.handle}</Text>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <StatItem label="Followers" value={followers} />
                        <View style={styles.statDivider} />
                        <StatItem label="Following" value={following} />
                        <View style={styles.statDivider} />
                        <StatItem label="Portfolio Value" value={portfolioValue} />
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity 
                            style={styles.actionBtn}
                            onPress={() => navigation.navigate('ManageProfile')}
                        >
                            <Pencil size={18} color={COLORS.white} style={{ marginRight: 8 }} />
                            <Text style={styles.actionBtnText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Share2 size={18} color={COLORS.white} style={{ marginRight: 8 }} />
                            <Text style={styles.actionBtnText}>Share Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Watchlist Section */}
                <View style={styles.watchlistContainer}>
                    <Text style={styles.sectionTitle}>Watchlist</Text>
                    
                    <View style={styles.card}>
                        {profile.positions.length > 0 ? (
                            profile.positions.map((pos, index) => (
                                <HolderRow 
                                    key={pos.id} 
                                    item={{
                                        id: pos.entityId,
                                        name: pos.entityTitle,
                                        avatar: '', 
                                        shares: pos.shares,
                                        value: pos.value,
                                        percent: pos.pnlPercent || 0,
                                        _side: pos.outcomeSide 
                                    } as any}
                                    context={{
                                        type: pos.entityType === 'SHARE' ? 'ARTIST' : pos.entityType,
                                        entityId: pos.entityId,
                                        name: pos.entityTitle,
                                        ticker: pos.entitySymbol,
                                        // @ts-ignore
                                        side: pos.outcomeSide
                                    }}
                                    isLast={index === profile.positions.length - 1}
                                />
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No items in watchlist</Text>
                            </View>
                        )}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.m, // HeaderBack has internal padding
      paddingVertical: SPACING.s,
  },
  headerTitle: {
     fontSize: 20,
     fontFamily: FONT_FAMILY.header,
     fontWeight: 'bold',
     color: COLORS.white, 
  },
  settingsBtn: {
      padding: 8,
  },
  content: {
      paddingBottom: SPACING.xl,
      paddingTop: 10,
  },
  profileHeader: {
      alignItems: 'center',
      paddingHorizontal: SPACING.l,
      marginBottom: SPACING.xl,
  },
  avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: SPACING.m,
      borderWidth: 2,
      borderColor: '#333',
  },
  name: {
      color: COLORS.text,
      fontSize: 20,
      fontFamily: FONT_FAMILY.header,
      fontWeight: 'bold',
      marginBottom: 4,
  },
  handle: {
      color: COLORS.textSecondary,
      fontSize: 14,
      marginBottom: SPACING.l,
  },
  statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.l,
      width: '100%',
  },
  statItem: {
      alignItems: 'center',
      paddingHorizontal: SPACING.m,
  },
  statValue: {
      color: COLORS.text,
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: FONT_FAMILY.header,
      marginBottom: 2,
  },
  statLabel: {
      color: '#888',
      fontSize: 12,
  },
  statDivider: {
      width: 1,
      height: 24,
      backgroundColor: '#333',
  },
  actionButtons: {
      flexDirection: 'row',
      gap: 12,
  },
  actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#222',
      height: 56, // Updated to 56px as requested
      paddingHorizontal: 24,
      borderRadius: 28, // Fully rounded
      borderWidth: 1,
      borderColor: '#333',
  },
  actionBtnText: {
      color: COLORS.text,
      fontSize: 14,
      fontWeight: '600',
  },
  watchlistContainer: {
      paddingHorizontal: SPACING.l,
  },
  sectionTitle: {
      color: COLORS.text,
      fontSize: 18,
      fontFamily: FONT_FAMILY.header,
      fontWeight: 'bold',
      marginBottom: 12,
  },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        overflow: 'hidden',
    },
    emptyState: {
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: '#666',
        fontStyle: 'italic',
    },
});
