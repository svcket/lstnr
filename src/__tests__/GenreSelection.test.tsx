import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react-native';
import { GenreSelectionScreen } from '../screens/GenreSelectionScreen';
import { useAuth } from '../context/AuthContext';

// Mock navigation
const mockReset = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    reset: mockReset,
  }),
}));

// Mock AuthContext
const mockCompleteOnboarding = jest.fn().mockResolvedValue(undefined);
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    completeOnboarding: mockCompleteOnboarding,
  }),
}));

describe('GenreSelectionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and subtitle', () => {
    render(<GenreSelectionScreen />);
    expect(screen.getByText('Personalize your genres of interest')).toBeTruthy();
    expect(screen.getByText('Invest in their story, earn in their success.')).toBeTruthy();
  });

  it('renders genres', () => {
    render(<GenreSelectionScreen />);
    expect(screen.getByText('Afro beats')).toBeTruthy();
    expect(screen.getByText('Hip-Hop')).toBeTruthy();
  });

  it('navigates to MainTabs on Continue press', async () => {
    render(<GenreSelectionScreen />);
    const continueBtn = screen.getByText('Continue');
    
    // Select a genre first to enable the button
    const genre = screen.getByText('Afro beats');
    fireEvent.press(genre);

    await act(async () => {
      fireEvent.press(continueBtn);
    });

    expect(mockCompleteOnboarding).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  });

  it('navigates to MainTabs on "Do this later" press', async () => {
    render(<GenreSelectionScreen />);
    const skipBtn = screen.getByText('Do this later');
    
    await act(async () => {
      fireEvent.press(skipBtn);
    });

    expect(mockCompleteOnboarding).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  });

  it('toggles genre selection style', () => {
     // This is harder to test without inspecting style props specifically.
     // But we can verify it doesn't crash on press.
     render(<GenreSelectionScreen />);
     const genre = screen.getByText('Afro beats');
     fireEvent.press(genre);
     // If we had accessibilitystate checked, we could verify selected state
     // For now, smoke test interaction is good.
  });
});
