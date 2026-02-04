import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { HeaderBack } from '../../components/common/HeaderBack';
import { LedgerStore } from '../../lib/ledgerStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useToast } from '../../context/ToastContext';

export const WithdrawConfirmScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { method, amount } = route.params || {};
  
  const balance = amount || LedgerStore.getAvailableBalance(); // Use passed amount
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
        const success = LedgerStore.debitWithdrawal(balance);
        setLoading(false);
        if (success) {
            showToast('Withdrawal successful!', 'success');
            navigation.popToTop(); // Back to Portfolio or Home
            // Or navigate to success screen
        } else {
            showToast('Insufficient funds', 'error');
        }
    }, 1500); // Mock delay
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <HeaderBack />
            <Text style={styles.headerTitle}>Confirm Withdrawal</Text>
        </View>

        <View style={styles.content}>
            <View style={styles.card}>
                <Text style={styles.label}>Amount</Text>
                <Text style={styles.amount}>${balance.toFixed(2)}</Text>
                
                <View style={styles.divider} />
                
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>To</Text>
                    <Text style={styles.rowValue}>{method?.name} ({method?.detail})</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Fee</Text>
                    <Text style={styles.rowValue}>$0.00</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Total</Text>
                    <Text style={styles.rowValue}>${balance.toFixed(2)}</Text>
                </View>
            </View>
        </View>

        <View style={styles.footer}>
             <TouchableOpacity 
                style={styles.btnWrapper} 
                onPress={handleConfirm}
                disabled={loading}
             >
                <LinearGradient
                    colors={COLORS.primaryGradient}
                    style={styles.btn}
                >
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Confirm Transfer</Text>}
                </LinearGradient>
             </TouchableOpacity>
        </View>
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
  content: { padding: 16, flex: 1 },
  card: {
      backgroundColor: COLORS.surface,
      borderRadius: 16,
      padding: 24,
  },
  label: {
      color: '#888',
      fontSize: 14,
      fontFamily: FONT_FAMILY.body,
      textAlign: 'center',
      marginBottom: 8,
  },
  amount: {
      color: '#FFF',
      fontSize: 40,
      fontFamily: FONT_FAMILY.balance,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 24,
  },
  divider: {
      height: 1, backgroundColor: '#333', marginBottom: 24,
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
  },
  rowLabel: {
      color: '#888',
      fontSize: 16,
  },
  rowValue: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '600',
  },
  footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#222',
  },
  btnWrapper: {
      height: 56, borderRadius: 28, overflow: 'hidden',
  },
  btn: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  btnText: {
      color: '#FFF', fontSize: 16, fontWeight: '600',
  }

});
