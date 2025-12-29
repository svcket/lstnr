import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, FONT_FAMILY, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

/* 
  Restored UI with Safe Architecture:
  - Uses direct SafeAreaView (no custom wrappers)
  - Uses verified props for transforms
*/

const STEPS = ['UserType', 'Interests', 'Artists', 'Permissions'];

const USER_TYPES = [
  { id: 'artist', label: 'Independent\nArtist', rotate: '-5deg' },
  { id: 'fan', label: 'Curious\nFan', rotate: '0deg' },
  { id: 'label', label: 'Record\nLabel', rotate: '5deg' },
];

export const OnboardingScreen = () => {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState<string | null>(null);

  const handleNext = () => {
    if (!userType) return;
    completeOnboarding();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSpacer} />
      
      <View style={styles.centerContent}>
        <Text style={styles.heroTitle}>Which user best{'\n'}describes you?</Text>
        <Text style={styles.heroSubtitle}>Invest in their story, earn in their success.</Text>
        
        <View style={styles.cardsContainer}>
          {USER_TYPES.map((type) => {
            const isSelected = userType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                activeOpacity={0.9}
                onPress={() => setUserType(type.id)}
                style={[
                  styles.userTypeCard,
                  { transform: [{ rotate: type.rotate }] },
                  isSelected && styles.userTypeCardSelected
                ]}
              >
                <Text style={[styles.userTypeLabel, isSelected && { color: COLORS.white }]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.selectionIndicator}>
          {userType ? (
            <>
              <Text style={styles.selectedTypeTitle}>
                {USER_TYPES.find(t => t.id === userType)?.label.replace('\n', ' ')}
              </Text>
              <Text style={styles.selectedTypeSub}>This is selected</Text>
            </>
          ) : (
            <>
              <Text style={styles.dash}>-</Text>
              <Text style={styles.selectedTypeSub}>None selected yet</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.primaryButton, 
            !userType && styles.buttonDisabled
          ]}
          onPress={handleNext}
          disabled={!userType}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  headerSpacer: {
    height: 60,
  },
  centerContent: {
    flex: 1,
    paddingHorizontal: SPACING.m,
  },
  heroTitle: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 42,
    color: COLORS.white,
    marginBottom: SPACING.s,
    lineHeight: 46,
  },
  heroSubtitle: {
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZE.m,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 180,
    marginTop: SPACING.l,
    gap: 12,
  },
  userTypeCard: {
    width: 100,
    height: 130,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.l,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  userTypeCardSelected: {
    borderColor: COLORS.white,
    borderWidth: 2,
    backgroundColor: '#2A2A2A',
  },
  userTypeLabel: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  selectionIndicator: {
    alignItems: 'center',
    marginTop: 60, 
    height: 60,
  },
  selectedTypeTitle: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 4,
  },
  dash: {
    fontFamily: FONT_FAMILY.header,
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 4,
  },
  selectedTypeSub: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  footer: {
    padding: SPACING.l,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#331010', 
    opacity: 1, 
  },
  buttonText: {
    fontFamily: FONT_FAMILY.header,
    color: COLORS.white,
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
