import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Wallet } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { PaymentStore } from '../../data/paymentStore';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '@react-navigation/native';

export const ConnectWalletSheet = () => {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const [connecting, setConnecting] = useState<string | null>(null);

    const handleConnect = async (provider: 'Phantom' | 'WalletConnect') => {
        setConnecting(provider);
        
        try {
            await new Promise(r => setTimeout(r, 1500)); // Simulate app switch/auth

            const mockAddress = `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`;
            
            await PaymentStore.saveWallet({
                id: Math.random().toString(36).substr(2, 9),
                provider,
                address: mockAddress,
                chain: provider === 'Phantom' ? 'Solana' : 'Ethereum',
                isConnected: true,
            });

            showToast(`${provider} Connected`, 'success');
            navigation.goBack();
        } catch (e) {
            showToast('Connection failed', 'error');
        } finally {
            setConnecting(null);
        }
    };

    return (
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Connect Wallet</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <X size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>Choose a wallet to connect</Text>

                <TouchableOpacity 
                    style={styles.walletOption}
                    onPress={() => handleConnect('Phantom')}
                    disabled={!!connecting}
                >
                    <View style={styles.iconPlaceholder}>
                        <Wallet size={24} color="#A855F7" />
                    </View>
                    <Text style={styles.walletName}>Phantom</Text>
                    {connecting === 'Phantom' && <Text style={styles.status}>Connecting...</Text>}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.walletOption}
                    onPress={() => handleConnect('WalletConnect')}
                    disabled={!!connecting}
                >
                     <View style={[styles.iconPlaceholder, { backgroundColor: '#3B82F6' }]}>
                        <Wallet size={24} color="#FFF" />
                    </View>
                    <Text style={styles.walletName}>WalletConnect</Text>
                    {connecting === 'WalletConnect' && <Text style={styles.status}>Connecting...</Text>}
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.surface,
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
    subtitle: {
        color: '#999',
        fontSize: 14,
        marginBottom: 24,
        fontFamily: FONT_FAMILY.body,
    },
    walletOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#18181b', // Darker card
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    iconPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    walletName: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: FONT_FAMILY.header,
        fontWeight: '600',
        flex: 1,
    },
    status: {
        color: COLORS.primary,
        fontSize: 12,
    }
});
