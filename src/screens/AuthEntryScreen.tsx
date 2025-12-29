import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, Dimensions, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { checkIdentifierExists, requestOtp } from '../services/authApi';
import { COUNTRIES } from '../constants/countries';
import { FlatList } from 'react-native';

const { width, height } = Dimensions.get('window');

export const AuthEntryScreen = () => {
  const navigation = useNavigation<any>();
  const { setAuthMethod, authMethod, checkUserExists } = useAuth();
  
  const [inputValue, setInputValue] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // ... inside component

  // Default to Nigeria +234
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.code === '+234' && c.label === 'NG') || COUNTRIES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleContinue = async () => {
    if (!inputValue) return;
    
    // Basic validation
    if (authMethod === 'email') {
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!emailRegex.test(inputValue)) {
         setError('Enter a valid email address like name@email.com');
         return;
       }
    } else {
       // Phone validation (simple length check for now)
       if (inputValue.length < 5) {
         setError('Enter a valid phone number');
         return;
       }
    }
    
    setError('');
    
    // Combine country code if phone
    const fullIdentifier = authMethod === 'whatsapp' ? `${selectedCountry.code}${inputValue}` : inputValue;

    try {
      // 2. Check if user exists
      const exists = await checkIdentifierExists(fullIdentifier);
      
      if (exists) {
        navigation.navigate('Login', { identifier: fullIdentifier });
      } else {
        const otpResult = await requestOtp(fullIdentifier);
        if (otpResult.success) {
           // Ensure booleans are passed as booleans, not strings
           navigation.navigate('Otp', { identifier: fullIdentifier, isNewUser: true });
        } else {
           setError('Failed to request OTP. Try again.');
        }
      }
    } catch (e) {
      setError('Connection error. Please try again.');
    }
  };

  const handleLoginFallback = () => {
    // Navigate to Login regardless of existence check
    // Prefill with current input
    const fullIdentifier = authMethod === 'whatsapp' ? `${selectedCountry.code}${inputValue}` : inputValue;
    navigation.navigate('Login', { identifier: fullIdentifier });
  };

  const renderCountryPicker = () => {
    if (!showCountryPicker) return null;
    return (
      <View style={styles.countryPickerDropdown}>
        <FlatList
          data={COUNTRIES}
          keyExtractor={(item) => item.label + item.code}
          style={{ maxHeight: 300 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.countryItem}
              onPress={() => {
                setSelectedCountry(item);
                setShowCountryPicker(false);
              }}
            >
              <Text style={styles.countryItemText}>{item.flag} {item.name} ({item.code})</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  const handleClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
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
          // Maintain consistent height: if keyboard is hidden, simulate its height with padding
          !isKeyboardVisible ? { paddingBottom: height * 0.45 } : {} 
        ]}>
          {/* Handle Bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
               <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.title}>Continue Email or WhatsApp</Text>
            <View style={{ width: 40 }} /> 
          </View>

          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              activeOpacity={1}
              style={[styles.toggleBtn, authMethod === 'email' && styles.toggleBtnActive]}
              onPress={() => {
                setAuthMethod('email');
                setInputValue('');
                setError('');
                setShowCountryPicker(false);
              }}
            >
              <Text style={[styles.toggleText, authMethod === 'email' && styles.toggleTextActive]}>Email address</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              activeOpacity={1}
              style={[styles.toggleBtn, authMethod === 'whatsapp' && styles.toggleBtnActive]}
              onPress={() => {
                setAuthMethod('whatsapp');
                setInputValue('');
                setError('');
                setShowCountryPicker(false);
              }}
            >
              <Text style={[styles.toggleText, authMethod === 'whatsapp' && styles.toggleTextActive]}>WhatsApp number</Text>
            </TouchableOpacity>
          </View>

          {/* Input */}
          <View style={[styles.inputContainer, { zIndex: 10 }]}> 
            <Text style={styles.label}>
              {authMethod === 'email' ? 'Email address' : 'WhatsApp number'}
            </Text>
            
            <View style={styles.inputWrapper}>
               {authMethod === 'whatsapp' && (
                 <TouchableOpacity 
                    style={styles.countryCodeButton}
                    onPress={() => {
                      Keyboard.dismiss();
                      setShowCountryPicker(!showCountryPicker);
                    }}
                 >
                   <Text style={styles.countryCodeText}>{selectedCountry.flag} {selectedCountry.code}</Text>
                   <Ionicons name="chevron-down" size={16} color="#666" />
                 </TouchableOpacity>
               )}

               <TextInput
                 style={[styles.input, authMethod === 'whatsapp' && styles.inputWithPrefix]}
                 placeholder={authMethod === 'email' ? "name@example.com" : "800 123 4567"}
                 placeholderTextColor="#555"
                 value={inputValue}
                 onChangeText={setInputValue}
                 autoCapitalize="none"
                 keyboardType={authMethod === 'email' ? 'email-address' : 'phone-pad'}
                 autoCorrect={false}
                 returnKeyType="go"
                 onSubmitEditing={handleContinue}
                 autoFocus
                 onFocus={() => setShowCountryPicker(false)}
               />
               
               {/* Dropdown Positioned Absolute */}
               {renderCountryPicker()}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* Continue Button */}
          <TouchableOpacity 
            style={[styles.continueButton, !inputValue && styles.disabledButton]}
            onPress={handleContinue}
            disabled={!inputValue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>

          {/* Fallback Login Link */}
          <TouchableOpacity 
            style={styles.fallbackButton}
            onPress={handleLoginFallback}
          >
            <Text style={styles.fallbackText}>Already have an account? <Text style={styles.fallbackLink}>Log in</Text></Text>
          </TouchableOpacity>
          
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
    marginBottom: 30,
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A', // Dark container
    borderRadius: 25, // Pill shape
    padding: 4,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#333',
  },
  toggleBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  toggleText: {
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
    color: '#666',
  },
  toggleTextActive: {
    color: '#000000',
    fontFamily: FONT_FAMILY.bodyBold,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    color: '#666',
    fontFamily: FONT_FAMILY.body,
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 28, // Round input
    paddingHorizontal: 20,
    color: '#FFF',
    fontFamily: FONT_FAMILY.body,
    fontSize: 16,
    backgroundColor: 'transparent',
    flex: 1, // Ensure it takes full width
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 12,
    fontFamily: FONT_FAMILY.body,
  },
  continueButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.3,
  },
  continueText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    position: 'relative',
    zIndex: 10,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    paddingLeft: 20,
    paddingRight: 10,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    borderRightWidth: 0, // Merge visually
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    gap: 4,
  },
  countryCodeText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.body,
    fontSize: 16,
  },
  inputWithPrefix: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    flex: 1,
  },
  countryPickerDropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    backgroundColor: '#222',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    padding: 0,
    width: 250, // Wider for full names
    height: 300, 
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  countryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  countryItemText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
  },
  fallbackButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  fallbackText: {
    color: '#888',
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
  },
  fallbackLink: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.bodyBold,
  },
});
