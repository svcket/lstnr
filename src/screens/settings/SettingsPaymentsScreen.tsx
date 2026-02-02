import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChevronRight, CreditCard, Wallet, Shield, HelpCircle, Check, Smartphone } from 'lucide-react-native';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { HeaderBack } from '../../components/common/HeaderBack';
import { SettingsGroup } from '../../components/settings/SettingsGroup';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { GradientSwitch } from '../../components/common/GradientSwitch';
import { PaymentStore, PaymentPrefs } from '../../data/paymentStore';

export const SettingsPaymentsScreen = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();

    const [prefs, setPrefs] = useState<PaymentPrefs | null>(null);
    const [defaultLabel, setDefaultLabel] = useState("Loading...");
    const [counts, setCounts] = useState({ cards: 0, wallets: 0 });

    const loadData = async () => {
        const data = await PaymentStore.getData();
        setPrefs(data.prefs);
        
        const label = await PaymentStore.getDefaultLabel();
        setDefaultLabel(label);
        
        setCounts({
            cards: data.cards.length,
            wallets: data.wallets.length
        });
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const togglePref = async (key: keyof PaymentPrefs) => {
        if (!prefs) return;
        const newVal = !prefs[key];
        setPrefs({ ...prefs, [key]: newVal as any }); // Optimistic update
        await PaymentStore.updatePrefs({ [key]: newVal });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <HeaderBack />
                    <Text style={styles.headerTitle}>Payments & Wallets</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                
                {/* 1. Default Method */}
                <SettingsGroup>
                    <SettingsRow 
                        title="Default payment method"
                        subtitle={defaultLabel}
                        icon={<Check size={20} color={COLORS.primary} />}
                        onPress={() => navigation.navigate('DefaultMethodPicker')}
                        isLast={true}
                    />
                </SettingsGroup>
                
                {/* 2. Cards */}
                <SettingsGroup>
                    <SettingsRow 
                        title="Cards"
                        subtitle="Pay with your card when buying shares."
                        icon={<CreditCard size={20} color="#10B981" />} 
                        onPress={() => navigation.navigate('CardsList')}
                        rightElement={
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                {counts.cards > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{counts.cards}</Text>
                                    </View>
                                )}
                                <ChevronRight size={20} color="#666" />
                            </View>
                        }
                        isLast={true}
                    />
                </SettingsGroup>

                {/* 3. Wallets */}
                <SettingsGroup>
                    <SettingsRow 
                        title="Wallets"
                        subtitle="Connect a wallet to trade with crypto."
                        icon={<Wallet size={20} color="#A855F7" />}
                        onPress={() => navigation.navigate('WalletsList')}
                        rightElement={
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                {counts.wallets > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{counts.wallets}</Text>
                                    </View>
                                )}
                                <ChevronRight size={20} color="#666" />
                            </View>
                        }
                        isLast={true}
                    />
                </SettingsGroup>

                {/* 4. Preferences */}
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>PREFERENCES</Text>
                </View>
                <SettingsGroup>
                    <SettingsRow 
                        title="Auto-select best method"
                        subtitle="If on, we'll pick your last used method."
                        rightElement={
                            <GradientSwitch 
                                value={prefs?.autoSelectBest ?? false} 
                                onValueChange={() => togglePref('autoSelectBest')} 
                            />
                        }
                    />
                    <SettingsRow 
                        title="Require confirmation"
                        subtitle="Show a confirmation screen before checkout."
                        rightElement={
                            <GradientSwitch 
                                value={prefs?.requireConfirmation ?? true} 
                                onValueChange={() => togglePref('requireConfirmation')} 
                            />
                        }
                        isLast={true}
                    />
                </SettingsGroup>

                {/* 5. Security */}
                <SettingsGroup>
                    <SettingsRow 
                        title="Biometric confirmation"
                        subtitle="Coming soon"
                        icon={<Smartphone size={20} color="#EF4444" />} // Using Shield or Smartphone
                        disabled={true} // Disabled as per spec
                        rightElement={
                            <GradientSwitch value={false} onValueChange={() => {}} /> 
                        }
                        isLast={true}
                    />
                </SettingsGroup>

                {/* 6. Help */}
                <SettingsGroup>
                    <SettingsRow 
                        title="Payment FAQs"
                        icon={<HelpCircle size={20} color="#666" />}
                        onPress={() => navigation.navigate('SettingsHelp')}
                        isLast={true}
                    />
                </SettingsGroup>

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
    },
    badge: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: FONT_FAMILY.body,
    },
    sectionTitleContainer: {
        marginTop: 16, // Extra spacing before section
        marginBottom: 8,
        marginLeft: 4,
    },
    sectionTitle: {
        color: '#666',
        fontSize: 12,
        fontFamily: FONT_FAMILY.header,
        fontWeight: '600',
        letterSpacing: 1,
    }
});
