import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONT_FAMILY, SPACING, FONT_SIZE } from '../../constants/theme';

interface ShareRowProps {
  artistName: string;
  avatarUrl?: string;
  sharesOwned: string; // e.g. "120 shares"
  value: string; // e.g. "$1,840"
  change: string; // e.g. "+6.3%"
  isPositive?: boolean;
}

export const ShareRow = ({ 
  artistName, 
  avatarUrl, 
  sharesOwned, 
  value, 
  change, 
  isPositive = true 
}: ShareRowProps) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
         {avatarUrl ? (
             <Image source={{ uri: avatarUrl }} style={styles.avatar} />
         ) : (
             <View style={[styles.avatar, styles.placeholder]} />
         )}
      </View>

      {/* Main Info */}
      <View style={styles.content}>
        <View style={styles.left}>
            <Text style={styles.name}>{artistName}</Text>
            <Text style={styles.shares}>{sharesOwned}</Text>
        </View>

        <View style={styles.right}>
            <Text style={styles.value}>{value}</Text>
            <Text style={[styles.change, { color: isPositive ? COLORS.success : COLORS.error }]}>
                {change}
            </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12, // Keep vertical rhythm
    paddingHorizontal: 16, // Standard 16px alignment
  },
  avatarContainer: {
    marginRight: 12, // Slightly tighter
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  placeholder: {
    backgroundColor: '#333',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    gap: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  name: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
    color: COLORS.text,
  },
  shares: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  value: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
    color: COLORS.text,
  },
  change: {
    fontFamily: FONT_FAMILY.body, // Use body font for percentages to avoid heavy look
    fontSize: 13,
  },
});
