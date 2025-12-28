import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronRight, Bell, Shield, CircleHelp as HelpCircle, Wallet } from 'lucide-react-native'; // Fixed icon import logic if needed, Lucide usually has HelpCircle as HelpCircle or CircleHelp

export const ProfileScreen = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: Wallet, label: 'Payment Methods' },
        { icon: Bell, label: 'Notifications', hasSwitch: true },
        { icon: Shield, label: 'Privacy & Security' },
        { icon: HelpCircle, label: 'Help & Support' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileCard}>
                    <Image source={{ uri: user?.avatar }} style={styles.avatar} />
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.handle}>{user?.username}</Text>
                    <TouchableOpacity style={styles.editBtn}>
                        <Text style={styles.editBtnText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
                            <View style={styles.menuLeft}>
                                <item.icon size={20} color={COLORS.text} />
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            {item.hasSwitch ? (
                                <Switch 
                                    value={true} 
                                    trackColor={{ false: COLORS.surface, true: COLORS.primary }}
                                    thumbColor={COLORS.text}
                                />
                            ) : (
                                <ChevronRight size={20} color={COLORS.textSecondary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                    <LogOut size={20} color={COLORS.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Version 1.0.0 (Build 42)</Text>
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
    padding: SPACING.l,
    borderBottomWidth: 1,
    borderColor: COLORS.surface,
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.text,
  },
  content: {
      padding: SPACING.l,
  },
  profileCard: {
      alignItems: 'center',
      marginBottom: SPACING.xl,
  },
  avatar: {
      width: 80,
      height: 80,
      borderRadius: BORDER_RADIUS.full,
      marginBottom: SPACING.m,
      borderWidth: 2,
      borderColor: COLORS.surface,
  },
  name: {
      color: COLORS.text,
      fontSize: FONT_SIZE.l,
      fontWeight: 'bold',
      marginBottom: 4,
  },
  handle: {
      color: COLORS.textSecondary,
      fontSize: FONT_SIZE.m,
      marginBottom: SPACING.m,
  },
  editBtn: {
      paddingHorizontal: SPACING.l,
      paddingVertical: SPACING.s,
      borderRadius: BORDER_RADIUS.full,
      borderWidth: 1,
      borderColor: COLORS.border,
  },
  editBtnText: {
      color: COLORS.text,
      fontWeight: 'bold',
  },
  section: {
      marginBottom: SPACING.xl,
  },
  sectionTitle: {
      color: COLORS.textSecondary,
      fontWeight: 'bold',
      marginBottom: SPACING.m,
      marginLeft: SPACING.s,
  },
  menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: COLORS.surface,
      padding: SPACING.m,
      marginBottom: 1,
      borderRadius: BORDER_RADIUS.m,
  },
  menuLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.m,
  },
  menuLabel: {
      color: COLORS.text,
      fontSize: FONT_SIZE.m,
  },
  logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.s,
      padding: SPACING.m,
      marginBottom: SPACING.xl,
  },
  logoutText: {
      color: COLORS.error,
      fontWeight: 'bold',
      fontSize: FONT_SIZE.m,
  },
  version: {
      textAlign: 'center',
      color: COLORS.textSecondary,
      fontSize: FONT_SIZE.xs,
  },
});
