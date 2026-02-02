import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HeaderBack } from '../../../components/common/HeaderBack';
import { COLORS, FONT_FAMILY, SPACING } from '../../../constants/theme';
import { SettingsGroup } from '../../../components/settings/SettingsGroup';
import { SettingsRow } from '../../../components/settings/SettingsRow';
import { CreditCard } from 'lucide-react-native';
import { PaymentStore, Card } from '../../../data/paymentStore';
import { useToast } from '../../../context/ToastContext';
import { GradientButton } from '../../../components/common/GradientButton';
import { GradientPlus } from '../../../components/common/GradientIcon';

export const CardsListScreen = () => {
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const [cards, setCards] = useState<Card[]>([]);
    const [defaultId, setDefaultId] = useState<string | null>(null);

    const loadData = async () => {
        const data = await PaymentStore.getData();
        setCards(data.cards);
        setDefaultId(data.prefs.defaultMethodId);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const handleSetDefault = async (id: string) => {
        await PaymentStore.setDefaultMethod(id);
        setDefaultId(id);
        showToast('Default payment method updated', 'success');
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Remove Card",
            "Are you sure you want to remove this card?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Remove", 
                    style: "destructive", 
                    onPress: async () => {
                        await PaymentStore.removeCard(id);
                        loadData();
                        showToast('Card removed', 'success');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <HeaderBack />
                    <Text style={styles.headerTitle}>Cards</Text>
                </View>
                {cards.length > 0 && (
                    <TouchableOpacity onPress={() => navigation.navigate('AddCardSheet')}>
                        <GradientPlus size={28} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {cards.length > 0 ? (
                    <SettingsGroup>
                        {cards.map((card, index) => (
                            <SettingsRow 
                                key={card.id}
                                title={`${card.brand} •••• ${card.last4}`}
                                subtitle={`Expires ${card.expMonth}/${card.expYear}`}
                                icon={<CreditCard size={20} color="#10B981" />}
                                onPress={() => {
                                    Alert.alert(
                                        "Card Options",
                                        `${card.brand} ending in ${card.last4}`,
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            { text: "Set Default", onPress: () => handleSetDefault(card.id) },
                                            { text: "Remove", style: "destructive", onPress: () => handleDelete(card.id) }
                                        ]
                                    );
                                }}
                                rightElement={
                                    defaultId === card.id ? (
                                        <View style={styles.defaultBadge}>
                                            <Text style={styles.defaultText}>Default</Text>
                                        </View>
                                    ) : undefined
                                }
                                isLast={index === cards.length - 1}
                            />
                        ))}
                    </SettingsGroup>
                ) : (
                    <View style={styles.emptyState}>
                        <CreditCard size={48} color="#333" />
                        <Text style={styles.emptyText}>No cards added</Text>
                        <Text style={styles.subText}>Add a card to buy shares instantly.</Text>
                        
                        <View style={{ marginTop: 24, width: '100%', alignItems: 'center' }}>
                             <GradientButton 
                                title="Add Card" 
                                onPress={() => navigation.navigate('AddCardSheet')}
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
