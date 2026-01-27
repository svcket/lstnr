import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { HeaderBack } from '../components/common/HeaderBack';
import { getRecentActivity, ActivityItem } from '../data/catalog';
import { ICONS } from '../constants/assets';
import { Search, ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { FilterPill } from '../components/common/FilterPill';

export const HistoryScreen = () => {
    const navigation = useNavigation<any>();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState<'Newest' | 'Oldest' | 'High Amount' | 'Low Amount'>('Newest');

    const activity = getRecentActivity();

    const filteredActivity = useMemo(() => {
        let result = activity;

        // Search
        if (search) {
            const lower = search.toLowerCase();
            result = result.filter(item => 
                item.text.toLowerCase().includes(lower) || 
                item.amount.toLowerCase().includes(lower)
            );
        }

        // Type Filter
        if (typeFilter !== 'All') {
            result = result.filter(item => {
                if (typeFilter === 'Money In') return !item.isMoneyOut;
                if (typeFilter === 'Money Out') return item.isMoneyOut;
                return item.type === typeFilter.toUpperCase();
            });
        }

        // Sort (Mock usage since dates are strings like '2h ago', assuming input order is roughly newest)
        // Ideally we parse dates, but for mock lets just reverse or sort by amount string if possible.
        // Expanding logic slightly for demo:
        // We provided strict order in mock (newest first).
        if (sortOrder === 'Oldest') {
            result = [...result].reverse();
        } else if (sortOrder === 'High Amount') {
            result = [...result].sort((a, b) => {
                const valA = parseFloat(a.amount.replace(/[^0-9.]/g, ''));
                const valB = parseFloat(b.amount.replace(/[^0-9.]/g, ''));
                return valB - valA;
            });
        } else if (sortOrder === 'Low Amount') {
            result = [...result].sort((a, b) => {
                const valA = parseFloat(a.amount.replace(/[^0-9.]/g, ''));
                const valB = parseFloat(b.amount.replace(/[^0-9.]/g, ''));
                return valA - valB;
            });
        }

        return result;
    }, [activity, search, typeFilter, sortOrder]);

    const renderItem = ({ item, index }: { item: ActivityItem, index: number }) => {
        const isMoneyOut = item.isMoneyOut; // mapped from mock
        const color = isMoneyOut ? COLORS.error : COLORS.success;
        const Icon = isMoneyOut ? ArrowUpRight : ArrowDownLeft;
        const bg = isMoneyOut ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)';
        
        return (
        <TouchableOpacity 
            style={styles.row} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('TransactionDetail', { activity: item })}
        >
            <View style={styles.left}>
                <View style={[styles.iconContainer, { backgroundColor: bg }]}>
                    <Icon size={16} color={color} />
                </View>
                <View>
                    <Text style={styles.title}>{item.text}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
            </View>
            <Text style={styles.amount}>{item.amount}</Text>
            
            <View style={styles.divider} />
        </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <HeaderBack />
                    <Text style={styles.headerTitle}>History</Text>
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <Search size={20} color={COLORS.textSecondary} />
                    <TextInput 
                        style={styles.input}
                        placeholder="Search transactions..."
                        placeholderTextColor={COLORS.textSecondary}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Filters */}
                <View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterReq}>
                        <FilterPill label="All" isActive={typeFilter === 'All'} onPress={() => setTypeFilter('All')} />
                        <FilterPill label="Money In" isActive={typeFilter === 'Money In'} onPress={() => setTypeFilter('Money In')} />
                        <FilterPill label="Money Out" isActive={typeFilter === 'Money Out'} onPress={() => setTypeFilter('Money Out')} />
                        <View style={{ width: 1, height: 20, backgroundColor: '#333', marginHorizontal: 4 }} />
                         <FilterPill label="Sort: Newest" isActive={sortOrder === 'Newest'} onPress={() => setSortOrder(sortOrder === 'Newest' ? 'Oldest' : 'Newest')} />
                    </ScrollView>
                </View>
                
                <FlatList
                    data={filteredActivity}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 12,
        justifyContent: 'flex-start',
    },
    headerTitle: {
        fontFamily: FONT_FAMILY.header,
        fontWeight: '600',
        fontSize: 18,
        color: '#FFF',
    },
    searchContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#111',
        height: 48,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#FFF',
        fontFamily: FONT_FAMILY.body,
        fontSize: 15,
    },
    filterReq: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 8,
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: FONT_FAMILY.medium,
        fontSize: 16,
        color: '#FFF',
        marginBottom: 4,
    },
    time: {
        fontFamily: FONT_FAMILY.body,
        fontSize: 14,
        color: '#888',
    },
    amount: {
        fontFamily: FONT_FAMILY.balance,
        fontWeight: '700',
        fontSize: 16,
        color: '#FFF',
    },
    divider: {
        position: 'absolute',
        bottom: 0,
        left: 52,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    }
});
