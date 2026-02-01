import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { SettingsGroup } from '../../components/settings/SettingsGroup';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { HeaderBack } from '../../components/common/HeaderBack';
import { useSettings } from '../../context/SettingsContext';

export const SettingsAppearanceScreen = () => {
    const { theme, setTheme } = useSettings();

    const renderCheck = (selected: boolean) => (
        selected ? <Check size={20} color={COLORS.primary} /> : null
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <HeaderBack />
                <Text style={styles.title}>Appearance</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionLabel}>THEME</Text>
                <SettingsGroup>
                     <SettingsRow 
                        title="System" 
                        onPress={() => setTheme('system')}
                        rightElement={renderCheck(theme === 'system')}
                     />
                     <SettingsRow 
                        title="Dark" 
                        onPress={() => setTheme('dark')}
                        rightElement={renderCheck(theme === 'dark')}
                     />
                     <SettingsRow 
                        title="Light" 
                        onPress={() => setTheme('light')}
                        rightElement={renderCheck(theme === 'light')}
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
