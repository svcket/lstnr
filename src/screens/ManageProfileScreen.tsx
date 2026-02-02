import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_FAMILY, BORDER_RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { HeaderBack } from '../components/common/HeaderBack';
import { ChevronRight, Pencil, Globe } from 'lucide-react-native';

const USER_AVATAR = require('../../assets/user_avatar.png');

interface MenuItemProps {
    label: string;
    value?: string;
    icon?: React.ReactNode;
    isLast?: boolean;
    onPress?: () => void;
}

const MenuItem = ({ label, value, icon, isLast, onPress }: MenuItemProps) => (
    <TouchableOpacity 
        style={[styles.menuItem, !isLast && styles.menuItemBorder]} 
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Text style={styles.menuLabel}>{label}</Text>
        <View style={styles.menuRight}>
            {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
            {value && <Text style={styles.menuValue}>{value}</Text>}
            <ChevronRight size={16} color="#666" />
        </View>
    </TouchableOpacity>
);

export const ManageProfileScreen = ({ navigation }: any) => {
    const { user } = useAuth();

    const handleEditAvatar = () => {
        Alert.alert(
            "Change Profile Photo",
            "Choose an option",
            [
                { 
                    text: "Take Photo", 
                    onPress: () => Alert.alert("Camera", "Camera functionality would open here.") 
                },
                { 
                    text: "Choose from Library", 
                    onPress: () => Alert.alert("Gallery", "Gallery picker would open here.") 
                },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <HeaderBack />
                        <Text style={styles.headerTitle}>Manage Profile</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <Image source={USER_AVATAR} style={styles.avatar} />
                            <TouchableOpacity style={styles.editBadge} onPress={handleEditAvatar}>
                                <Pencil size={14} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* About Section */}
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.card}>
                        <MenuItem 
                            label="Username" 
                            value={user?.handle || '@svcket'} 
                            onPress={() => navigation.navigate('EditUsername')} 
                        />
                        <MenuItem 
                            label="Bio" 
                            isLast 
                            onPress={() => navigation.navigate('EditBio')} 
                        />
                    </View>

                    {/* Manage Section */}
                    <Text style={styles.sectionTitle}>Manage</Text>
                    <View style={styles.card}>
                        <MenuItem 
                            label="Followers" 
                            value={(user?.followers || 0).toString()} 
                            onPress={() => navigation.navigate('UserNetwork', { type: 'followers' })} 
                        />
                        <MenuItem 
                            label="Following" 
                            value={(user?.following || 0).toString()} 
                            onPress={() => navigation.navigate('UserNetwork', { type: 'following' })} 
                        />
                        <MenuItem 
                            label="Auth Factors" 
                            value="2" 
                            onPress={() => {}} 
                        />
                        <MenuItem 
                            label="Privacy" 
                            value="Public" 
                            icon={<Globe size={14} color="#666" />}
                            isLast 
                            onPress={() => {}} 
                        />
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: FONT_FAMILY.header,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    content: {
        paddingTop: 20,
        paddingHorizontal: SPACING.m, // 16px
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#222',
        borderWidth: 2,
        borderColor: '#222',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#333',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.background,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: FONT_FAMILY.header,
        color: '#888',
        marginBottom: 8,
        marginLeft: 4,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: COLORS.surface,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    menuLabel: {
        fontSize: 16,
        fontFamily: FONT_FAMILY.body,
        color: COLORS.white,
    },
    menuRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    menuValue: {
        fontSize: 16,
        fontFamily: FONT_FAMILY.body,
        color: '#888',
        marginRight: 4,
    },
});
