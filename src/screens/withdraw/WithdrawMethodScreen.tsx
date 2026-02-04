import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { HeaderBack } from '../../components/common/HeaderBack';
import { Landmark, CreditCard, ChevronRight } from 'lucide-react-native';

const METHODS = [
    { id: 'm1', type: 'Bank', name: 'Chase Bank', detail: '....1234', icon: Landmark },
    { id: 'm2', type: 'Card', name: 'Visa Debit', detail: '....5678', icon: CreditCard },
];

export const WithdrawMethodScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { amount } = route.params || {};

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <HeaderBack />
            <Text style={styles.headerTitle}>Select Method</Text>
        </View>

        <View style={styles.content}>
            <View style={styles.amountHeader}>
                <Text style={styles.amountLabel}>You are withdrawing</Text>
                <Text style={styles.amountValue}>${typeof amount === 'number' ? amount.toFixed(2) : '0.00'}</Text>
            </View>

            <Text style={styles.label}>Where should we send the funds?</Text>
            
            <View style={styles.list}>
                {METHODS.map((m) => {
                    const Icon = m.icon;
                    return (
                        <TouchableOpacity 
                            key={m.id}
                            style={styles.card}
                            onPress={() => navigation.navigate('WithdrawConfirm', { method: m, amount })}
                        >
                             <View style={styles.row}>
                                 <View style={styles.iconBox}>
                                     <Icon size={20} color="#FFF" />
                                 </View>
                                 <View>
                                     <Text style={styles.name}>{m.name}</Text>
                                     <Text style={styles.detail}>{m.detail}</Text>
                                 </View>
                             </View>
                             <ChevronRight size={20} color="#666" />
                        </TouchableOpacity>
                    )
                })}
            </View>
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
  content: { padding: 16 },
  amountHeader: {
      alignItems: 'center',
      marginBottom: 32,
      marginTop: 8,
  },
  amountLabel: {
      color: '#888',
      fontSize: 14,
      fontFamily: FONT_FAMILY.body,
      marginBottom: 8,
  },
  amountValue: {
      color: '#FFF',
      fontSize: 32,
      fontFamily: FONT_FAMILY.header,
      fontWeight: '600',
  },
  label: {
      color: '#888',
      fontSize: 14,
      fontFamily: FONT_FAMILY.body,
      marginBottom: 16,
      marginLeft: 4,
  },
  list: {
      backgroundColor: COLORS.surface,
      borderRadius: 16,
      overflow: 'hidden',
  },
  card: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#222',
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  iconBox: {
      width: 40, height: 40, borderRadius: 20, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center'
  },
  name: {
      color: '#FFF',
      fontFamily: FONT_FAMILY.medium,
      fontSize: 16,
  },
  detail: {
      color: '#666',
      fontSize: 14,
      fontFamily: FONT_FAMILY.body,
  }
});
