import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { Share, Copy, Globe, Twitter, Instagram, Disc } from 'lucide-react-native';
import { TRENDING_ARTISTS } from '../data/explore'; // Reuse for demo
import { PX_16 } from '../constants/spacing';

const { width } = Dimensions.get('window');

// Reusing EntityRow logic for now, though we should probably put it in a common component
const ArtistRow = ({ item, isLast, onPress }: { item: any, isLast: boolean, onPress?: () => void }) => (
  <TouchableOpacity style={styles.entityRow} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.entityLeft}>
      <Image source={{ uri: item.avatar }} style={styles.entityAvatar} />
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

export const LabelDetailScreen = ({ route, navigation }: any) => {
    const { labelId } = route.params || {};
    const insets = useSafeAreaInsets();
    
    // MOCK DATA for Label
    const label = { 
        name: 'UMG', 
        ticker: '$UMG', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Universal_Music_Group.svg/1200px-Universal_Music_Group.svg.png',
        description: 'Universal Music Group N.V. is a Dutch-American multinational music corporation. UMG is the biggest music company in the world.',
        artists: TRENDING_ARTISTS.slice(0, 3) // Mock signed artists
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <View style={styles.headerLeft}>
                    <HeaderBack />
                    <View style={styles.logoContainer}>
                        <Image source={{ uri: label.logo }} style={styles.logo} resizeMode="contain" />
                    </View>
                    <View>
                        <Text style={styles.headerName}>{label.name}</Text>
                        <View style={styles.tickerRow}>
                            <Text style={styles.headerTicker}>{label.ticker}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity>
                       <Share size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.description}>{label.description}</Text>
                </View>

                {/* Socials */}
                <View style={styles.socialRow}>
                     <TouchableOpacity style={styles.socialIcon}><Globe size={20} color="#999" /></TouchableOpacity>
                     <TouchableOpacity style={styles.socialIcon}><Twitter size={20} color="#999" /></TouchableOpacity>
                     <TouchableOpacity style={styles.socialIcon}><Instagram size={20} color="#999" /></TouchableOpacity>
                </View>

                {/* Signed Artists */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Signed Artists</Text>
                    <View style={styles.artistCard}>
                        {label.artists.map((item, index) => (
                             <ArtistRow 
                                key={item.id} 
                                item={item} 
                                isLast={index === label.artists.length - 1} 
                                onPress={() => navigation.navigate('ArtistDetail', { artistId: item.id })}
                             />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#000',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  logoContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
  },
  logo: {
      width: 32,
      height: 32,
  },
  headerName: {
      fontFamily: FONT_FAMILY.header,
      fontSize: 16,
      color: '#FFF',
  },
  headerTicker: {
      fontFamily: FONT_FAMILY.mono,
      fontSize: 12,
      color: COLORS.primary,
  },
  tickerRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  content: {
      padding: 24,
  },
  section: {
      marginBottom: 32,
  },
  description: {
      fontFamily: FONT_FAMILY.body,
      fontSize: 14,
      color: '#CCC',
      lineHeight: 22,
  },
  socialRow: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 32,
  },
  socialIcon: {
      width: 40, 
      height: 40,
      borderRadius: 20,
      backgroundColor: '#111',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#333',
  },
  sectionTitle: {
      fontFamily: FONT_FAMILY.header,
      fontSize: 18,
      color: '#FFF',
      marginBottom: 16,
  },
  artistCard: {
      backgroundColor: '#111',
      borderRadius: 16,
      paddingHorizontal: 16, // FIXED
      // padding: 16 removed
  },
  entityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16, // FIXED
  },
  entityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  entityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#222',
  },
  entityName: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 15,
    color: '#FFF',
    marginBottom: 2,
  },
  entityVol: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
  },
  entityRight: {
    alignItems: 'flex-end',
  },
  entityPrice: {
    fontFamily: FONT_FAMILY.balance,
    fontWeight: '700',
    fontSize: 15,
    color: '#FFF',
    marginBottom: 2,
  },
  entityChange: {
    fontFamily: FONT_FAMILY.balance,
    fontWeight: '700',
    fontSize: 11,
  },
  rowDivider: {
    position: 'absolute',
    bottom: 0,
    left: 52, 
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
