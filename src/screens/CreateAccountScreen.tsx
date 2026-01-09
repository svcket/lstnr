import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FONT_FAMILY, SPACING, COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBack } from '../components/common/HeaderBack';

export const CreateAccountScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { createAccount, completeOnboarding } = useAuth();
  
  // Passed from OtpScreen usually
  const identifier = route.params?.identifier; 

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation State
  const [validations, setValidations] = useState({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    hasLength: false,
  });

  useEffect(() => {
    setValidations({
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasLength: password.length >= 8,
    });
  }, [password]);

  const isFormValid = 
    name.length > 0 &&
    Object.values(validations).every(v => v === true);

  const handleCreate = async () => {
    if (!isFormValid) return;
    setLoading(true);
    
    try {
      await createAccount(name, password);
      // Navigate to Genre Selection instead of completing immediately
      navigation.navigate('GenreSelection');
    } catch (e) {
      console.error(e);
      alert('Failed to create account');
      setLoading(false);
    } 
    // Don't disable loading here if successful, scene transition handles it
  };

  const renderValidationItem = (isValid: boolean, label: string) => (
    <View style={styles.validationItem}>
      <Ionicons 
        name="checkmark-circle" 
        size={18} 
        color={isValid ? COLORS.success : '#333'} 
      />
      <Text style={[styles.validationText, isValid && styles.validationTextValid]}>
        {label}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.handleBar} />
      
      <View style={styles.header}>
        <HeaderBack />
        <Text style={styles.headerTitle}>Complete your account</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.introText}>
          Create your unique identity. Pick a display name and a strong password to secure your account.
        </Text>

        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First and Last name</Text>
          <View style={styles.inputWrapper}>
             <TextInput 
               style={styles.input} 
               placeholder="Enter your first and last name" 
               placeholderTextColor="#555"
               value={name}
               onChangeText={setName}
               autoCapitalize="words"
             />
             {name.length > 0 && (
               <View style={styles.iconRight}>
                 <Ionicons name="checkmark-circle" size={20} color="#FFF" />
               </View>
             )}
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
             <TextInput 
               style={styles.input} 
               placeholder="Choose a strong password" 
               placeholderTextColor="#555"
               secureTextEntry={!showPassword}
               value={password}
               onChangeText={setPassword}
               autoCapitalize="none"
             />
             <TouchableOpacity 
               style={styles.iconRight}
               onPress={() => setShowPassword(!showPassword)}
             >
               <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#FFF" />
             </TouchableOpacity>
          </View>
        </View>

        {/* Validation Grid */}
        <View style={styles.validationGrid}>
           <View style={styles.validationRow}>
              {renderValidationItem(validations.hasUpper, 'Uppercase')}
              {renderValidationItem(validations.hasLower, 'Lowercase')}
              {renderValidationItem(validations.hasNumber, 'Number')}
           </View>
           <View style={styles.validationRow}>
              {renderValidationItem(validations.hasSpecial, 'Special character')}
              {renderValidationItem(validations.hasLength, 'Minimum of 8 characters')}
           </View>
        </View>
        
        {/* Create Button */}
        <TouchableOpacity 
          style={[styles.mainButton, !isFormValid && styles.disabled]}
          onPress={handleCreate}
          disabled={!isFormValid || loading}
        >
           <Text style={styles.btnText}>
             {loading ? 'Creating account...' : 'Create account'}
           </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F', // Slightly lighter than pure black to match modal feel
    paddingTop: 60,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.l,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONT_FAMILY.header,
    color: '#FFF',
    fontSize: 18,
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
    paddingBottom: 40,
  },
  introText: {
    color: '#888',
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#666',
    fontFamily: FONT_FAMILY.body,
    marginBottom: 8,
    fontSize: 14,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingRight: 50, // Space for icon
    color: '#FFF',
    fontFamily: FONT_FAMILY.body,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  iconRight: {
    position: 'absolute',
    right: 20,
  },
  validationGrid: {
    marginTop: -8, // Pull closer to password input
    marginBottom: 32,
    gap: 12,
  },
  validationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center', // Center items like in design
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  validationText: {
    color: '#666',
    fontFamily: FONT_FAMILY.body,
    fontSize: 13,
  },
  validationTextValid: {
    color: '#FFF',
  },
  mainButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  btnText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.header, // Oswald
    fontSize: 16,
  },
});
