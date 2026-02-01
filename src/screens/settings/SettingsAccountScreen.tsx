import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { SettingsGroup } from '../../components/settings/SettingsGroup';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { HeaderBack } from '../../components/common/HeaderBack';
import { useAuth } from '../../context/AuthContext';

export const SettingsAccountScreen = () => {
    const navigation = useNavigation<any>();
    const { user, logout } = useAuth();

    const handleSignOut = async () => {
        await logout();
        navigation.navigate('Tabs', { screen: 'Explore' }); // Navigate to public screen or auth stack
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <HeaderBack />
                <Text style={styles.title}>Manage Account</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <SettingsGroup>
                     <SettingsRow 
                        title="Edit Profile" 
                        onPress={() => navigation.navigate('Profile')} // Or dedicated EditProfile if existed
                     />
                     <SettingsRow 
                        title="Username" 
                        rightElement={<Text style={styles.value}>{user?.handle}</Text>}
                        // disabled
                     />
                     {/* 
                     <SettingsRow 
                        title="Connected Accounts" 
                        rightElement={<Text style={styles.value}>0</Text>}
                     />
                     */}
                </SettingsGroup>

                <SettingsGroup>
                    <SettingsRow 
                        title="Sign Out" 
                        isDestructive 
                        onPress={handleSignOut}
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
    value: {
        color: '#888',
        fontSize: 14,
        fontFamily: FONT_FAMILY.body,
    }
});
