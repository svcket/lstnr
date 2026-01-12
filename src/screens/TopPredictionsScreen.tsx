import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { getAllPredictions } from '../data/catalog';
import { PredictionCard } from '../components/artist/PredictionCard';

export const TopPredictionsScreen = () => {
    const navigation = useNavigation();
    
    // Populate list
    const basePreds = getAllPredictions();
    // Duplicating for list length
    const predictions = [...basePreds, ...basePreds].map((p, i) => ({ ...p, id: `${p.id}_${i}` }));

    const renderItem = ({ item }: { item: typeof predictions[0] }) => (
        <PredictionCard prediction={item as any} />
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <HeaderBack />
                    <Text style={styles.headerTitle}>Top Predictions</Text>
                    <View style={{ width: 40 }} /> 
                </View>

                <FlatList
                    data={predictions}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8, 
        paddingBottom: 16,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
    headerTitle: {
        fontSize: 18,
        fontFamily: FONT_FAMILY.medium,
        fontWeight: '600',
        color: '#FFF',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 40,
        gap: 16,
    },
});
