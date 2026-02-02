import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { SettingsGroup } from '../../components/settings/SettingsGroup';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { HeaderBack } from '../../components/common/HeaderBack';
import { useSettings } from '../../context/SettingsContext';
import { GradientSwitch } from '../../components/common/GradientSwitch';

export const SettingsNotificationsScreen = () => {
    const { notifications, toggleNotification } = useSettings();

    const renderSwitch = (val: boolean, key: keyof typeof notifications) => (
        <GradientSwitch 
            value={val} 
            onValueChange={() => toggleNotification(key)} 
        />
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <HeaderBack />
                <Text style={styles.title}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <SettingsGroup>
                     <SettingsRow 
                        title="Price Alerts" 
                        rightElement={renderSwitch(notifications.priceAlerts, 'priceAlerts')}
                     />
                     <SettingsRow 
                        title="Prediction Resolutions" 
                        rightElement={renderSwitch(notifications.predictionResolutions, 'predictionResolutions')}
                     />
                     <SettingsRow 
                        title="Mentions & Replies" 
                        rightElement={renderSwitch(notifications.mentions, 'mentions')}
                     />
                     <SettingsRow 
                        title="Marketing & News" 
                        rightElement={renderSwitch(notifications.marketing, 'marketing')}
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
        paddingHorizontal: SPACING.m, // 16px
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
