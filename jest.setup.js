// Mock Gesture Handler
import 'react-native-gesture-handler/jestSetup';

// Silence warnings if needed (NativeAnimatedHelper moved/removed in newer RN)
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Expo Font to avoid "fontFamily ... is not a system font" warnings
jest.mock('expo-font');

// Mock Lucide icons if they cause issues (though transformIgnorePatterns usually handles them)
// But often better to mock the module itself for component tests
jest.mock('lucide-react-native', () => ({
  Camera: 'Camera',
  User: 'User',
  Mail: 'Mail',
  Lock: 'Lock',
  Eye: 'Eye',
  EyeOff: 'EyeOff',
  Check: 'Check',
  ChevronDown: 'ChevronDown',
  ChevronLeft: 'ChevronLeft',
}), { virtual: true });

// Mock Expo Vector Icons similarly (ionic, crypto-icons etc) if used
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}), { virtual: true });
