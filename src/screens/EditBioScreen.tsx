import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_FAMILY, BORDER_RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { HeaderBack } from '../components/common/HeaderBack';
import { LinearGradient } from 'expo-linear-gradient';

export const EditBioScreen = ({ navigation }: any) => {
    const { user } = useAuth();
    const [bio, setBio] = useState('');

    const handleSave = () => {
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
                        <Text style={styles.headerTitle}>Edit Bio</Text>
                    </View>
                </View>

                <View style={[styles.content, { flex: 1, justifyContent: 'space-between' }]}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Add a short bio to your profile"
                            placeholderTextColor="#666"
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity onPress={handleSave} activeOpacity={0.8} style={{ marginBottom: SPACING.m }}>
                        <LinearGradient
                            colors={COLORS.primaryGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.saveBtn}
                        >
                            <Text style={styles.saveBtnText}>Save</Text>
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
        padding: SPACING.l,
    },
    inputContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: 14, // BORDER_RADIUS.m (8) + 6px
        padding: 16,
        height: 120,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#333',
    },
    input: {
        flex: 1,
        color: COLORS.white,
        fontFamily: FONT_FAMILY.body,
        fontSize: 16,
        paddingTop: 0, 
    },
    saveBtn: {
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY.header,
    },
});
