import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_FAMILY, SPACING } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { Check, ShieldCheck } from 'lucide-react-native';

export const AddMethodFormScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { methodType } = route.params as { methodType: any };

    const [form, setForm] = useState({
        field1: '', // Card: Num, Bank: Routing, Crypto: Address
        field2: '', // Card: Exp, Bank: Account, Crypto: Network (optional)
        field3: '', // Card: CVV
    });
    
    // Bank Verification State
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifiedAccount, setVerifiedAccount] = useState<any>(null);

    const type = methodType.id; // 'card', 'bank', 'crypto', 'wire'

    // Validation Logic
    const isValid = () => {
        if (type === 'crypto') return form.field1.length > 20;
        if (type === 'bank') {
            if (verifiedAccount) return true; // Ready to confirm
            return form.field1.length === 9 && form.field2.length > 4; // Ready to verify
        }
        return form.field1.length > 12 && form.field2.length >= 4;
    };

    const handleAction = () => {
        if (type === 'bank' && !verifiedAccount) {
            // VERIFY FLOW
            Keyboard.dismiss();
            setIsVerifying(true);
            setTimeout(() => {
                setIsVerifying(false);
                setVerifiedAccount({
                    bankName: 'Chase Bank',
                    holderName: 'Socket User', // Mocked user name
                    mask: `...${form.field2.slice(-4)}`
                });
            }, 1500);
        } else {
            // SAVE FLOW
            const newMethod = {
                id: `new_${Date.now()}`,
                type: methodType.id.toUpperCase(),
                name: getMethodName(),
                detail: getMethodDetail(),
                icon: methodType.icon
            };

            navigation.navigate('Withdraw', { 
                newMethod: { ...newMethod, typeId: methodType.id } 
            });
        }
    };

    const getMethodName = () => {
        if (type === 'bank') return verifiedAccount?.bankName || 'Bank Account';
        if (type === 'crypto') return 'Liquidity Wallet';
        return 'Debit Card';
    };

    const getMethodDetail = () => {
        if (type === 'bank') return verifiedAccount?.mask || `...${form.field2.slice(-4)}`;
        if (type === 'crypto') return `${form.field1.slice(0, 6)}...${form.field1.slice(-4)}`;
        return `...${form.field1.slice(-4)}`;
    };

    const renderFields = () => {
        switch (type) {
            case 'crypto':
                return (
                    <>
                        <Text style={styles.label}>Wallet Address</Text>
                        <TextInput 
                            style={styles.input}
                            value={form.field1}
                            onChangeText={t => setForm(f => ({...f, field1: t}))}
                            placeholder="0x..."
                            placeholderTextColor="#444"
                            autoCapitalize="none"
                            autoFocus
                        />
                        <Text style={styles.helper}>Only ERC-20 tokens are supported on this network.</Text>
                    </>
                );
            case 'bank':
                if (verifiedAccount) {
                    return (
                        <View style={styles.verifiedCard}>
                            <View style={styles.verifiedHeader}>
                                <ShieldCheck size={24} color={COLORS.success} />
                                <Text style={styles.verifiedTitle}>Account Verified</Text>
                            </View>
                            <View style={styles.verifiedRow}>
                                <Text style={styles.verifiedLabel}>Bank</Text>
                                <Text style={styles.verifiedValue}>{verifiedAccount.bankName}</Text>
                            </View>
                            <View style={styles.verifiedRow}>
                                <Text style={styles.verifiedLabel}>Account Name</Text>
                                <Text style={styles.verifiedValue}>{verifiedAccount.holderName}</Text>
                            </View>
                            <View style={styles.verifiedRow}>
                                <Text style={styles.verifiedLabel}>Account Number</Text>
                                <Text style={styles.verifiedValue}>{verifiedAccount.mask}</Text>
                            </View>
                        </View>
                    );
                }
                return (
                    <>
                        <Text style={styles.label}>Routing Number</Text>
                        <TextInput 
                            style={styles.input}
                            value={form.field1}
                            onChangeText={t => setForm(f => ({...f, field1: t}))}
                            placeholder="000000000"
                            placeholderTextColor="#444"
                            keyboardType="number-pad"
                            maxLength={9}
                            autoFocus
                        />
                        <Text style={styles.label}>Account Number</Text>
                        <TextInput 
                            style={styles.input}
                            value={form.field2}
                            onChangeText={t => setForm(f => ({...f, field2: t}))}
                            placeholder="000000000000"
                            placeholderTextColor="#444"
                            keyboardType="number-pad"
                        />
                    </>
                );
            default: // Card
                return (
                    <>
                        <Text style={styles.label}>Card Number</Text>
                        <TextInput 
                            style={styles.input}
                            value={form.field1}
                            onChangeText={t => setForm(f => ({...f, field1: t}))}
                            placeholder="0000 0000 0000 0000"
                            placeholderTextColor="#444"
                            keyboardType="number-pad"
                            autoFocus
                        />
                         <View style={styles.row}>
                            <View style={{flex: 1}}>
                                <Text style={styles.label}>Expiry</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={form.field2}
                                    onChangeText={t => setForm(f => ({...f, field2: t}))}
                                    placeholder="MM/YY"
                                    placeholderTextColor="#444"
                                    keyboardType="number-pad"
                                    maxLength={5}
                                />
                            </View>
                            <View style={{width: 16}} />
                            <View style={{flex: 1}}>
                                <Text style={styles.label}>CVV</Text>
                                <TextInput 
                                    style={styles.input}
                                    value={form.field3}
                                    onChangeText={t => setForm(f => ({...f, field3: t}))}
                                    placeholder="123"
                                    placeholderTextColor="#444"
                                    keyboardType="number-pad"
                                    maxLength={4}
                                />
                            </View>
                        </View>
                    </>
                );
        }
    };

    const getButtonText = () => {
        if (type === 'bank' && !verifiedAccount) return isVerifying ? 'Verifying...' : 'Verify Account';
        return 'Confirm & Add';
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <HeaderBack />
                    <Text style={styles.headerTitle}>Add {methodType.name}</Text>
                </View>

                <View style={styles.content}>
                    {renderFields()}
                </View>

                <View style={styles.footer}>
                     <TouchableOpacity 
                        style={[styles.buttonWrapper, (!isValid() || isVerifying) && styles.buttonDisabled]} 
                        onPress={handleAction}
                        disabled={!isValid() || isVerifying}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={COLORS.primaryGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientBtn}
                        >
                            {isVerifying ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.buttonText}>{getButtonText()}</Text>
                            )}
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
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    label: {
        color: COLORS.textSecondary,
        fontFamily: FONT_FAMILY.body,
        fontSize: 14,
        marginBottom: 8,
        marginTop: 16,
    },
    helper: {
        color: COLORS.textSecondary,
        fontFamily: FONT_FAMILY.body,
        fontSize: 12,
        marginTop: 8,
    },
    input: {
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 16,
        color: COLORS.white,
        fontFamily: FONT_FAMILY.body,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#222',
    },
    row: {
        flexDirection: 'row',
    },
    footer: {
        padding: 16,
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
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT_FAMILY.medium,
        fontWeight: '600',
    },
    // Verified Card
    verifiedCard: {
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 20,
        marginTop: 24,
        borderWidth: 1,
        borderColor: COLORS.success + '40', // Faint green border
    },
    verifiedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    verifiedTitle: {
        color: COLORS.success,
        fontFamily: FONT_FAMILY.medium,
        fontSize: 18,
    },
    verifiedRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    verifiedLabel: {
        color: COLORS.textSecondary,
        fontFamily: FONT_FAMILY.body,
        fontSize: 14,
    },
    verifiedValue: {
        color: COLORS.white,
        fontFamily: FONT_FAMILY.medium,
        fontSize: 14,
    }
});
