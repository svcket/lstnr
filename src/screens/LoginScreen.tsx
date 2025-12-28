import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const { login, isLoading } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>LSTNR</Text>
        <Text style={styles.subtitle}>Music. Markets. Culture.</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="enter@email.com"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => login(email)}
          disabled={isLoading || !email}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.buttonText}>Enter</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: SPACING.s,
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: FONT_SIZE.l,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl * 2,
  },
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  label: {
    color: COLORS.text,
    marginBottom: SPACING.s,
    fontSize: FONT_SIZE.s,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    color: COLORS.text,
    fontSize: FONT_SIZE.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.m,
  },
});
