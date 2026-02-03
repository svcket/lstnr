import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, Dimensions, TouchableWithoutFeedback, Keyboard,
  Modal
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONT_FAMILY, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { requestPasswordReset } from '../services/authApi';
import { GradientButton } from '../components/common/GradientButton';

const { width, height } = Dimensions.get('window');

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const prefillEmail = route.params?.identifier || '';
  
  const [email, setEmail] = useState(prefillEmail);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const isFormValid = email.length > 0 && email.includes('@');

  const handleSendRecovery = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    
    try {
      await requestPasswordReset(email);
      setShowSuccessModal(true);
    } catch (e) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
       navigation.navigate('Landing', { slide: 2 });
    }
  };

  const handleGoToReset = () => {
    setShowSuccessModal(false);
    navigation.navigate('ResetPassword', { identifier: email });
  };

  return (
    <View style={styles.container}>
      {/* Dimmed Background Overlay */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={[
          styles.modalContent,
          !isKeyboardVisible ? { paddingBottom: height * 0.4 } : {}
        ]}>
          {/* Handle Bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
               <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.title}>Recover password</Text>
            <View style={{ width: 40 }} /> 
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Don't worry, happens to the best of us.{'\n'}
            Enter your email and we'll send the instruction.
          </Text>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email address</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#555"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                autoFocus
              />
              {email.length > 0 && email.includes('@') && (
                <View style={styles.iconRight}>
                  <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                </View>
              )}
            </View>
          </View>

          {/* Send Recovery Button */}
          <GradientButton 
            title={isLoading ? 'Sending...' : 'Email me a recovery link'}
            onPress={handleSendRecovery}
            disabled={!isFormValid || isLoading}
            style={styles.sendButton}
          />

          {/* Go back link */}
          <TouchableOpacity 
            style={styles.fallbackButton}
            onPress={() => navigation.replace('Login', { identifier: email })}
          >
            <Text style={styles.fallbackText}>
              Oh I remember my password now! <Text style={styles.fallbackLink}>Go back to Login</Text>
            </Text>
          </TouchableOpacity>
          
          <View style={{ height: isKeyboardVisible ? 20 : 40 }} />
        </View>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.successTitle}>Password recovery email sent</Text>
            <Text style={styles.successSubtitle}>
              A recovery mail has been sent to enable you reset your password
            </Text>
            <GradientButton 
              title="Enter recovery code"
              onPress={handleGoToReset}
              style={styles.successButton}
            />
          </View>
        </View>
      </Modal>
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
  inputGroup: {
    marginBottom: 24,
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
  sendButton: {
    marginBottom: 20,
    marginTop: 10,
  },

  fallbackButton: {
    alignSelf: 'center',
  },
  fallbackText: {
    color: '#888',
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
  },
  fallbackLink: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.header,
    fontWeight: 'bold',
  },
  // Success Modal
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
  },
  successModal: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: SPACING.xl,
    width: '100%',
    alignItems: 'center',
  },
  successTitle: {
    fontFamily: FONT_FAMILY.header,
    color: '#FFF',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontFamily: FONT_FAMILY.body,
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  successButton: {
    width: '100%',
  },
});
