import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const INTERESTS = ['Pop', 'Electronic', 'Hip Hop', 'Indie', 'R&B', 'Rock', 'K-Pop', 'Latin'];

export const OnboardingScreen = () => {
  const { completeOnboarding } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      setSelected(selected.filter(i => i !== interest));
    } else {
      setSelected([...selected, interest]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What moves you?</Text>
        <Text style={styles.subtitle}>Select genres to customize your feed.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {INTERESTS.map((interest) => (
          <TouchableOpacity
            key={interest}
            style={[
              styles.chip,
              selected.includes(interest) && styles.chipSelected
            ]}
            onPress={() => toggleInterest(interest)}
          >
            <Text style={[
              styles.chipText,
              selected.includes(interest) && styles.chipTextSelected
            ]}>
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
          onPress={completeOnboarding}
          disabled={selected.length === 0}
        >
          <Text style={styles.buttonText}>Get Started</Text>
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
  header: {
    padding: SPACING.l,
    marginTop: SPACING.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  subtitle: {
    fontSize: FONT_SIZE.m,
    color: COLORS.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.l,
    gap: SPACING.m,
  },
  chip: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.l,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.m,
  },
  chipTextSelected: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
  footer: {
    padding: SPACING.l,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.l,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.l,
  },
});
