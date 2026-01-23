import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY, SPACING } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { Landmark, CreditCard, Wallet, ChevronRight, Banknote } from 'lucide-react-native';

const METHOD_TYPES = [
  { id: 'card', name: 'Debit Card', description: 'Instant transfer, small fee', icon: CreditCard, recommended: true },
  { id: 'bank', name: 'Bank Account', description: '1-3 business days, no fee', icon: Landmark },
  { id: 'crypto', name: 'Crypto Wallet', description: 'USDC / ETH / SOL', icon: Wallet },
  { id: 'wire', name: 'Wire Transfer', description: 'Same day, higher limits', icon: Banknote },
];

export const AddMethodScreen = () => {
  const navigation = useNavigation<any>();

  const handleSelect = (method: any) => {
    navigation.navigate('AddMethodForm', { methodType: method });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <HeaderBack />
          <Text style={styles.headerTitle}>Add Method</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Select a method</Text>
            
            <View style={styles.card}>
                {METHOD_TYPES.map((method, index) => {
                    const Icon = method.icon;
                    return (
                        <TouchableOpacity 
                            key={method.id} 
                            style={[styles.row, index < METHOD_TYPES.length - 1 && styles.borderBottom]}
                            onPress={() => handleSelect(method)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.left}>
                                <View style={styles.iconBox}>
                                    <Icon size={24} color={COLORS.white} />
                                </View>
                                <View style={styles.textStack}>
                                    <View style={styles.titleRow}>
                                        <Text style={styles.name}>{method.name}</Text>
                                        {method.recommended && (
                                            <View style={styles.badge}>
                                                <Text style={styles.badgeText}>FASTEST</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.desc}>{method.description}</Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color="#333" />
                        </TouchableOpacity>
                    );
                })}
            </View>
            
            <Text style={styles.secureNote}>
                Your financial information is encrypted and secure.
            </Text>
        </ScrollView>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStack: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    color: COLORS.white,
    fontFamily: FONT_FAMILY.medium,
    fontSize: 16,
  },
  badge: {
    backgroundColor: COLORS.primary + '30', // Low opacity red
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontFamily: FONT_FAMILY.bold,
    letterSpacing: 0.5,
  },
  desc: {
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
  },
  secureNote: {
      textAlign: 'center',
      marginTop: 24,
      color: '#444',
      fontFamily: FONT_FAMILY.body,
      fontSize: 13,
  }
});
