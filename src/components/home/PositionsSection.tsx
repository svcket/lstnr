import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';

interface PositionBase {
  id: string;
  value: string;
}

interface SharePosition extends PositionBase {
  type: 'share';
  artistName: string;
  shares: string;
  change: string;
}

interface PredictionPosition extends PositionBase {
  type: 'prediction';
  title: string;
  side: string;
  status: string;
}

interface PositionsSectionProps {
  title: string;
  items: (SharePosition | PredictionPosition)[];
}

export const PositionsSection = ({ title, items }: PositionsSectionProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.list}>
        {items.map((item, index) => (
          <TouchableOpacity key={item.id} style={styles.row} activeOpacity={0.7}>
            {item.type === 'share' ? (
              <>
                <View style={styles.avatarPlaceholder} />
                <View style={styles.info}>
                  <Text style={styles.primaryText}>{item.artistName}</Text>
                  <Text style={styles.secondaryText}>{item.shares} shares</Text>
                </View>
                <View style={styles.values}>
                  <Text style={styles.valueText}>{item.value}</Text>
                  <Text style={styles.changeText}>{item.change}</Text>
                </View>
              </>
            ) : (
              <>
                <View style={[styles.avatarPlaceholder, { backgroundColor: '#222', borderRadius: 8 }]}>
                   <Text style={{color: '#444', fontSize: 10, fontFamily: FONT_FAMILY.header}}>PRED</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.primaryText} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.secondaryText}>Position: {item.side}</Text>
                </View>
                <View style={styles.values}>
                  <Text style={styles.valueText}>{item.value}</Text>
                  <Text style={[styles.changeText, { color: COLORS.textSecondary }]}>{item.status}</Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SPACING.m,
    textTransform: 'uppercase',
  },
  list: {
    backgroundColor: '#111111',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.m,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: SPACING.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginRight: SPACING.m,
  },
  primaryText: {
    fontFamily: FONT_FAMILY.header, // Oswald
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 2,
  },
  secondaryText: {
    fontFamily: FONT_FAMILY.header, // Oswald
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  values: {
    alignItems: 'flex-end',
  },
  valueText: {
    fontFamily: FONT_FAMILY.header, // Oswald
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 2,
  },
  changeText: {
    fontFamily: FONT_FAMILY.header, // Oswald
    fontSize: 12,
    color: COLORS.success,
  },
});
