import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { CreateAccountScreen } from '../screens/CreateAccountScreen';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: {
      identifier: 'test@example.com',
    },
  }),
}));

// Mock AuthContext
const mockCreateAccount = jest.fn().mockResolvedValue(undefined);
const mockCompleteOnboarding = jest.fn().mockResolvedValue(undefined);

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    createAccount: mockCreateAccount,
    completeOnboarding: mockCompleteOnboarding,
  }),
}));

describe('CreateAccountScreen Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to GenreSelection after successful account creation', async () => {
    render(<CreateAccountScreen />);

    // Fill form
    fireEvent.changeText(screen.getByPlaceholderText('Enter your first and last name'), 'Test User');
    fireEvent.changeText(screen.getByPlaceholderText('Choose a strong password'), 'Password123!');

    // Submit
    const createBtn = screen.getByText('Create account');
    fireEvent.press(createBtn);

    // Verify AuthContext called
    await waitFor(() => {
      expect(mockCreateAccount).toHaveBeenCalledWith('Test User', 'Password123!');
    });

    // Verify Navigation called
    await waitFor(() => {
      // It should NOT match 'MainTabs' or 'Landing'
      expect(mockNavigate).toHaveBeenCalledWith('GenreSelection');
    });
  });
});
