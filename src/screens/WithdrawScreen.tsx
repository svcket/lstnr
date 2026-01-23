import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONT_FAMILY, SPACING } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { Check, ChevronRight, CreditCard, Landmark, Plus, Wallet, Banknote } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';

const INITIAL_DESTINATIONS = [
  { id: 'bank_1', type: 'BANK', name: 'Chase Bank', detail: '....1234', icon: Landmark },
  { id: 'card_1', type: 'CARD', name: 'Visa Debit', detail: '....5678', icon: CreditCard },
];

const getIconForType = (typeId: string) => {
    switch (typeId) {
        case 'card': return CreditCard;
        case 'bank': return Landmark;
        case 'crypto': return Wallet;
        case 'wire': return Banknote;
        default: return Landmark;
    }
};

export const WithdrawScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [amount, setAmount] = useState('');
  const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);
  const [selectedDest, setSelectedDest] = useState(INITIAL_DESTINATIONS[0].id);

  // Listen for new methods added via AddMethodForm
  useEffect(() => {
      if (route.params?.newMethod) {
          const { newMethod } = route.params;
          // Rehydrate icon
          const methodWithIcon = {
              ...newMethod,
              icon: getIconForType(newMethod.typeId)
          };
          
          setDestinations(prev => {
              // Avoid duplicates if effect runs twice
              if (prev.find(d => d.id === newMethod.id)) return prev;
              const newList = [...prev, methodWithIcon];
              setSelectedDest(newMethod.id); // Auto-select new method
              return newList;
          });
          
          // Clear params to avoid loop (optional, but good practice in some nav stacks)
          navigation.setParams({ newMethod: null });
      }
  }, [route.params?.newMethod]);

  const handleWithdraw = () => {
      Alert.alert('Withdrawal Initiated', `Withdrawing $${amount} to ${destinations.find(d => d.id === selectedDest)?.name}`);
  };

  const handleAddMethod = () => {
      navigation.navigate('AddMethod');
  };

  const isValid = parseFloat(amount) > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <HeaderBack />
          <Text style={styles.headerTitle}>Withdraw</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            {/* Amount Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput 
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0"
                    placeholderTextColor="#333"
                    keyboardType="decimal-pad"
                    autoFocus
                />
            </View>
            <Text style={styles.balanceLabel}>Available: $12,430.55</Text>

            {/* Destination Selector */}
            <Text style={styles.sectionTitle}>Withdraw to</Text>
            <View style={styles.card}>
                {destinations.map((dest, index) => {
                    const isSelected = selectedDest === dest.id;
                    const Icon = dest.icon;
                    return (
                        <TouchableOpacity 
                            key={dest.id} 
                            style={styles.destRow}
                            onPress={() => setSelectedDest(dest.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.destLeft}>
                                <View style={styles.iconBox}>
                                    <Icon size={20} color={COLORS.white} />
                                </View>
                                <View>
                                    <Text style={styles.destName}>{dest.name}</Text>
                                    <Text style={styles.destDetail}>{dest.detail}</Text>
                                </View>
                            </View>
                            {isSelected && <Check size={20} color={COLORS.success} />}
                        </TouchableOpacity>
                    );
                })}
                
                {/* Divider */}
                <View style={styles.divider} />

                {/* Add Method */}
                 <TouchableOpacity 
                    style={styles.destRow}
                    onPress={handleAddMethod}
                    activeOpacity={0.7}
                >
                    <View style={styles.destLeft}>
                        <View style={[styles.iconBox, { backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#333' }]}>
                            <Plus size={20} color={COLORS.textSecondary} />
                        </View>
                        <Text style={[styles.destName, { color: COLORS.textSecondary }]}>Add new method</Text>
                    </View>
                    <ChevronRight size={20} color="#333" />
                </TouchableOpacity>
            </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
            <TouchableOpacity 
                style={[styles.buttonWrapper, !isValid && styles.buttonDisabled]} 
                onPress={handleWithdraw}
                disabled={!isValid}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBtn}
                >
                    <Text style={styles.buttonText}>Review Withdrawal</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 48,
    fontFamily: FONT_FAMILY.balance,
    fontWeight: '700',
    color: COLORS.white,
    marginRight: 4,
  },
  amountInput: {
    fontSize: 48,
    fontFamily: FONT_FAMILY.balance,
    fontWeight: '700',
    color: COLORS.white,
    minWidth: 60,
  },
  balanceLabel: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONT_FAMILY.body,
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.body,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 16,
    overflow: 'hidden',
  },
  destRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#222',
    marginLeft: 72, // Indent past icon
  },
  destLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destName: {
    color: COLORS.white,
    fontFamily: FONT_FAMILY.medium,
    fontSize: 16,
    marginBottom: 2,
  },
  destDetail: {
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  buttonWrapper: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.3, 
  },
  gradientBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    // In TradeSheet, confirms text color. Code reviewed earlier didn't show `confirmText` style but generic button text is usually black on gold/red or white.
    // Let's check TradeSheet snippet again... `confirmText` usage.
    // Assuming White for now as per previous feedback? No, user asked for Gradient not Red.
    // Standard text on primary gradient is often white or black. I'll stick to White as it's safe on Red/Gold, or Black if it's very bright gold.
    // Actually, `COLORS.primaryGradient` is `['#C99315', '#F53636']`.
    // Gold to Red. White text is readable.
    // Wait, the user said "why do you keep using the red color... ditch the red unless i say so".
    // "users should be able to add a new withdrawal method".
    // I will use White text for now.
    fontSize: 16,
    fontFamily: FONT_FAMILY.medium,
    fontWeight: '600',
    color: '#FFFFFF', 
  },
  buttonTextDisabled: {
    color: '#888',
  }
});
