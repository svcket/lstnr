import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ShieldCheck } from 'lucide-react-native';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { PaymentStore } from '../../data/paymentStore';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '@react-navigation/native';
import { GradientButton } from '../common/GradientButton';

export const AddCardSheet = () => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    
    const [number, setNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock Data Autofill
    const fillMockData = () => {
        setNumber('4242 4242 4242 4242');
        setExpiry('12/28');
        setCvv('123');
        setName('John Doe');
    };

    // Basic Mock Validation
    const cleanNumber = number.replace(/\s/g, '');
    const isValid = cleanNumber.length >= 15 && expiry.length >= 5 && cvv.length >= 3 && name.length > 2;

    const handleSave = async () => {
        if (!isValid) return;
        setLoading(true);

        try {
            // Simulate network delay
            await new Promise(r => setTimeout(r, 1000));

            // Determine Brand (Mock)
            const brand = cleanNumber.startsWith('4') ? 'Visa' : cleanNumber.startsWith('5') ? 'Mastercard' : 'Card';
            const last4 = cleanNumber.slice(-4);

            await PaymentStore.saveCard({
                id: Math.random().toString(36).substr(2, 9),
                brand,
                last4,
                expMonth: expiry.split('/')[0] || '12',
                expYear: expiry.split('/')[1] || '30',
                nameOnCard: name,
            });

            showToast('Card added successfully', 'success');
            navigation.goBack();
        } catch (e) {
            showToast('Failed to add card', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.modalContainer} edges={['top']}>
             {/* Header */}
             <View style={styles.header}>
                <Text style={styles.title}>Add card</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <X size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                
                {/* Inputs */}
                <View style={styles.inputGroup}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                        <Text style={styles.label}>Card Number</Text>
                        <TouchableOpacity onPress={fillMockData}>
                            <Text style={{color: COLORS.primary, fontSize: 12}}>Autofill Mock</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput 
                        style={styles.input}
                        placeholder="0000 0000 0000 0000"
                        placeholderTextColor="#666"
                        keyboardType="number-pad"
                        value={number}
                        onChangeText={setNumber}
                        maxLength={19}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Expiry</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="MM/YY"
                            placeholderTextColor="#666"
                            keyboardType="number-pad"
                            value={expiry}
                            onChangeText={txt => {
                                // Simple formatter
                                if (txt.length === 2 && !txt.includes('/') && expiry.length < 2) {
                                    setExpiry(txt + '/');
                                } else {
                                    setExpiry(txt);
                                }
                            }}
                            maxLength={5}
                        />
                    </View>
                    <View style={{ width: 16 }} />
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>CVV</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="123"
                            placeholderTextColor="#666"
                            keyboardType="number-pad"
                            value={cvv}
                            onChangeText={setCvv}
                            maxLength={4}
                            secureTextEntry
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name on Card</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="John Doe"
                        placeholderTextColor="#666"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Secure Note */}
                <View style={styles.secureNote}>
                     <ShieldCheck size={16} color="#059669" />
                     <Text style={styles.secureText}>Card details are securely stored locally.</Text>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <GradientButton 
                    title={loading ? 'Saving...' : 'Save Card'} 
                    onPress={handleSave}
                    disabled={!isValid || loading}
                    style={{ width: '100%' }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.surface, // Modal surface
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        marginTop: 20,
    },
    title: {
        fontSize: 18,
        fontFamily: FONT_FAMILY.header,
        color: '#FFF',
        fontWeight: 'bold',
    },
    closeBtn: {
        padding: 4,
    },
    content: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#999',
        fontSize: 14,
        marginBottom: 8,
        fontFamily: FONT_FAMILY.body,
    },
    input: {
        backgroundColor: '#111',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#FFF',
        fontSize: 16,
        fontFamily: FONT_FAMILY.body,
        borderWidth: 1,
        borderColor: '#333',
    },
    row: {
        flexDirection: 'row',
    },
    secureNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    secureText: {
        color: '#059669',
        fontSize: 12,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
});
