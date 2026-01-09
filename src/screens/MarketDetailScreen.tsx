import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { Market } from '../services/mockApi';
import { Clock } from 'lucide-react-native';
import { HeaderBack } from '../components/common/HeaderBack';

export const MarketDetailScreen = ({ route, navigation }: any) => {
  const { market } = route.params as { market: Market };

  const handleBet = (type: 'YES' | 'NO') => {
     Alert.alert(`Buy ${type}`, `Purchase ${type} shares at $${type === 'YES' ? market.yesPrice : market.noPrice}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => console.log(`Bought ${type}`) }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
       <View style={styles.header}>
        <HeaderBack />
        <Text style={styles.headerTitle}>Market</Text>
        <TouchableOpacity style={styles.iconBtn} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: market.status === 'OPEN' ? COLORS.success : COLORS.textSecondary }]}>
                <Text style={styles.statusText}>{market.status}</Text>
            </View>
            <View style={styles.timeRow}>
                <Clock size={16} color={COLORS.textSecondary} />
                <Text style={styles.timeText}>Ends {new Date(market.endsAt).toLocaleDateString()}</Text>
            </View>
        </View>

        <Text style={styles.question}>{market.question}</Text>
        
        <View style={styles.oddsBox}>
            <View style={styles.oddRow}>
                <Text style={styles.oddLabel}>YES</Text>
                <Text style={[styles.oddValue, { color: COLORS.success }]}>{Math.round(market.yesPrice * 100)}%</Text>
            </View>
            <View style={[styles.barContainer, { marginBottom: SPACING.m }]}>
                 <View style={[styles.bar, { width: `${market.yesPrice * 100}%`, backgroundColor: COLORS.success }]} />
            </View>

            <View style={styles.oddRow}>
                <Text style={styles.oddLabel}>NO</Text>
                <Text style={[styles.oddValue, { color: COLORS.error }]}>{Math.round(market.noPrice * 100)}%</Text>
            </View>
            <View style={styles.barContainer}>
                 <View style={[styles.bar, { width: `${market.noPrice * 100}%`, backgroundColor: COLORS.error }]} />
            </View>
        </View>

        <Text style={styles.volume}>Volume: ${market.volume.toLocaleString()}</Text>

        <View style={styles.rules}>
            <Text style={styles.rulesTitle}>Rules</Text>
            <Text style={styles.rulesText}>
                Market resolves to YES if the criteria are met by the resolution date. 
                Source of truth: Billboard Charts and Official Announcements.
            </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
         <TouchableOpacity style={[styles.actionBtn, styles.noBtn]} onPress={() => handleBet('NO')}>
            <Text style={styles.btnText}>Buy NO ${market.noPrice.toFixed(2)}</Text>
         </TouchableOpacity>
         <TouchableOpacity style={[styles.actionBtn, styles.yesBtn]} onPress={() => handleBet('YES')}>
            <Text style={[styles.btnText, { color: COLORS.background }]}>Buy YES ${market.yesPrice.toFixed(2)}</Text>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
      color: COLORS.text,
      fontSize: FONT_SIZE.m,
      fontWeight: 'bold',
  },
  iconBtn: {
      padding: SPACING.s,
      width: 40,
  },
  content: {
      padding: SPACING.l,
  },
  statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SPACING.m,
  },
  statusBadge: {
      paddingHorizontal: SPACING.m,
      paddingVertical: 4,
      borderRadius: BORDER_RADIUS.s,
  },
  statusText: {
      color: COLORS.background,
      fontWeight: 'bold',
      fontSize: FONT_SIZE.xs,
  },
  timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
  },
  timeText: {
      color: COLORS.textSecondary,
      fontSize: FONT_SIZE.xs,
  },
  question: {
      color: COLORS.text,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: SPACING.xl,
      lineHeight: 32,
  },
  oddsBox: {
      backgroundColor: COLORS.surface,
      padding: SPACING.l,
      borderRadius: BORDER_RADIUS.l,
      marginBottom: SPACING.l,
  },
  oddRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SPACING.xs,
  },
  oddLabel: {
      color: COLORS.text,
      fontWeight: 'bold',
      fontSize: FONT_SIZE.m,
  },
  oddValue: {
      fontWeight: 'bold',
      fontSize: FONT_SIZE.m,
  },
  barContainer: {
      height: 8,
      backgroundColor: COLORS.background,
      borderRadius: BORDER_RADIUS.full,
      overflow: 'hidden',
  },
  bar: {
      height: '100%',
  },
  volume: {
      color: COLORS.textSecondary,
      fontSize: FONT_SIZE.s,
      textAlign: 'center',
      marginBottom: SPACING.l,
  },
  rules: {
      marginTop: SPACING.m,
  },
  rulesTitle: {
      color: COLORS.text,
      fontWeight: 'bold',
      fontSize: FONT_SIZE.m,
      marginBottom: SPACING.s,
  },
  rulesText: {
      color: COLORS.textSecondary,
      fontSize: FONT_SIZE.s,
      lineHeight: 20,
  },
  footer: {
      padding: SPACING.m,
      flexDirection: 'row',
      gap: SPACING.m,
      borderTopWidth: 1,
      borderColor: COLORS.surface,
  },
  actionBtn: {
      flex: 1,
      padding: SPACING.l,
      borderRadius: BORDER_RADIUS.m,
      alignItems: 'center',
  },
  yesBtn: {
      backgroundColor: COLORS.success,
  },
  noBtn: {
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.error,
  },
  btnText: {
      color: COLORS.text,
      fontWeight: 'bold',
      fontSize: FONT_SIZE.m,
  },
});
