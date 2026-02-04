import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY, BUTTON_HEIGHT } from '../../constants/theme';
import { HeaderBack } from '../../components/common/HeaderBack';
import { LedgerStore } from '../../lib/ledgerStore';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Delete } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const FIXED_AMOUNTS = [50, 100, 250, 500, 1000];

const KeypadBtn = ({ label, onPress, icon }: { label?: string, onPress: () => void, icon?: React.ReactNode }) => (
    <TouchableOpacity style={styles.key} onPress={onPress}>
        {icon ? icon : <Text style={styles.keyText}>{label}</Text>}
    </TouchableOpacity>
);

export const WithdrawAmountScreen = () => {
  const navigation = useNavigation<any>();
  const [amount, setAmount] = useState('0');
  const maxAmount = LedgerStore.getAvailableBalance();

  const handlePress = (key: string) => {
    if (key === 'back') {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      return;
    }
    if (key === '.') {
      if (amount.includes('.')) return;
      setAmount(prev => prev + '.');
      return;
    }
    setAmount(prev => {
        if (prev === '0') return key;
        const newAmount = prev + key;
        // Basic validation during typing could go here (e.g. max decimals)
        return newAmount;
    });
  };

  const handleAmountSelect = (val: number) => {
      setAmount(val.toString());
  };

  const handleMax = () => {
    setAmount(maxAmount.toFixed(2));
  };

  const handleNext = () => {
    navigation.navigate('WithdrawMethod', { amount: parseFloat(amount) });
  };

  const numAmount = parseFloat(amount || '0');
  const isValid = numAmount > 0 && numAmount <= maxAmount;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <HeaderBack />
            <Text style={styles.headerTitle}>Withdraw Amount</Text>
        </View>

        <View style={styles.content}>
            {/* Display Area */}
            <View style={styles.displayContainer}>
                <Text style={styles.amountDisplay}>${amount}</Text>
                <Text style={styles.balanceText}>Available: ${maxAmount.toFixed(2)}</Text>
                {numAmount > maxAmount && (
                    <Text style={styles.errorText}>Insufficient funds</Text>
                )}
            </View>

            {/* Quick Select Pills */}
             <View style={styles.pillsRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8, paddingHorizontal: 16}}>
                    {FIXED_AMOUNTS.map((amt) => (
                        <TouchableOpacity key={amt} style={styles.pill} onPress={() => handleAmountSelect(amt)}>
                            <Text style={styles.pillText}>${amt}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={[styles.pill, { backgroundColor: '#333' }]} onPress={handleMax}>
                        <Text style={[styles.pillText, { color: COLORS.primary }]}>Max</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Numeric Keypad */}
            <View style={styles.keypad}>
                <View style={styles.keyRow}>
                    <KeypadBtn label="1" onPress={() => handlePress('1')} />
                    <KeypadBtn label="2" onPress={() => handlePress('2')} />
                    <KeypadBtn label="3" onPress={() => handlePress('3')} />
                </View>
                <View style={styles.keyRow}>
                    <KeypadBtn label="4" onPress={() => handlePress('4')} />
                    <KeypadBtn label="5" onPress={() => handlePress('5')} />
                    <KeypadBtn label="6" onPress={() => handlePress('6')} />
                </View>
                <View style={styles.keyRow}>
                    <KeypadBtn label="7" onPress={() => handlePress('7')} />
                    <KeypadBtn label="8" onPress={() => handlePress('8')} />
                    <KeypadBtn label="9" onPress={() => handlePress('9')} />
                </View>
                <View style={styles.keyRow}>
                    <KeypadBtn label="." onPress={() => handlePress('.')} />
                    <KeypadBtn label="0" onPress={() => handlePress('0')} />
                    <KeypadBtn onPress={() => handlePress('back')} icon={<ChevronLeft size={28} color="#FFF" />} />
                </View>
            </View>
        </View>

        <View style={styles.footer}>
             <TouchableOpacity 
                style={[styles.btnWrapper, !isValid && { opacity: 0.5 }]} 
                onPress={handleNext}
                disabled={!isValid}
             >
                <LinearGradient
                    colors={COLORS.primaryGradient}
                    style={styles.gradientBtn}
                >
                    <Text style={styles.btnText}>Review</Text>
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
  content: { flex: 1, justifyContent: 'flex-end', paddingBottom: 20 },
  displayContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      minHeight: 100,
  },
  amountDisplay: {
      fontSize: 68,
      fontWeight: '600',
      color: '#FFF',
      fontFamily: FONT_FAMILY.header,
      marginBottom: 8,
  },
  balanceText: {
      color: COLORS.textSecondary,
      fontSize: 16,
      fontWeight: '500',
      fontFamily: FONT_FAMILY.body,
  },
  errorText: {
      color: COLORS.error,
      marginTop: 8,
      fontSize: 14,
      fontWeight: '600',
  },
  pillsRow: {
      marginBottom: 24,
      height: 44,
  },
  pill: {
      backgroundColor: '#222',
      paddingHorizontal: 16,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 70,
  },
  pillText: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: '600',
  },
  keypad: {
      paddingHorizontal: 16,
      marginBottom: 10,
  },
  keyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
  },
  key: {
      width: (width - 64) / 3,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      // backgroundColor: '#111', // Optional key background
  },
  keyText: {
      fontSize: 28,
      fontWeight: '600',
      color: '#FFF',
      fontFamily: FONT_FAMILY.header,
  },
  footer: {
      padding: 16,
  },
  btnWrapper: {
      height: 56, borderRadius: 28, overflow: 'hidden',
  },
  gradientBtn: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  btnText: {
      color: '#FFF', fontSize: 16, fontWeight: '600',
  }
});
