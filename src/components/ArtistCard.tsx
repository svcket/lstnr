import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { Artist } from '../services/mockApi';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface ArtistCardProps {
  artist: Artist;
  onPress: () => void;
}

export const ArtistCard = ({ artist, onPress }: ArtistCardProps) => {
  const isPositive = artist.change >= 0;

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.container}>
        <Image source={{ uri: artist.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={styles.name}>{artist.name}</Text>
            {artist.verified && <View style={styles.verified} />}
          </View>
          <Text style={styles.bio} numberOfLines={1}>{artist.bio}</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.price}>${artist.sharePrice.toFixed(2)}</Text>
          <View style={styles.changeContainer}>
            {isPositive ? <TrendingUp size={12} color={COLORS.success} /> : <TrendingDown size={12} color={COLORS.error} />}
            <Text style={[styles.change, { color: isPositive ? COLORS.success : COLORS.error }]}>
              {Math.abs(artist.change)}%
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.m,
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZE.m,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  verified: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    marginLeft: 6,
  },
  bio: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  stats: {
    alignItems: 'flex-end',
  },
  price: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.m,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  change: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
});
