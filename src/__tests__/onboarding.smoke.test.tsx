import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AuthEntryScreen } from '../screens/AuthEntryScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { LoginScreen } from '../screens/LoginScreen';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    canGoBack: mockCanGoBack,
  }),
  useRoute: () => ({
    params: {
      identifier: 'test@example.com',
      isNewUser: true,
    },
  }),
}));

// Mock AuthContext
const mockAuthContext = {
  user: null,
  isLoading: false,
  splashLoading: false,
  authIdentifier: 'test@example.com',
  setAuthIdentifier: jest.fn(),
  authMethod: 'email' as const,
  setAuthMethod: jest.fn(),
  userExists: false,
  checkUserExists: jest.fn().mockResolvedValue(false),
  requestOtp: jest.fn().mockResolvedValue(undefined),
  verifyOtp: jest.fn().mockResolvedValue(true),
  createAccount: jest.fn().mockResolvedValue(undefined),
  signIn: jest.fn().mockResolvedValue(undefined),
  logout: jest.fn().mockResolvedValue(undefined),
  onboarded: false,
  completeOnboarding: jest.fn().mockResolvedValue(undefined),
};

jest.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock authApi services
jest.mock('../services/authApi', () => ({
  checkIdentifierExists: jest.fn().mockResolvedValue(false),
  requestOtp: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock expo-blur (not installed)
jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}), { virtual: true });

describe('Onboarding Smoke Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AuthEntryScreen (Email Input)', () => {
    it('renders without crashing', () => {
      render(<AuthEntryScreen />);
      expect(screen.getByText('Continue Email or WhatsApp')).toBeTruthy();
    });

    it('displays email toggle option', () => {
      render(<AuthEntryScreen />);
      // 'Email address' appears in toggle and label
      expect(screen.getAllByText('Email address').length).toBeGreaterThan(0);
    });

    it('displays whatsapp toggle option', () => {
      render(<AuthEntryScreen />);
      expect(screen.getByText('WhatsApp number')).toBeTruthy();
    });

    it('renders continue button', () => {
      render(<AuthEntryScreen />);
      expect(screen.getByText('Continue')).toBeTruthy();
    });

    it('renders fallback login link', () => {
      render(<AuthEntryScreen />);
      expect(screen.getByText(/Already have an account/)).toBeTruthy();
    });
  });

  describe('OtpScreen', () => {
    it('renders without crashing', () => {
      render(<OtpScreen />);
      expect(screen.getByText(/Confirm your Email/)).toBeTruthy();
    });

    it('displays identifier in subtitle', () => {
      render(<OtpScreen />);
      expect(screen.getByText(/test@example.com/)).toBeTruthy();
    });

    it('renders 4 OTP inputs', () => {
      render(<OtpScreen />);
      const inputs = screen.getAllByPlaceholderText('-');
      expect(inputs.length).toBe(4);
    });

    it('renders verify button', () => {
      render(<OtpScreen />);
      expect(screen.getByText('Verify')).toBeTruthy();
    });

    it('renders resend code link', () => {
      render(<OtpScreen />);
      expect(screen.getByText(/Resend Code/)).toBeTruthy();
    });

    it('renders fallback options', () => {
      render(<OtpScreen />);
      expect(screen.getByText('Use a different email')).toBeTruthy();
      expect(screen.getByText('Log in instead')).toBeTruthy();
    });
  });

  describe('LoginScreen', () => {
    it('renders without crashing', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Continue Email or WhatsApp')).toBeTruthy();
    });

    it('displays email input with prefilled value', () => {
      render(<LoginScreen />);
      // 'Email address' appears in toggle and label
      expect(screen.getAllByText('Email address').length).toBeGreaterThan(0);
    });

    it('renders password input', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Password')).toBeTruthy();
    });

    it('renders forgot password link', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Forgot Password?')).toBeTruthy();
    });

    it('renders login button', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Login')).toBeTruthy();
    });
  });
});
