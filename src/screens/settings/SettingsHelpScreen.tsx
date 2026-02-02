import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { SettingsGroup } from '../../components/settings/SettingsGroup';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { HeaderBack } from '../../components/common/HeaderBack';

export const SettingsHelpScreen = () => {
    
    const handleContact = () => {
        Alert.alert('Contact Support', 'Email support@lstnr.app?');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <HeaderBack />
                <Text style={styles.title}>Help & Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <SettingsGroup>
                     <SettingsRow 
                        title="FAQs" 
                        onPress={() => Alert.alert('FAQs', 'Coming soon.')}
                     />
                     <SettingsRow 
                        title="Contact Support" 
                        onPress={handleContact}
                     />
                     <SettingsRow 
                        title="Report a Bug" 
                        onPress={() => Alert.alert('Report Bug', 'Use the dedicated bug reporter.')}
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
        paddingHorizontal: SPACING.m, // 16px
    }
});
