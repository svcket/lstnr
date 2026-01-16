import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { ChevronLeft, Sliders, ChevronDown, Repeat, X, CreditCard, Smartphone, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TradeSheetProps {
  visible: boolean;
  mode: 'BUY' | 'SELL';
  artistName: string;
  ticker: string;
  sharePrice: number;
  mcs?: number;
  onClose: () => void;
  onConfirm: (amount: number, isShares: boolean) => void;
}

const { width } = Dimensions.get('window');

const AMOUNTS = [50, 100, 250, 500, 1000];

type PaymentMethodId = 'apple' | 'paypal' | 'venmo' | 'revolut' | 'card' | 'phantom' | 'manual';

interface PaymentMethod {
    id: PaymentMethodId;
    name: string;
    section: 'fiat' | 'crypto';
    iconType: string;
    badge?: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'apple', name: 'Apple Pay', section: 'fiat', iconType: 'apple', badge: 'Instant' },
    { id: 'paypal', name: 'PayPal', section: 'fiat', iconType: 'paypal', badge: 'Instant' },
    { id: 'venmo', name: 'Venmo', section: 'fiat', iconType: 'venmo', badge: 'Instant' },
    { id: 'revolut', name: 'Revolut Pay', section: 'fiat', iconType: 'revolut', badge: 'Instant' },
    { id: 'card', name: 'Debit Card', section: 'fiat', iconType: 'card', badge: 'Instant' },
    { id: 'phantom', name: 'Phantom', section: 'crypto', iconType: 'ghost', badge: 'detected' },
    { id: 'manual', name: 'Manual transfer', section: 'crypto', iconType: 'qr' },
];

export const TradeSheet = ({ visible, mode, artistName, ticker, sharePrice, onClose, onConfirm }: TradeSheetProps) => {
  const [amount, setAmount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS[4]); // Default Debit
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  
  useEffect(() => {
    if (visible) {
        setAmount('0');
        setShowPaymentSheet(false);
    }
  }, [visible]);

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
        return prev + key;
    });
  };

  const handleAmountSelect = (val: number) => {
      setAmount(val.toString());
  };

  const numAmount = parseFloat(amount);
  const isValid = numAmount > 0;

  if (!visible) return null;

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible={visible}>
       <View style={styles.container}>
           
           {/* PAYMENT SHEET OVERLAY */}
           <Modal 
             animationType="slide" 
             transparent={true} 
             visible={showPaymentSheet}
             onRequestClose={() => setShowPaymentSheet(false)}
           >
               <View style={styles.paymentSheetOverlay}>
                   <View style={styles.paymentSheetContainer}>
                        <View style={styles.paymentHeader}>
                            <TouchableOpacity onPress={() => setShowPaymentSheet(false)}>
                                <X size={24} color="#666" />
                            </TouchableOpacity>
                            <Text style={styles.paymentTitle}>Deposit Methods</Text>
                            <View style={{width: 24}} /> 
                        </View>

                        <ScrollView contentContainerStyle={styles.paymentList}>
                            <Text style={styles.sectionTitle}>Buy with fiat</Text>
                            {PAYMENT_METHODS.filter(m => m.section === 'fiat').map(m => (
                                <PaymentRow 
                                    key={m.id} 
                                    item={m} 
                                    selected={paymentMethod.id === m.id}
                                    onSelect={(item) => {
                                        setPaymentMethod(item);
                                        setShowPaymentSheet(false);
                                    }} 
                                />
                            ))}
                            
                            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Crypto transfer</Text>
                            {PAYMENT_METHODS.filter(m => m.section === 'crypto').map(m => (
                                <PaymentRow 
                                    key={m.id} 
                                    item={m} 
                                    selected={paymentMethod.id === m.id}
                                    onSelect={(item) => {
                                        setPaymentMethod(item);
                                        setShowPaymentSheet(false);
                                    }} 
                                />
                            ))}
                        </ScrollView>
                   </View>
               </View>
           </Modal>

           {/* MAIN TRADE CONTENT */}
           <View style={styles.header}>
               <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                   <ChevronLeft size={28} color="#FFF" />
               </TouchableOpacity>
               
               <View style={styles.headerTitles}>
                   <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                       <View style={styles.coinIcon} /> 
                       <Text style={styles.headerTitle}>{mode === 'BUY' ? 'Buy' : 'Sell'} {ticker}</Text>
                       <View style={styles.verifiedBadge}><Text style={{fontSize: 8, color: '#000'}}>✓</Text></View>
                   </View>
                   <Text style={styles.headerSubtitle}>• 413 people here</Text>
               </View>

               <TouchableOpacity style={styles.iconBtn}>
                   <Sliders size={24} color="#FFF" style={{transform: [{rotate: '90deg'}]}} />
               </TouchableOpacity>
           </View>

           <View style={styles.content}>
               <View style={styles.displayContainer}>
                   <Text style={styles.amountDisplay}>${amount}</Text>
                   <Text style={styles.balanceText}>$0.01 Available</Text>
               </View>

               {/* Payment Selector */}
               <View style={styles.paymentRow}>
                   <TouchableOpacity 
                        style={styles.paymentSelector}
                        onPress={() => setShowPaymentSheet(true)}
                   >
                       <View style={styles.cardIcon}>
                           {/* Simple dynamic icon based on selection could go here */}
                           <View style={{width: 12, height: 8, backgroundColor: '#FFD700', borderRadius: 2}} />
                       </View>
                       <Text style={styles.payText}>{paymentMethod.name}</Text>
                       <ChevronDown size={16} color="#FFF" />
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.swapBtn}>
                       <Repeat size={18} color="#999" />
                   </TouchableOpacity>
               </View>

               {/* Fixed Amount Pills */}
               <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
                   {AMOUNTS.map((amt) => (
                       <TouchableOpacity key={amt} style={styles.pill} onPress={() => handleAmountSelect(amt)}>
                           <Text style={styles.pillText}>${amt}</Text>
                       </TouchableOpacity>
                   ))}
               </ScrollView>

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
                       <TouchableOpacity style={styles.key} onPress={() => handlePress('back')}>
                          <ChevronLeft size={24} color="#FFF" />
                       </TouchableOpacity>
                   </View>
               </View>
           </View>
           
           <View style={styles.footerBtnContainer}>
               <TouchableOpacity 
                    style={[styles.confirmBtnWrapper, { opacity: isValid ? 1 : 0.5 }]} 
                    onPress={() => isValid && onConfirm(numAmount, false)}
                    disabled={!isValid}
                    activeOpacity={0.8}
               >
                   <LinearGradient
                       colors={COLORS.primaryGradient}
                       start={{ x: 0, y: 0 }}
                       end={{ x: 1, y: 1 }}
                       style={styles.gradientBtn}
                   >
                       <Text style={styles.confirmText}>Review</Text>
                   </LinearGradient>
               </TouchableOpacity>
           </View>
       </View>
    </Modal>
  );
};

const PaymentRow = ({ item, selected, onSelect }: { item: PaymentMethod, selected: boolean, onSelect: (i: PaymentMethod) => void }) => (
    <TouchableOpacity style={styles.paymentOption} onPress={() => onSelect(item)}>
        <View style={styles.paymentInfo}>
             <View style={styles.paymentIconBase}>
                 {/* Placeholder for icons */}
                 <Text style={{fontSize: 10, color: '#FFF'}}>{item.name[0]}</Text>
             </View>
             <Text style={styles.paymentName}>{item.name}</Text>
        </View>
        
        {item.badge && (
            <View style={[styles.badge, item.badge === 'Instant' ? styles.badgeInstant : styles.badgeNormal]}>
                {item.badge === 'Instant' && <Text style={{color:'#4ADE80', fontSize:10, marginRight:2}}>⚡</Text>}
                <Text style={[styles.badgeText, item.badge === 'Instant' ? {color:'#4ADE80'} : {color:'#888'}]}>
                    {item.badge}
                </Text>
            </View>
        )}
    </TouchableOpacity>
);

const KeypadBtn = ({ label, onPress }: { label: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.key} onPress={onPress}>
        <Text style={styles.keyText}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    paddingTop: 60, 
    justifyContent: 'space-between',
  },
  
  // ... Header & Common ...
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  iconBtn: { width: 40, alignItems: 'center' },
  headerTitles: { alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', fontFamily: FONT_FAMILY.header },
  headerSubtitle: { color: '#666', fontSize: 13, marginTop: 2, fontWeight: '500' },
  coinIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#333' },
  verifiedBadge: { backgroundColor: '#4DA3FF', width: 14, height: 14, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },

  content: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: 20,
  },
  displayContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 100 },
  amountDisplay: { fontSize: 80, fontWeight: '600', color: '#FFF', fontFamily: FONT_FAMILY.header, marginBottom: 8 },
  balanceText: { color: '#888', fontSize: 16, fontWeight: '500' },

  paymentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 24 },
  paymentSelector: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { width: 28, height: 20, backgroundColor: '#333', borderRadius: 4, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#444' },
  payText: { fontSize: 18, color: '#FFF', fontWeight: '600', marginRight: 4 },
  swapBtn: { padding: 8 },

  pillsRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 24 },
  pill: { backgroundColor: '#1A1A1A', paddingHorizontal: 20, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  pillText: { color: '#FFF', fontSize: 15, fontWeight: '600' },

  keypad: { paddingHorizontal: 24, marginBottom: 10 },
  keyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  key: { width: width / 3 - 32, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30 },
  keyText: { fontSize: 28, fontWeight: '600', color: '#FFF', fontFamily: FONT_FAMILY.header },

  footerBtnContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  confirmBtnWrapper: { height: 56, borderRadius: 28, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  gradientBtn: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  confirmText: { color: '#FFF', fontSize: 18, fontWeight: '700' },

  // PAYMENT SHEET
  paymentSheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  paymentSheetContainer: { backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '75%', paddingBottom: 40 },
  paymentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  paymentTitle: { fontSize: 18, color: '#FFF', fontWeight: '700', fontFamily: FONT_FAMILY.header },
  paymentList: { padding: 20 },
  sectionTitle: { color: '#666', fontSize: 13, marginBottom: 12, fontWeight: '600', textTransform: 'uppercase' },
  paymentOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1A1A1A', padding: 16, borderRadius: 16, marginBottom: 12 },
  paymentInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  paymentIconBase: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' },
  paymentName: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  badgeInstant: { backgroundColor: 'rgba(74, 222, 128, 0.1)', borderColor: 'transaprent' },
  badgeNormal: { backgroundColor: '#222', borderColor: '#333' },
  badgeText: { fontSize: 12, fontWeight: '600' },
});
