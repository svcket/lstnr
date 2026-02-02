import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_FAMILY, BORDER_RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { HeaderBack } from '../components/common/HeaderBack';

export const UserNetworkScreen = ({ navigation, route }: any) => {
    const { user } = useAuth();
    const initialTab = route?.params?.type === 'following' ? 'Following' : 'Followers';
    const [activeTab, setActiveTab] = useState<'Followers' | 'Following'>(initialTab);

    // Mock data - assuming empty for now based on screenshot
    const data: string[] = []; 

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <HeaderBack />
                    <Text style={styles.headerTitle}>{user?.handle || '@svcket'}</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'Followers' && styles.activeTab]}
                    onPress={() => setActiveTab('Followers')}
                >
                    <Text style={[styles.tabText, activeTab === 'Followers' && styles.activeTabText]}>
                        Followers ({user?.followers || 0})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'Following' && styles.activeTab]}
                    onPress={() => setActiveTab('Following')}
                >
                    <Text style={[styles.tabText, activeTab === 'Following' && styles.activeTabText]}>
                        Following ({user?.following || 0})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <View style={styles.content}>
                {data.length > 0 ? (
                    <FlatList 
                        data={data}
                        renderItem={({ item }) => <Text>{item}</Text>}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {activeTab === 'Followers' ? 'No Followers' : 'Not following anyone'}
                        </Text>
                    </View>
                )}
            </View>
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
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: FONT_FAMILY.header,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.m, // 16px
        gap: 12,
        marginTop: 12,
        marginBottom: 24,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    activeTab: {
        backgroundColor: '#FFF', // White active state
    },
    tabText: {
        color: '#888',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: FONT_FAMILY.header,
    },
    activeTabText: {
        color: '#000', // Dark text on white pill
    },
    content: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
        fontFamily: FONT_FAMILY.body,
    }
});
