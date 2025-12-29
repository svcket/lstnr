import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, Keyboard 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_FAMILY, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export const OtpScreen = () => {
  const navigation = useNavigation<any>();
  const { authIdentifier, userExists, verifyOtp, requestOtp } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Send OTP on mount
    requestOtp();
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    const code = otp.join('');
    
    // Quick validation
    if (code.length < 4) {
       setError('Please enter complete code.');
       setLoading(false);
       return;
    }

    const isValid = await verifyOtp(code);
    setLoading(false);

    if (isValid) {
      if (userExists) {
        // Go to Sign In (or Auto-Sign In if we had password-less logic, but we need password for existing)
        // Prompt said: "If user exists -> route to SignIn flow"
        navigation.navigate('Login'); // Or 'SignIn' if we rename it
      } else {
        // Go to Create Account
        navigation.navigate('CreateAccount');
      }
    } else {
      setError('Invalid code. Try 0369.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Confirm your Email address</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>
        We have sent a confirmation code to your email address ({authIdentifier})
      </Text>

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
        style={styles.verifyButton}
        onPress={handleVerify}
      >
        <Text style={styles.verifyText}>{loading ? 'Verifying...' : 'Verify'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={requestOtp} style={styles.resendBtn}>
         <Text style={styles.resendText}>Didn’t receive any code? <Text style={styles.resendLink}>Resend Code</Text></Text>
      </TouchableOpacity>

      <View style={styles.footerLinks}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footerLinkItem}>
            <Text style={styles.footerLinkText}>Use a different email</Text>
         </TouchableOpacity>
         
         <TouchableOpacity 
           onPress={() => navigation.navigate('Login', { identifier: authIdentifier })} 
           style={styles.footerLinkItem}
         >
            <Text style={[styles.footerLinkText, styles.highlightLink]}>Log in instead</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Full screen dark
    paddingHorizontal: SPACING.l,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
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
    flex: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT_FAMILY.body,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  otpInput: {
    width: 60,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    color: '#FFF',
    fontSize: 24,
    fontFamily: FONT_FAMILY.header,
    textAlign: 'center',
  },
  verifyButton: {
    height: 56,
    backgroundColor: '#FF3B30',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  verifyText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.header,
    fontSize: 16,
  },
  errorText: {
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: FONT_FAMILY.body,
  },
  resendBtn: {
    alignSelf: 'center',
  },
  resendText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.body,
  },
  resendLink: {
    color: '#FF3B30',
    fontFamily: FONT_FAMILY.bodyBold,
  },
  footerLinks: {
    marginTop: 40,
    alignItems: 'center',
    gap: 16,
  },
  footerLinkItem: {
    padding: 4,
  },
  footerLinkText: {
    color: '#888',
    fontFamily: FONT_FAMILY.body,
    fontSize: 14,
  },
  highlightLink: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.bodyBold,
  },
});
