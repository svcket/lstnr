import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard, Wallet } from 'lucide-react-native';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { SettingsGroup } from '../../components/settings/SettingsGroup';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { HeaderBack } from '../../components/common/HeaderBack';
import { useSettings } from '../../context/SettingsContext';

export const SettingsPaymentsScreen = () => {
    const { payments } = useSettings();

    const handleManageCard = () => {
        Alert.alert('Manage Card', 'This feature is coming soon.');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <HeaderBack />
                <Text style={styles.title}>Payments & Wallets</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionLabel}>PAYMENT METHODS</Text>
                <SettingsGroup>
                    {payments.paymentMethods.map((method, index) => (
                        <SettingsRow
                            key={method.id}
                            title={`${method.name} •••• ${method.last4}`}
                            icon={<CreditCard size={20} color="#FFF" />}
                            subtitle="Default"
                            onPress={handleManageCard}
                            isLast={index === payments.paymentMethods.length - 1}
                        />
                    ))}
                    <SettingsRow
                        title="Add New Method"
                        onPress={handleManageCard}
                        isLast
                    />
                </SettingsGroup>

                <Text style={styles.sectionLabel}>CRYPTO WALLET</Text>
                <SettingsGroup>
                     <SettingsRow 
                        title="Connect Wallet" 
                        subtitle="Not connected"
                        icon={<Wallet size={20} color="#666" />}
                        onPress={() => Alert.alert('Connect Wallet', 'Wallet connection coming soon.')}
                        isLast
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
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        marginBottom: SPACING.m,
    },
    title: {
        fontSize: 18,
        fontFamily: FONT_FAMILY.header,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    content: {
        paddingHorizontal: SPACING.l,
    },
    sectionLabel: {
        color: '#666',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        paddingLeft: 4,
    }
});
