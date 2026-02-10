import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, FONT_FAMILY } from '../../constants/theme';
import { Copy } from 'lucide-react-native';
import { Creator } from '../../data/catalog';

interface CreatorCardProps {
    creator: Creator;
}

export const CreatorCard = ({ creator }: CreatorCardProps) => {
    const [isFollowing, setIsFollowing] = useState(false);

    return (
        <View style={styles.creatorSection}>
            <Text style={styles.sectionHeader}>Created by</Text>
            <View style={styles.creatorCard}>
                <Image source={{ uri: creator.avatarUrl }} style={styles.creatorAvatar} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={styles.creatorName}>{creator.name}</Text>
                        {creator.isVerified && (
                            <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#F5A623', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 8, color: '#000', fontWeight: 'bold' }}>✓</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.badgesRow}>
                        {creator.tokenSymbol && (
                            <TouchableOpacity style={styles.badgePill}>
                                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFF', marginRight: 4 }} />
                                <Text style={styles.badgeText}>{creator.tokenSymbol}</Text>
                                <Copy size={10} color="#999" style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                        )}
                        {creator.walletAddress && (
                            <TouchableOpacity
                                style={styles.badgePill}
                                onPress={() => {
                                    alert('Address copied to clipboard'); // Mock behavior
                                }}
                            >
                                <Text style={styles.badgeText}>{creator.walletAddress}</Text>
                                <Copy size={10} color="#999" style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.followBtn, isFollowing && { backgroundColor: '#333' }]}
                    onPress={() => setIsFollowing(!isFollowing)}
                >
                    <Text style={[styles.followText, isFollowing && { color: '#FFF' }]}>
                        {isFollowing ? 'Following' : 'Follow'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    creatorSection: {
        marginBottom: 24,
    },
    sectionHeader: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: FONT_FAMILY.header,
        marginBottom: 16,
    },
    creatorCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.stroke.settings,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    creatorAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#333',
        marginRight: 8 // Added margin for spacing
    },
    creatorName: {
        color: '#FFF',
        fontFamily: FONT_FAMILY.balance,
        fontSize: 16,
        fontWeight: 'bold' // Enforce bold as per requirements
    },
    badgesRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 6,
    },
    badgePill: {
        backgroundColor: '#222',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeText: {
        color: '#CCC',
        fontSize: 12,
        fontFamily: FONT_FAMILY.body,
    },
    followBtn: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    followText: {
        color: '#000',
        fontFamily: FONT_FAMILY.balance,
        fontSize: 14,
        fontWeight: '700'
    },
});
