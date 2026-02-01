import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const SettingsGroup = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.group}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    group: {
        backgroundColor: COLORS.surface, 
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.stroke.settings,
    }
});
