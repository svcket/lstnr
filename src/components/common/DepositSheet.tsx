import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions, ScrollView, Image } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';

const { height } = Dimensions.get('window');

export interface PaymentMethod {
    id: string;
    name: string;
    section: 'fiat' | 'crypto';
    iconType: string;
    badge?: string;
}

const ICON_MAP: Record<string, any> = {
    apple: require('../../../assets/payment/apple.png'),
    paypal: require('../../../assets/payment/paypal.png'),
    venmo: require('../../../assets/payment/venmo.png'),
    revolut: require('../../../assets/payment/revolut.png'),
    card: require('../../../assets/payment/card.png'),
    ghost: require('../../../assets/payment/phantom.png'),
    usdc: require('../../../assets/payment/usdc.png')
};

interface DepositSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (method: PaymentMethod) => void;
  selectedId: string;
  methods: PaymentMethod[];
}

export const DepositSheet = ({ visible, onClose, onSelect, selectedId, methods }: DepositSheetProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handleBar} />
              
              <View style={styles.header}>
                <Text style={styles.title}>Deposit Methods</Text>
                <TouchableOpacity onPress={onClose}>
                  <X size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
              
              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Buy with fiat</Text>
                {methods.filter(m => m.section === 'fiat').map(m => (
                  <PaymentRow 
                    key={m.id} 
                    item={m} 
                    selected={selectedId === m.id}
                    onSelect={onSelect} 
                  />
                ))}
                
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Crypto transfer</Text>
                {methods.filter(m => m.section === 'crypto').map(m => (
                  <PaymentRow 
                    key={m.id} 
                    item={m} 
                    selected={selectedId === m.id}
                    onSelect={onSelect} 
                  />
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const PaymentRow = ({ item, selected, onSelect }: { item: PaymentMethod, selected: boolean, onSelect: (i: PaymentMethod) => void }) => (
    <TouchableOpacity style={[styles.paymentOption, selected && styles.paymentOptionSelected]} onPress={() => onSelect(item)}>
        <View style={styles.paymentInfo}>
             <View style={[styles.paymentIconBase, ICON_MAP[item.iconType] && { backgroundColor: 'transparent', borderWidth: 0 }]}>
                 {ICON_MAP[item.iconType] ? (
                     <Image source={ICON_MAP[item.iconType]} style={styles.paymentIcon} />
                 ) : (
                     <Text style={styles.iconInitial}>{item.name[0]}</Text>
                 )}
             </View>
             <Text style={styles.paymentName}>{item.name}</Text>
        </View>
        
        <View style={styles.rightContent}>
            {item.badge && (
                <View style={[styles.badge, item.badge === 'Instant' ? styles.badgeInstant : styles.badgeNormal]}>
                    {item.badge === 'Instant' && <Text style={styles.bolt}>⚡</Text>}
                    <Text style={[styles.badgeText, item.badge === 'Instant' ? {color:'#4ADE80'} : {color: '#666'}]}>
                        {item.badge}
                    </Text>
                </View>
            )}
            {selected && <Check size={18} color={COLORS.primary} style={{marginLeft: 8}} />}
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    maxHeight: height * 0.85,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: '#222',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontFamily: FONT_FAMILY.header,
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 12,
    marginBottom: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#18181b', // Zn-900
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  paymentOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#1a1a1a',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIconBase: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconInitial: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '700',
  },
  paymentIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  paymentName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.body,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  badgeInstant: {
    backgroundColor: 'rgba(74, 222, 128, 0.05)',
    borderColor: '#064e3b',
  },
  badgeNormal: {
    backgroundColor: '#222',
    borderColor: '#333',
  },
  bolt: {
    color: '#4ADE80',
    fontSize: 10,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.body,
  },
});
