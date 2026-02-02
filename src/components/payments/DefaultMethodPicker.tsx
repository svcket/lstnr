import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { PaymentStore, PaymentPrefs } from '../../data/paymentStore';
import { SettingsGroup } from '../settings/SettingsGroup';
import { SettingsRow } from '../settings/SettingsRow';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

const GradientCheck = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={COLORS.primaryGradient[0]} />
                <Stop offset="1" stopColor={COLORS.primaryGradient[1]} />
            </LinearGradient>
        </Defs>
        <Path 
            d="M20 6L9 17L4 12" 
            stroke="url(#grad)" 
            strokeWidth={3} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
        />
    </Svg>
);

export const DefaultMethodPicker = () => {
    const navigation = useNavigation();
    const [methods, setMethods] = useState<{ id: string; label: string; type: string }[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const loadData = async () => {
        const data = await PaymentStore.getData();
        const allMethods = [
            { id: 'ask_always', label: 'Ask every time', type: 'System' },
            ...data.cards.map(c => ({ id: c.id, label: `${c.brand} •••• ${c.last4}`, type: 'Card' })),
            ...data.wallets.map(w => ({ id: w.id, label: `${w.provider} (${w.address.slice(0,4)}...)`, type: 'Wallet' }))
        ];
        
        setMethods(allMethods);
        setSelectedId(data.prefs.defaultMethodId);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const handleSelect = async (id: string) => {
        await PaymentStore.setDefaultMethod(id);
        setSelectedId(id);
        
        // Auto close after selection for better UX
        setTimeout(() => {
            navigation.goBack();
        }, 500);
    };

    return (
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
             <View style={styles.header}>
                <Text style={styles.title}>Default Payment Method</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <X size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <SettingsGroup>
                    {methods.map((method, index) => (
                        <SettingsRow 
                            key={method.id}
                            title={method.label}
                            subtitle={method.type === 'System' ? undefined : method.type}
                            onPress={() => handleSelect(method.id)}
                            rightElement={selectedId === method.id ? <GradientCheck /> : undefined}
                            isLast={index === methods.length - 1}
                        />
                    ))}
                </SettingsGroup>
            </ScrollView>
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
    }
});
