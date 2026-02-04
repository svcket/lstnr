import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { HeaderBack } from '../../components/common/HeaderBack';
import { DollarSign, ArrowRight, Wallet, BadgePercent } from 'lucide-react-native';
import { LedgerStore } from '../../lib/ledgerStore';
import { LinearGradient } from 'expo-linear-gradient';

export const WithdrawHomeScreen = () => {
  const navigation = useNavigation<any>();
  const [balance, setBalance] = React.useState(LedgerStore.getAvailableBalance());
  
  React.useEffect(() => {
    const unsub = LedgerStore.subscribe(() => setBalance(LedgerStore.getAvailableBalance()));
    return () => { unsub(); };
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <HeaderBack />
            <Text style={styles.headerTitle}>Withdraw Funds</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            {/* Top Summary */}
            <View style={styles.summaryCard}>
                <Text style={styles.label}>Available to withdraw</Text>
                <Text style={styles.amount}>${balance.toFixed(2)}</Text>
                <Text style={styles.helper}>
                    Withdrawable funds come from settled sales and resolved predictions.
                </Text>
            </View>

            {/* Actions */}
            <Text style={styles.sectionTitle}>Actions</Text>
            
            {/* 1. Sell to Withdraw */}
            <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => navigation.navigate('SellToWithdraw')}
                activeOpacity={0.7}
            >
                <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 166, 35, 0.1)' }]}>
                    <BadgePercent size={24} color="#F5A623" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.actionTitle}>Sell to withdraw</Text>
                    <Text style={styles.actionDesc}>Sell shares or predictions to add to your withdrawable balance.</Text>
                </View>
                <ArrowRight size={20} color="#666" />
            </TouchableOpacity>

            {/* 2. Withdraw Now */}
            <TouchableOpacity 
                style={[styles.actionCard, balance <= 0 && { opacity: 0.5 }]}
                onPress={() => balance > 0 ? navigation.navigate('WithdrawAmount') : null}
                activeOpacity={0.7}
                disabled={balance <= 0}
            >
                <View style={[styles.iconBox, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
                    <Wallet size={24} color={COLORS.success} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.actionTitle}>Withdraw now</Text>
                    <Text style={styles.actionDesc}>Transfer available funds to your bank or wallet.</Text>
                </View>
                {balance > 0 && <ArrowRight size={20} color="#666" />}
            </TouchableOpacity>

            {balance <= 0 && (
                <Text style={styles.emptyMsg}>
                    No funds available yet. Sell shares above or wait for prediction payouts.
                </Text>
            )}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  headerTitle: {
    fontFamily: FONT_FAMILY.header,
    fontWeight: '600',
    fontSize: 18,
    color: COLORS.text,
  },
  content: { padding: 16 },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  label: {
    color: '#888',
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
    marginBottom: 8,
  },
  amount: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.balance,
    fontWeight: '700',
    fontSize: 36,
    marginBottom: 12,
  },
  helper: {
    color: '#666',
    textAlign: 'center',
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
    marginBottom: 16,
    marginLeft: 4,
  },
  actionCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: FONT_FAMILY.medium,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDesc: {
    color: '#888',
    fontSize: 13,
    fontFamily: FONT_FAMILY.body,
    lineHeight: 18,
  },
  emptyMsg: {
    textAlign: 'center',
    color: '#555',
    marginTop: 8,
    fontSize: 14,
  }
});
