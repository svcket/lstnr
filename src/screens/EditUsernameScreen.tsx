import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_FAMILY, BORDER_RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { HeaderBack } from '../components/common/HeaderBack';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';

export const EditUsernameScreen = ({ navigation }: any) => {
    const { user } = useAuth();
    const [username, setUsername] = useState(user?.handle || '');

    const handleClear = () => setUsername('');
    const handleSave = () => {
        // Mock save logic, should ideally call API
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <HeaderBack />
                        <Text style={styles.headerTitle}>Edit Username</Text>
                    </View>
                </View>

                <View style={[styles.content, { flex: 1, justifyContent: 'space-between' }]}>
                    <View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Username"
                                placeholderTextColor="#666"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {username.length > 0 && (
                                <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                                    <X size={16} color="#FFF" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoText}>Usernames can be changed once every 14 days</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={username.length === 0}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={username.length > 0 ? COLORS.primaryGradient : ['#333', '#333']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.saveBtn, username.length === 0 && styles.disabledBtn]}
                        >
                            <Text style={[styles.saveBtnText, username.length === 0 && { color: '#666' }]}>Save</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
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
        padding: SPACING.m,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 28,
        paddingHorizontal: 20,
        height: 56,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    input: {
        flex: 1,
        color: COLORS.white,
        fontFamily: FONT_FAMILY.body,
        fontSize: 16,
    },
    clearBtn: {
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 12,
        color: '#888',
        fontFamily: FONT_FAMILY.body,
    },
    saveBtn: {
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.m,
    },
    disabledBtn: {
        backgroundColor: '#333',
    },
    saveBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY.header,
    },
});
