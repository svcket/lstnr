import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, ScrollView, Switch, ActivityIndicator, Image } from 'react-native';
import { COLORS, FONT_FAMILY, BUTTON_HEIGHT } from '../../constants/theme';
import { ChevronLeft, Settings2, ChevronDown, X, Check, DollarSign, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DepositSheet, PaymentMethod } from '../common/DepositSheet';

// --- Session Persistence (Simple In-Memory) ---
const SESSION_SETTINGS = {
    slippage: 0.5,
    priority: false,
};

interface TradeSheetProps {
  visible: boolean;
  mode: 'BUY' | 'SELL';
  artistName: string;
  ticker: string;
  sharePrice: number;
  mcs?: number;
  marketType?: 'binary' | 'multi-range';
  outcomeName?: string;
  avatarUrl?: string;
  onClose: () => void;
  onConfirm: (amount: number, isShares: boolean) => void;
}

const { width } = Dimensions.get('window');

const FIXED_AMOUNTS = [50, 100, 250, 500, 1000];
const PCT_AMOUNTS = [
    { label: '25%', val: 0.25 },
    { label: '50%', val: 0.50 },
    { label: 'Max', val: 1.0 },
];

// PaymentMethod interface removed (Using import from DepositSheet.tsx)

const PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'apple', name: 'Apple Pay', section: 'fiat', iconType: 'apple', badge: 'Instant' },
    { id: 'paypal', name: 'PayPal', section: 'fiat', iconType: 'paypal', badge: 'Instant' },
    { id: 'venmo', name: 'Venmo', section: 'fiat', iconType: 'venmo', badge: 'Instant' },
    { id: 'revolut', name: 'Revolut Pay', section: 'fiat', iconType: 'revolut', badge: 'Instant' },
    { id: 'card', name: 'Debit Card', section: 'fiat', iconType: 'card', badge: 'Instant' },
    { id: 'phantom', name: 'Phantom', section: 'crypto', iconType: 'ghost', badge: 'detected' },
    { id: 'manual', name: 'Manual transfer', section: 'crypto', iconType: 'qr' },
];

// --- Custom Components ---

const GradientSwitch = ({ value, onValueChange }: { value: boolean, onValueChange: (val: boolean) => void }) => (
    <TouchableOpacity onPress={() => onValueChange(!value)} activeOpacity={0.8}>
        <LinearGradient
            colors={value ? COLORS.primaryGradient : ['#333', '#333']}
            start={{x:0, y:0}} end={{x:1, y:0}}
            style={{ width: 50, height: 28, borderRadius: 14, padding: 2, justifyContent: 'center' }}
        >
            <View style={{
                width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF',
                alignSelf: value ? 'flex-end' : 'flex-start'
            }} />
        </LinearGradient>
    </TouchableOpacity>
);

export const TradeSheet = ({ visible, mode, artistName, ticker, sharePrice, onClose, onConfirm, marketType = 'binary', outcomeName, avatarUrl }: TradeSheetProps) => {
  const isMulti = marketType === 'multi-range';

  const [amount, setAmount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS[4]); // Default Debit
  const [multiSide, setMultiSide] = useState<'Yes' | 'No'>('Yes');

  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Trade Flow State
  const [showReview, setShowReview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Settings State (Initialized from Session)
  const [slippage, setSlippage] = useState(SESSION_SETTINGS.slippage);
  const [priorityMode, setPriorityMode] = useState(SESSION_SETTINGS.priority);
  
  // Persist Settings
  useEffect(() => {
      SESSION_SETTINGS.slippage = slippage;
      SESSION_SETTINGS.priority = priorityMode;
  }, [slippage, priorityMode]);

  useEffect(() => {
    if (visible) {
        setAmount('0');
        setShowPaymentSheet(false);
        setShowSettings(false);
        setShowReview(false);
        setIsProcessing(false);
        setIsSuccess(false);

        if (isMulti) {
            // Default to USDC logic (mock object)
            setPaymentMethod({ id: 'usdc', name: 'Pay USDC', section: 'crypto', iconType: 'usdc' });
            setMultiSide('Yes');
        } else {
             setPaymentMethod(PAYMENT_METHODS[4]);
        }
    }
  }, [visible, isMulti]);

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

  const handlePctSelect = (pct: number) => {
      // Mock balance 1000
      setAmount((1000 * pct).toFixed(2));
  };

  const handleReview = () => {
      setShowReview(true);
  };

  const handleExecuteTrade = () => {
      setIsProcessing(true);
      
      // Simulate API call
      setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
          
          // Activity Mock would go here
          
          setTimeout(() => {
              onConfirm(numAmount, false);
          }, 1500); // Show success for 1.5s then close
      }, 2000);
  };

  const numAmount = parseFloat(amount);
  const isValid = numAmount > 0;

  // Share Equivalence Logic
  const approxShares = numAmount / (sharePrice || 1);
  const displayShares = approxShares >= 100 
      ? Math.floor(approxShares).toString() 
      : approxShares.toFixed(2);
  
  if (!visible) return null;

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible={visible}>
       <View style={styles.container}>
           
           {/* SETTINGS SHEET OVERLAY */}
           <Modal
             animationType="fade"
             transparent={true}
             visible={showSettings}
             onRequestClose={() => setShowSettings(false)}
           >
               <View style={styles.sheetOverlay}>
                   <View style={styles.settingsSheetContainer}>
                       <View style={styles.sheetHeader}>
                           <Text style={styles.sheetTitle}>Trade Settings</Text>
                           <TouchableOpacity onPress={() => setShowSettings(false)}>
                               <X size={24} color="#FFF" />
                           </TouchableOpacity>
                       </View>
                       
                       <View style={styles.settingRow}>
                           <Text style={styles.settingLabel}>Slippage Tolerance</Text>
                           <View style={styles.slippageRow}>
                               {[0.1, 0.5, 1.0].map(val => (
                                   <TouchableOpacity 
                                        key={val} 
                                        style={[styles.slippageBtn, slippage === val && styles.slippageBtnActive]}
                                        onPress={() => setSlippage(val)}
                                   >
                                       <Text style={[styles.slippageText, slippage === val && {color: '#000'}]}>{val}%</Text>
                                   </TouchableOpacity>
                               ))}
                           </View>
                       </View>

                       <View style={styles.settingRow}>
                           <Text style={styles.settingLabel}>Priority Transaction</Text>
                           <GradientSwitch value={priorityMode} onValueChange={setPriorityMode} />
                       </View>
                   </View>
               </View>
           </Modal>

           {/* Standardized DepositSheet (Phase 6) */}
           <DepositSheet
             visible={showPaymentSheet}
             onClose={() => setShowPaymentSheet(false)}
             methods={PAYMENT_METHODS}
             selectedId={paymentMethod.id}
             onSelect={(item) => {
                 setPaymentMethod(item);
                 setShowPaymentSheet(false);
             }}
           />

           {/* REVIEW & CONFIRM OVERLAY */}
           <Modal
                animationType="slide"
                transparent={true}
                visible={showReview}
                onRequestClose={() => setShowReview(false)}
           >
               <View style={styles.sheetOverlay}>
                   <View style={styles.reviewSheetContainer}>
                       {isSuccess ? (
                           <View style={styles.successContainer}>
                               <View style={styles.successIcon}>
                                   <Check size={40} color="#000" />
                               </View>
                               <Text style={styles.successTitle}>Trade Executed</Text>
                               <Text style={styles.successSub}>
                                   You successfully {mode === 'BUY' ? 'bought' : 'sold'} {ticker}
                               </Text>
                           </View>
                       ) : (
                           <>
                               <Text style={styles.reviewTitle}>Review Trade</Text>
                               
                               <View style={styles.reviewCard}>
                                   <View style={styles.reviewRow}>
                                       <Text style={styles.reviewLabel}>Pay</Text>
                                       <Text style={styles.reviewValue}>${numAmount.toFixed(2)}</Text>
                                   </View>
                                   <View style={styles.reviewDivider} />
                                   <View style={styles.reviewRow}>
                                       <Text style={styles.reviewLabel}>Receive (Est.)</Text>
                                       <Text style={styles.reviewValue}>≈ {displayShares} {ticker}</Text>
                                   </View>
                               </View>

                               <View style={styles.reviewDetails}>
                                   <DetailRow label="Asset" value={isMulti ? `${multiSide} (${outcomeName})` : ticker} />
                                   <DetailRow label="Entry Price" value={`$${sharePrice.toFixed(2)}`} />
                                   <DetailRow label="Price Impact" value="< 0.01%" />
                                   <DetailRow label="Network Fee" value="≈ $0.00" />
                                   <DetailRow label="Slippage" value={`${slippage}%`} />
                                   <DetailRow label="Priority Mode" value={priorityMode ? 'On' : 'Off'} />
                               </View>

                               <View style={styles.reviewFooter}>
                                   <TouchableOpacity 
                                       style={styles.editBtn} 
                                       onPress={() => setShowReview(false)}
                                       disabled={isProcessing}
                                   >
                                       <Text style={styles.editBtnText}>Edit</Text>
                                   </TouchableOpacity>
                                   
                                   <TouchableOpacity 
                                       style={styles.executeBtn} 
                                       onPress={handleExecuteTrade}
                                       disabled={isProcessing}
                                   >
                                       <LinearGradient
                                           colors={COLORS.primaryGradient}
                                           start={{ x: 0, y: 0 }}
                                           end={{ x: 1, y: 1 }}
                                           style={styles.gradientBtn}
                                       >
                                           {isProcessing ? (
                                               <ActivityIndicator color="#FFF" />
                                           ) : (
                                               <Text style={styles.confirmText}>Confirm Trade</Text>
                                           )}
                                       </LinearGradient>
                                   </TouchableOpacity>
                               </View>
                           </>
                       )}
                   </View>
               </View>
           </Modal>

            {/* MAIN TRADE CONTENT - HEADER - REFACTORED FOR LEFT ALIGNMENT */}
            <View style={[styles.header, { justifyContent: 'flex-start' }]}>
                {/* Left Group (Back + Title) - Flex Grow to push Right Icon */}
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                        <ArrowLeft size={28} color="#FFF" />
                    </TouchableOpacity>
                    
                    {/* Title Container - Left Aligned next to Back Arrow */}
                    <View style={{marginLeft: 12, alignItems: 'flex-start', justifyContent: 'center'}}>
                        {isMulti ? (
                            // Multi-Range Header
                            <> 
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                    <View style={{width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)'}} />
                                    <View>
                                         <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                            <Text style={styles.headerTitle}>Buy {multiSide}</Text>
                                            <View style={styles.verifiedBadge}><Text style={{fontSize: 8, color: '#000'}}>✓</Text></View>
                                         </View>
                                         <Text style={styles.headerSubtitle}>{outcomeName || 'Outcome'}</Text>
                                    </View>
                                </View>
                            </>
                        ) : (
                            // Standard Header
                            <> 
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                                    {avatarUrl ? (
                                        <Image source={{ uri: avatarUrl }} style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#333' }} />
                                    ) : (
                                        <View style={styles.coinIcon} /> 
                                    )}
                                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                                        <Text style={styles.headerTitle}>{mode === 'BUY' ? 'Buy' : 'Sell'} {ticker}</Text>
                                        <View style={styles.verifiedBadge}><Text style={{fontSize: 8, color: '#000'}}>✓</Text></View>
                                    </View>
                                </View>
                                <Text style={styles.headerSubtitle}>413 people here</Text>
                            </>
                        )}
                    </View>
                </View>

                {/* Right Action - Auto Margin Left to pin to right */}
                <View style={{marginLeft: 'auto'}}>
                    {isMulti ? (
                        // Yes/No Toggle (Segmented)
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity 
                                style={[styles.toggleBtn, multiSide === 'Yes' && styles.toggleBtnActive]} 
                                onPress={() => setMultiSide('Yes')}
                            >
                                <Text style={[styles.toggleText, multiSide === 'Yes' && {color: '#FFF'}]}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.toggleBtn, multiSide === 'No' && styles.toggleBtnActive]} 
                                onPress={() => setMultiSide('No')}
                            >
                                <Text style={[styles.toggleText, multiSide === 'No' && {color: '#FFF'}]}>No</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowSettings(true)}>
                            <Settings2 size={24} color="#FFF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

           <View style={styles.content}>
               <View style={styles.displayContainer}>
                   <Text style={styles.amountDisplay}>${amount}</Text>
                   {numAmount > 0 && sharePrice > 0 && (
                        <Text style={[styles.balanceText, { color: COLORS.textSecondary, marginBottom: 4 }]}>
                            ≈ {displayShares} {ticker}
                        </Text>
                    )}

               </View>

               {/* Payment Selector */}
               <View style={styles.paymentRow}>
                   <TouchableOpacity 
                        style={styles.paymentSelector}
                        onPress={() => setShowPaymentSheet(true)}
                   >
                       <View style={[styles.cardIcon, paymentMethod.id === 'usdc' && { backgroundColor: '#2775CA', borderColor: '#2775CA' }]}>
                           {paymentMethod.id === 'usdc' ? (
                               <DollarSign size={14} color="#FFF" />
                           ) : (
                               <View style={{width: 12, height: 8, backgroundColor: '#FFD700', borderRadius: 2}} />
                           )}
                       </View>
                       <Text style={styles.payText}>{paymentMethod.name}</Text>
                       <ChevronDown size={16} color="#FFF" />
                   </TouchableOpacity>
               </View>

                {/* Pills - Always Fixed Amounts */}
                <View style={styles.pillsRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8}}>
                        {FIXED_AMOUNTS.map((amt) => (
                            <TouchableOpacity key={amt} style={styles.pill} onPress={() => handleAmountSelect(amt)}>
                                <Text style={styles.pillText}>${amt}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

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
                       <KeypadBtn label=". " onPress={() => handlePress('.')} />
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
                    onPress={() => isValid && handleReview()}
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

// Redundant PaymentRow removed (Moved to DepositSheet.tsx)

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
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
    paddingTop: 24, 
    justifyContent: 'space-between',
  },
  
  // ... Header & Common ...
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Force Left Align
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  iconBtn: { width: 40, alignItems: 'center' },
  headerTitles: { alignItems: 'flex-start' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', fontFamily: FONT_FAMILY.header },
  headerSubtitle: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2, fontWeight: '500' },
  coinIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#333' },
  verifiedBadge: { backgroundColor: '#4DA3FF', width: 14, height: 14, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },

  content: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: 20,
  },
  displayContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 100 },
  amountDisplay: { fontSize: 68, fontWeight: '600', color: '#FFF', fontFamily: FONT_FAMILY.header, marginBottom: 8 },
  balanceText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '500' },

  paymentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, marginBottom: 24 },
  paymentSelector: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { width: 28, height: 20, backgroundColor: '#333', borderRadius: 4, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#444' },
  payText: { fontSize: 18, color: '#FFF', fontWeight: '600', marginRight: 4 },
  
  pillsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 24 },
  pill: { backgroundColor: '#333', paddingHorizontal: 0, width: (width - 32 - 32) / 5, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pillText: { color: '#FFF', fontSize: 14, fontWeight: '600' },

  keypad: { paddingHorizontal: 16, marginBottom: 10 },
  keyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  key: { width: (width - 64) / 3, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30 },
  keyText: { fontSize: 28, fontWeight: '600', color: '#FFF', fontFamily: FONT_FAMILY.header },

  footerBtnContainer: { paddingHorizontal: 16, paddingBottom: 40 },
  confirmBtnWrapper: { height: 56, borderRadius: 28, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  gradientBtn: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  confirmText: { color: '#FFF', fontSize: 18, fontWeight: '700' },

  // ... BOTTOM SHEETS
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  settingsSheetContainer: { backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, paddingBottom: 60 },
  reviewSheetContainer: { backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, paddingBottom: 40 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  sheetTitle: { fontSize: 18, color: '#FFF', fontWeight: '700', fontFamily: FONT_FAMILY.header },

  // SETTINGS
  settingRow: { marginTop: 24 },
  settingLabel: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 12, fontFamily: FONT_FAMILY.body },
  slippageRow: { flexDirection: 'row', gap: 12 },
  slippageBtn: { flex: 1, backgroundColor: '#222', height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333' },
  slippageBtnActive: { backgroundColor: '#FFF', borderColor: '#FFF' },
  slippageText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', fontFamily: FONT_FAMILY.body },
  toggleContainer: {
      flexDirection: 'row',
      backgroundColor: '#1A1A1A',
      borderRadius: 12,
      padding: 4,
      gap: 2,
  },
  toggleBtn: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 8,
  },
  toggleBtnActive: {
      backgroundColor: '#333',
  },
  toggleText: {
      color: COLORS.textSecondary,
      fontWeight: '600',
      fontSize: 14,
  },
  
  // REVIEW
  reviewTitle: { color: '#FFF', fontSize: 20, fontWeight: '700', fontFamily: FONT_FAMILY.header, marginBottom: 24, textAlign: 'center' },
  reviewCard: { backgroundColor: '#1A1A1A', borderRadius: 16, padding: 20, marginBottom: 16 },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewDivider: { height: 1, backgroundColor: '#333', marginVertical: 16 },
  reviewLabel: { color: COLORS.textSecondary, fontSize: 16, fontFamily: FONT_FAMILY.body },
  reviewValue: { color: '#FFF', fontSize: 16, fontWeight: '700', fontFamily: FONT_FAMILY.balance },
  
  reviewDetails: { marginBottom: 32, gap: 24, backgroundColor: '#1A1A1A', padding: 16, borderRadius: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { color: COLORS.textSecondary, fontSize: 14 },
  detailValue: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  
  reviewFooter: { flexDirection: 'row', gap: 12 },
  editBtn: { flex: 1, height: BUTTON_HEIGHT, borderRadius: BUTTON_HEIGHT/2, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  editBtnText: { color: '#000', fontWeight: '600', fontSize: 16 },
  executeBtn: { flex: 2, height: BUTTON_HEIGHT, borderRadius: BUTTON_HEIGHT/2, overflow: 'hidden' },
  
  successContainer: { alignItems: 'center', paddingVertical: 40 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.success, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { color: '#FFF', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  successSub: { color: COLORS.textSecondary, fontSize: 16, textAlign: 'center' },
});
