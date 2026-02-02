import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HeaderBack } from '../../../components/common/HeaderBack';
import { COLORS, FONT_FAMILY, SPACING } from '../../../constants/theme';
import { SettingsGroup } from '../../../components/settings/SettingsGroup';
import { SettingsRow } from '../../../components/settings/SettingsRow';
import { Wallet } from 'lucide-react-native';
import { PaymentStore, Wallet as WalletType } from '../../../data/paymentStore';
import { useToast } from '../../../context/ToastContext';
import { GradientButton } from '../../../components/common/GradientButton';
import { GradientPlus } from '../../../components/common/GradientIcon';

export const WalletsListScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const [wallets, setWallets] = useState<WalletType[]>([]);
    const [defaultId, setDefaultId] = useState<string | null>(null);

    const loadData = async () => {
        const data = await PaymentStore.getData();
        setWallets(data.wallets);
        setDefaultId(data.prefs.defaultMethodId);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const handleDisconnect = (id: string) => {
        Alert.alert(
            "Disconnect Wallet",
            "Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Disconnect", 
                    style: "destructive", 
                    onPress: async () => {
                        await PaymentStore.disconnectWallet(id);
                        loadData();
                        showToast('Wallet disconnected', 'success');
                    }
                }
            ]
        );
    };

    const handleSetDefault = async (id: string) => {
        await PaymentStore.setDefaultMethod(id);
        setDefaultId(id);
        showToast('Default payment method updated', 'success');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <HeaderBack />
                    <Text style={styles.headerTitle}>Wallets</Text>
                </View>
                {wallets.length > 0 && (
                    <TouchableOpacity onPress={() => navigation.navigate('ConnectWalletSheet')}>
                        <GradientPlus size={28} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {wallets.length > 0 ? (
                    <SettingsGroup>
                        {wallets.map((wallet, index) => (
                            <SettingsRow 
                                key={wallet.id}
                                title={wallet.provider}
                                subtitle={`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                                icon={<Wallet size={20} color="#A855F7" />}
                                onPress={() => {
                                     Alert.alert(
                                        "Wallet Options",
                                        `${wallet.provider} (${wallet.address.slice(0,4)}...)`,
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            { text: "Set Default", onPress: () => handleSetDefault(wallet.id) },
                                            { text: "Disconnect", style: "destructive", onPress: () => handleDisconnect(wallet.id) }
                                        ]
                                    );
                                }}
                                rightElement={
                                    defaultId === wallet.id ? (
                                        <View style={styles.defaultBadge}>
                                            <Text style={styles.defaultText}>Default</Text>
                                        </View>
                                    ) : (
                                        <Text style={{ color: '#059669', fontSize: 12 }}>Connected</Text>
                                    )
                                }
                                isLast={index === wallets.length - 1}
                            />
                        ))}
                    </SettingsGroup>
                ) : (
                    <View style={styles.emptyState}>
                        <Wallet size={48} color="#333" />
                        <Text style={styles.emptyText}>No wallets connected</Text>
                        <Text style={styles.subText}>Connect a wallet to trade with crypto.</Text>
                        
                        <View style={{ marginTop: 24, width: '100%', alignItems: 'center' }}>
                             <GradientButton 
                                title="Connect Wallet" 
                                onPress={() => navigation.navigate('ConnectWalletSheet')}
                                style={{ width: 200 }}
                            />
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: FONT_FAMILY.header,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    content: {
        paddingHorizontal: SPACING.m,
        paddingBottom: SPACING.xl,
        paddingTop: 16,
        flexGrow: 1,
    },
    defaultBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    defaultText: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginTop: 40,
    },
    emptyText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: FONT_FAMILY.header,
        fontWeight: '600',
    },
    subText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },
});
