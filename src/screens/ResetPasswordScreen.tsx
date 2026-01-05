import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, Dimensions, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONT_FAMILY, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { verifyResetCode, resetPassword } from '../services/authApi';
import { validatePassword, isPasswordStrong } from '../utils/authValidation';

const { width, height } = Dimensions.get('window');

export const ResetPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const identifier = route.params?.identifier || '';
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'otp' | 'password'>('otp');
  
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validations = validatePassword(newPassword);
  const isOtpComplete = otp.every(d => d.length === 1);
  const isPasswordValid = isPasswordStrong(newPassword);

  const handleVerifyCode = async () => {
    if (!isOtpComplete) return;
    setIsLoading(true);
    setError('');
    
    const code = otp.join('');
    try {
      const valid = await verifyResetCode(identifier, code);
      if (valid) {
        setStep('password');
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (e) {
      setError('Verification failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isPasswordValid) return;
    setIsLoading(true);
    setError('');
    
    const code = otp.join('');
    try {
      await resetPassword(identifier, code, newPassword);
      // Navigate to login with success
      navigation.navigate('Login', { identifier, passwordReset: true });
    } catch (e) {
      setError('Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Navigate to Get Started page (auth slide)
    navigation.navigate('Landing', { slide: 2 });
  };

  const renderValidationItem = (isValid: boolean, label: string) => (
    <View style={styles.validationItem}>
      <Ionicons 
        name="checkmark-circle" 
        size={16} 
        color={isValid ? COLORS.success : '#333'} 
      />
      <Text style={[styles.validationText, isValid && styles.validationTextValid]}>
        {label}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={[
          styles.modalContent,
          !isKeyboardVisible ? { paddingBottom: height * 0.3 } : {}
        ]}>
          <View style={styles.handleBar} />

          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
               <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.title}>
              {step === 'otp' ? 'Enter recovery code' : 'Create new password'}
            </Text>
            <View style={{ width: 40 }} /> 
          </View>

          <Text style={styles.subtitle}>
            {step === 'otp' 
              ? `Enter the 4-digit code sent to ${identifier}`
              : 'Choose a strong password for your account'
            }
          </Text>

          {step === 'otp' ? (
            <>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref: TextInput | null) => { inputRefs.current[index] = ref; }}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(val) => handleOtpChange(val, index)}
                    onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    autoFocus={index === 0}
                    placeholder="-"
                    placeholderTextColor="#444"
                  />
                ))}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity 
                style={[styles.actionButton, !isOtpComplete && styles.disabledButton]}
                onPress={handleVerifyCode}
                disabled={!isOtpComplete || isLoading}
              >
                <Text style={styles.actionText}>
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Choose a strong password"
                    placeholderTextColor="#555"
                    secureTextEntry={!showPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    autoCapitalize="none"
                    autoFocus
                  />
                  <TouchableOpacity 
                    style={styles.iconRight}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>

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

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity 
                style={[styles.actionButton, !isPasswordValid && styles.disabledButton]}
                onPress={handleResetPassword}
                disabled={!isPasswordValid || isLoading}
              >
                <Text style={styles.actionText}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Text>
              </TouchableOpacity>
            </>
          )}
          
          <View style={{ height: isKeyboardVisible ? 20 : 40 }} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  keyboardAvoid: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.l,
    paddingTop: 12,
    paddingBottom: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: '#222',
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
    marginBottom: 20,
  },
  closeButton: {
    width: 40, 
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT_FAMILY.header,
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT_FAMILY.body,
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  otpInput: {
    width: 60,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
    color: '#FFF',
    fontSize: 24,
    fontFamily: FONT_FAMILY.header,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#666',
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
    marginBottom: 8,
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
    paddingRight: 50,
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
    marginBottom: 24,
    gap: 8,
  },
  validationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validationText: {
    color: '#666',
    fontFamily: FONT_FAMILY.body,
    fontSize: 12,
  },
  validationTextValid: {
    color: '#FFF',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.body,
  },
  actionButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.3,
  },
  actionText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
  },
});
