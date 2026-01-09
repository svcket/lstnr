import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { X, AlertTriangle } from 'lucide-react-native';

interface TradeSheetProps {
  visible: boolean;
  mode: 'BUY' | 'SELL';
  artistName: string;
  ticker: string;
  sharePrice: number;
  mcs: number; // New Prop
  onClose: () => void;
  onConfirm: (amount: number, isShares: boolean) => void;
}

export const TradeSheet = ({ visible, mode, artistName, ticker, sharePrice, mcs, onClose, onConfirm }: TradeSheetProps) => {
  const [step, setStep] = useState<'INPUT' | 'PREVIEW'>('INPUT');
  const [inputType, setInputType] = useState<'AMOUNT' | 'SHARES'>('AMOUNT');
  const [value, setValue] = useState('');
  
  useEffect(() => {
    if (visible) {
      setStep('INPUT');
      setValue('');
    }
  }, [visible]);

  const numValue = parseFloat(value) || 0;
  const isLowConfidence = mcs < 40;
  const slippage = isLowConfidence ? 2.0 : 1.0;
  
  // Derived values
  const totalCost = inputType === 'SHARES' ? numValue * sharePrice : numValue;
  const totalShares = inputType === 'SHARES' ? numValue : numValue / sharePrice;
  const fee = totalCost * 0.005; // 0.5% mock fee
  const finalTotal = mode === 'BUY' ? totalCost + fee : totalCost - fee;

  const handleNext = () => {
    if (numValue > 0) setStep('PREVIEW');
  };

  const color = mode === 'BUY' ? '#00FF94' : '#FF3B30';
  const label = mode === 'BUY' ? 'Buy' : 'Sell';

  if (!visible) return null;

  return (
    <Modal animationType="slide" transparent visible={visible}>
       <View style={styles.overlay}>
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheet}>
            
            {/* Warning for Low MCS */}
            {isLowConfidence && (
              <View style={styles.warningBanner}>
                <AlertTriangle size={16} color="#000" />
                <Text style={styles.warningText}>Low confidence market — expect higher volatility.</Text>
              </View>
            )}

            {/* Header */}
            <View style={styles.header}>
               <Text style={styles.title}>{step === 'INPUT' ? `${label} ${ticker}` : 'Review Order'}</Text>
               <TouchableOpacity onPress={onClose}>
                 <X color="#FFF" size={24} />
               </TouchableOpacity>
            </View>

            {step === 'INPUT' ? (
              <>
                 {/* Input Type Toggle */}
                 <View style={styles.toggleRow}>
                   <TouchableOpacity onPress={() => setInputType('AMOUNT')} style={[styles.toggleBtn, inputType === 'AMOUNT' && styles.activeToggle]}>
                     <Text style={[styles.toggleText, inputType === 'AMOUNT' && { color: '#FFF' }]}>Amount ($)</Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => setInputType('SHARES')} style={[styles.toggleBtn, inputType === 'SHARES' && styles.activeToggle]}>
                      <Text style={[styles.toggleText, inputType === 'SHARES' && { color: '#FFF' }]}>Shares</Text>
                   </TouchableOpacity>
                 </View>

                 {/* Main Input */}
                 <View style={styles.inputContainer}>
                    <Text style={[styles.inputPrefix, { color }]}>{inputType === 'AMOUNT' ? '$' : '#'}</Text>
                    <TextInput 
                      style={[styles.input, { color }]}
                      placeholder="0"
                      placeholderTextColor="#333"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={setValue}
                      autoFocus
                    />
                 </View>

                 {/* Estimates */}
                 <View style={styles.estimateRow}>
                   <Text style={styles.estimateLabel}>
                     {inputType === 'AMOUNT' ? `~ ${totalShares.toFixed(2)} Shares` : `~ $${totalCost.toFixed(2)}`}
                   </Text>
                   <Text style={styles.priceLabel}>@ ${sharePrice.toFixed(2)}</Text>
                 </View>

                 {/* Quick Chips */}
                 <View style={styles.chipsRow}>
                    {[10, 50, 100].map(amt => (
                      <TouchableOpacity key={amt} style={styles.chip} onPress={() => setValue(amt.toString())}>
                        <Text style={styles.chipText}>+{amt}</Text>
                      </TouchableOpacity>
                    ))}
                 </View>

                 <TouchableOpacity 
                   style={[styles.mainBtn, { backgroundColor: color, opacity: numValue > 0 ? 1 : 0.5 }]} 
                   onPress={handleNext}
                   disabled={numValue <= 0}
                 >
                    <Text style={styles.btnText}>Preview {label}</Text>
                 </TouchableOpacity>
              </>
            ) : (
              <>
                {/* PREVIEW STEP */}
                <View style={styles.previewCard}>
                   <View style={styles.row}>
                     <Text style={styles.rowLabel}>Shares</Text>
                     <Text style={styles.rowValue}>{totalShares.toFixed(4)}</Text>
                   </View>
                   <View style={styles.row}>
                     <Text style={styles.rowLabel}>Price</Text>
                     <Text style={styles.rowValue}>${sharePrice.toFixed(2)}</Text>
                   </View>
                   <View style={styles.row}>
                     <Text style={styles.rowLabel}>Slippage</Text>
                     <Text style={styles.rowValue}>{slippage.toFixed(1)}%</Text>
                   </View>
                   <View style={styles.row}>
                     <Text style={styles.rowLabel}>Est. Fee (0.5%)</Text>
                     <Text style={styles.rowValue}>${fee.toFixed(2)}</Text>
                   </View>
                   <View style={styles.divider} />
                   <View style={styles.row}>
                     <Text style={styles.totalLabel}>Total</Text>
                     <Text style={[styles.totalValue, { color }]}>${finalTotal.toFixed(2)}</Text>
                   </View>
                </View>

                <TouchableOpacity 
                   style={[styles.mainBtn, { backgroundColor: color }]} 
                   onPress={() => onConfirm(inputType === 'SHARES' ? numValue : totalShares, inputType === 'SHARES')}
                 >
                    <Text style={styles.btnText}>Confirm {label}</Text>
                 </TouchableOpacity>
              </>
            )}

         </KeyboardAvoidingView>
       </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 20,
    color: '#FFF',
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: '#222',
  },
  toggleText: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 13,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 16,
  },
  inputPrefix: {
    fontSize: 40,
    fontFamily: FONT_FAMILY.header,
  },
  input: {
    fontSize: 48,
    fontFamily: FONT_FAMILY.header,
    minWidth: 100,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  estimateLabel: {
    fontFamily: FONT_FAMILY.body,
    color: '#FFF',
    fontSize: 16,
  },
  priceLabel: {
    fontFamily: FONT_FAMILY.body,
    color: '#999',
    fontSize: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    backgroundColor: '#181818',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.body,
  },
  mainBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  
  // Preview
  previewCard: {
    backgroundColor: '#181818',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowLabel: {
    color: '#999',
    fontSize: 14,
    fontFamily: FONT_FAMILY.body,
  },
  rowValue: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: FONT_FAMILY.body,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 8,
  },
  totalLabel: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: FONT_FAMILY.header,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: FONT_FAMILY.header,
  },
  warningBanner: {
    backgroundColor: '#F5A623',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  warningText: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
  }
});
