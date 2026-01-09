import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Copy, Eye, Share } from 'lucide-react-native';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../../constants/theme';
import { HeaderBack } from '../common/HeaderBack';

interface ArtistHeaderProps {
  name: string;
  ticker: string;
  avatar: string;
}

export const ArtistHeader = ({ name, ticker, avatar }: ArtistHeaderProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <HeaderBack />
      
      <View style={styles.identity}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.tickerRow}>
               <Text style={styles.ticker}>{ticker}</Text>
               <Copy size={12} color="#9A9A9A" />
            </View>
        </View>
      </View>
      
      <View style={styles.rightActions}>
        <Eye size={24} color={COLORS.white} />
        <Share size={24} color={COLORS.white} />
      </View> 
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#000',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
  },
  name: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
    color: '#FFF',
    lineHeight: 20,
  },
  ticker: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
    color: '#9A9A9A',
    lineHeight: 16,
  },
  tickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  }
});
