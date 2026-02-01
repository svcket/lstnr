import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { SettingsGroup } from '../../components/settings/SettingsGroup';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { HeaderBack } from '../../components/common/HeaderBack';

export const SettingsLegalScreen = () => {
    
    const openDoc = (doc: string) => {
        Alert.alert(doc, `Placeholder for ${doc} content.`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <HeaderBack />
                <Text style={styles.title}>Legal</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <SettingsGroup>
                     <SettingsRow 
                        title="Terms of Service" 
                        onPress={() => openDoc('Terms of Service')}
                     />
                     <SettingsRow 
                        title="Privacy Policy" 
                        onPress={() => openDoc('Privacy Policy')}
                     />
                     <SettingsRow 
                        title="Risk Disclosure" 
                        onPress={() => openDoc('Risk Disclosure')}
                        isLast
                     />
                </SettingsGroup>
                
                <Text style={styles.version}>Version 1.0.0 (Build 42)</Text>
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
    version: {
        color: '#444',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20
    }
});
