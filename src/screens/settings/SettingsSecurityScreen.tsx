import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { SettingsGroup } from '../../components/settings/SettingsGroup';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { HeaderBack } from '../../components/common/HeaderBack';
import { useSettings } from '../../context/SettingsContext';

export const SettingsSecurityScreen = () => {
    const { security, toggleSecurity, setProfileVisibility } = useSettings();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <HeaderBack />
                <Text style={styles.title}>Security & Privacy</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionLabel}>PRIVACY</Text>
                <SettingsGroup>
                     <SettingsRow 
                        title="Profile Visibility" 
                        rightElement={
                            <Text style={styles.value}>{security.profileVisibility === 'public' ? 'Public' : 'Private'}</Text>
                        }
                        onPress={() => setProfileVisibility(security.profileVisibility === 'public' ? 'private' : 'public')}
                     />
                     <SettingsRow 
                        title="Blocked Users" 
                        rightElement={<Text style={styles.value}>0</Text>}
                        // disabled
                     />
                </SettingsGroup>

                <Text style={styles.sectionLabel}>SECURITY</Text>
                <SettingsGroup>
                    <SettingsRow 
                        title="Biometric Lock" 
                        rightElement={
                            <Switch 
                                value={security.biometricLock} 
                                onValueChange={() => toggleSecurity('biometricLock')}
                                trackColor={{ false: '#333', true: COLORS.primary }}
                            />
                        }
                    />
                     <SettingsRow 
                        title="Auto-Lock" 
                        rightElement={<Text style={styles.value}>{security.autoLockMins === 0 ? 'Immediately' : `${security.autoLockMins} min`}</Text>}
                        // Mock onPress to cycle
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
    },
    value: {
        color: '#888',
        fontSize: 14,
        fontFamily: FONT_FAMILY.body,
    }
});
