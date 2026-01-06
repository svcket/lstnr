import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_FAMILY, SPACING, FONT_SIZE } from '../../constants/theme';

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
  amount?: string;
}

interface ActivityListProps {
  data: ActivityItem[];
}

export const ActivityList = ({ data }: ActivityListProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent activity</Text>
      {data.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.left}>
            <Text style={styles.actionText}>{item.text}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          {item.amount && (
            <Text style={styles.amountText}>{item.amount}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.l,
    paddingHorizontal: SPACING.l,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.header,
    fontSize: FONT_SIZE.l,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  left: {
    flex: 1,
    paddingRight: SPACING.m,
  },
  actionText: {
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZE.m,
    color: COLORS.text,
    marginBottom: 4,
  },
  timeText: {
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZE.s,
    color: COLORS.textSecondary,
  },
  amountText: {
    fontFamily: FONT_FAMILY.header, // Oswald for numbers
    fontSize: FONT_SIZE.m,
    color: COLORS.text,
  },
});
