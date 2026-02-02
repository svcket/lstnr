import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, X, User, Shield, CreditCard, Bell, Palette, FileText, HelpCircle, Wallet, History, ChevronRight } from 'lucide-react-native';
import { COLORS, FONT_FAMILY, SPACING } from '../../constants/theme';
import { SettingsGroup } from '../../components/settings/SettingsGroup';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { HeaderBack } from '../../components/common/HeaderBack';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export const SettingsHomeScreen = () => {
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    const { theme } = useSettings();
    const [searchQuery, setSearchQuery] = useState('');

    const sections = [
        {
            id: 'account',
            title: 'Account',
            rows: [
                {
                    id: 'profile',
                    title: user?.handle || '@user',
                    subtitle: 'Manage Profile',
                    icon: <User size={20} color={COLORS.primary} />,
                    onPress: () => navigation.navigate('ManageProfile')
                },
                {
                    id: 'manage_account',
                    title: 'Manage Account',
                    icon: <User size={20} color="#666" />, // Generic user icon
                    onPress: () => navigation.navigate('SettingsAccount')
                }
            ]
        },
        {
            id: 'preferences',
            title: 'Preferences',
            rows: [
                {
                    id: 'appearance',
                    title: 'Appearance',
                    subtitle: theme.charAt(0).toUpperCase() + theme.slice(1),
                    icon: <Palette size={20} color="#A855F7" />,
                    onPress: () => navigation.navigate('SettingsAppearance')
                },
                {
                    id: 'notifications',
                    title: 'Notifications',
                    icon: <Bell size={20} color="#F59E0B" />,
                    onPress: () => navigation.navigate('SettingsNotifications')
                }
            ]
        },
        {
            id: 'payments',
            title: 'Payments',
            rows: [
                {
                    id: 'wallets',
                    title: 'Payments & Wallets',
                    icon: <CreditCard size={20} color="#10B981" />,
                    onPress: () => navigation.navigate('SettingsPayments')
                },
                {
                    id: 'transactions',
                    title: 'Transactions',
                    icon: <History size={20} color="#3B82F6" />,
                    onPress: () => navigation.navigate('SettingsTransactions')
                }
            ]
        },
        {
            id: 'security',
            title: 'Security',
            rows: [
                {
                    id: 'security_privacy',
                    title: 'Security & Privacy',
                    icon: <Shield size={20} color="#EF4444" />,
                    onPress: () => navigation.navigate('SettingsSecurity')
                }
            ]
        },
        {
            id: 'support',
            title: 'Support',
            rows: [
                {
                    id: 'help',
                    title: 'Help & Support',
                    icon: <HelpCircle size={20} color="#666" />,
                    onPress: () => navigation.navigate('SettingsHelp')
                },
                {
                    id: 'legal',
                    title: 'Legal',
                    icon: <FileText size={20} color="#666" />,
                    onPress: () => navigation.navigate('SettingsLegal')
                }
            ]
        }
    ];

    const filteredSections = useMemo(() => {
        if (!searchQuery) return sections;
        const lowerQ = searchQuery.toLowerCase();
        
        return sections.map(section => {
            const filteredRows = section.rows.filter(r => 
                r.title.toLowerCase().includes(lowerQ) || 
                (r.subtitle && r.subtitle.toLowerCase().includes(lowerQ))
            );
            return { ...section, rows: filteredRows };
        }).filter(s => s.rows.length > 0);
    }, [searchQuery, sections]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <HeaderBack />
                    <Text style={styles.headerTitle}>Settings</Text>
                </View>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Search size={18} color="#666" style={styles.searchIcon} />
                <TextInput 
                    style={styles.searchInput}
                    placeholder="Search settings"
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* List */}
            <ScrollView contentContainerStyle={styles.content}>
                {filteredSections.map(section => (
                    <SettingsGroup key={section.id}>
                        {section.rows.map((row, index) => (
                            <SettingsRow
                                key={row.id}
                                title={row.title}
                                subtitle={row.subtitle}
                                icon={row.icon}
                                onPress={row.onPress}
                                isLast={index === section.rows.length - 1}
                            />
                        ))}
                    </SettingsGroup>
                ))}
                
                {filteredSections.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No results found</Text>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.m, // 16px
        paddingVertical: SPACING.s,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: FONT_FAMILY.header,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    closeBtn: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#18181b',
        marginHorizontal: SPACING.m, // 16px
        paddingHorizontal: 12,
        height: 44,
        borderRadius: 12,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: '#27272a',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: COLORS.white,
        fontFamily: FONT_FAMILY.body,
        fontSize: 16,
    },
    content: {
        paddingHorizontal: SPACING.m, // 16px
        paddingBottom: SPACING.xl,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 40,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    }
});
