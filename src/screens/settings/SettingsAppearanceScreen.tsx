import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBack } from '../../components/common/HeaderBack';
import { COLORS, SPACING } from '../../constants/theme';
import { SettingsGroup } from '../../components/settings/SettingsGroup';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { useSettings } from '../../context/SettingsContext';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

const GradientCheck = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={COLORS.primaryGradient[0]} />
                <Stop offset="1" stopColor={COLORS.primaryGradient[1]} />
            </LinearGradient>
        </Defs>
        <Path d="M20 6L9 17L4 12" stroke="url(#grad)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const SettingsAppearanceScreen = () => {
    const { theme, setTheme } = useSettings();

    const themes = [
        { id: 'system', label: 'System' },
        { id: 'dark', label: 'Dark Mode' },
        { id: 'light', label: 'Light Mode' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <HeaderBack title="Appearance" />
            <ScrollView contentContainerStyle={styles.content}>
                <SettingsGroup>
                    {themes.map((t, index) => (
                        <SettingsRow
                            key={t.id}
                            title={t.label}
                            onPress={() => setTheme(t.id as any)}
                            rightElement={theme === t.id ? <GradientCheck /> : undefined}
                            isLast={index === themes.length - 1}
                        />
                    ))}
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
    content: {
        paddingHorizontal: SPACING.m,
        paddingTop: 16,
    }
});
