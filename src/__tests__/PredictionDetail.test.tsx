import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PredictionDetailScreen } from '../screens/PredictionDetailScreen';
import { NavigationContainer } from '@react-navigation/native';

// Mock dependencies
jest.mock('../data/catalog', () => ({
  getPredictionDetail: () => ({
    id: 'p1',
    question: 'Test Prediction?',
    description: 'Test Description',
    marketOpenAt: '2025-01-01',
    marketCloseRule: 'Rule',
    payoutNote: 'Note',
    chartData: [],
    outcomes: [
      { id: '1', name: 'Yes', color: '#00FF00', probability: 50 },
      { id: '2', name: 'No', color: '#FF0000', probability: 50 }
    ],
    volume: 1000
  })
}));

jest.mock('../components/common/HeaderBack', () => ({
  HeaderBack: () => 'HeaderBack'
}));

// Mock Native dependencies
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('lucide-react-native', () => ({
  Share: () => 'Share',
  MessageCircle: () => 'MessageCircle',
  Lock: () => 'Lock',
  Monitor: () => 'Monitor',
  ShieldCheck: () => 'ShieldCheck',
  Info: () => 'Info',
  CornerDownRight: () => 'CornerDownRight',
  Heart: () => 'Heart',
  MoreVertical: () => 'MoreVertical',
  Send: () => 'Send',
  ChevronDown: () => 'ChevronDown',
  ChevronUp: () => 'ChevronUp',
}));

jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation', () => ({
  ...jest.requireActual('react-native/Libraries/LayoutAnimation/LayoutAnimation'),
  configureNext: jest.fn(),
  Presets: { easeInEaseOut: {} },
}));

jest.mock('../data/social', () => ({
  getUserSharesInfo: () => ({ hasAccess: false }),
  MIN_SHARES_FOR_CHAT: 10,
  getPredictionHolders: () => ({
    yes: Array.from({length: 15}).map((_, i) => ({id: `y${i}`, name: `UserY${i}`, shares: 100, avatar: 'url'})),
    no: Array.from({length: 15}).map((_, i) => ({id: `n${i}`, name: `UserN${i}`, shares: 50, avatar: 'url'}))
  }),
  getComments: () => [],
  addComment: () => ({ id: 'c1', text: 'Test Comment', user: { name: 'Me' } })
}));

// Mock Navigation
const MockNavigation = () => (
    <NavigationContainer>
        <PredictionDetailScreen route={{ params: { predictionId: 'p1' } }} />
    </NavigationContainer>
);

describe('PredictionDetailScreen Layout', () => {
    it('renders the chat card with strict styling', () => {
        const { getByText } = render(<MockNavigation />);
        
        // Check for simplified title
        expect(getByText('Start a conversation!')).toBeTruthy();
        
        // Check for correct CTA text (Join Chat for all states per user request)
        // Default mock user likely has no shares, so 'Join' is expected
        const btnText = getByText(/^Join$|Join Chat/);
        expect(btnText).toBeTruthy();

        // Check for Rules/Disclosures Buttons
        expect(getByText('View rules')).toBeTruthy();
        expect(getByText('View disclosures')).toBeTruthy();
        
        // Check for Trading Prohibitions Section
        expect(getByText('Trading Prohibitions')).toBeTruthy();
    });

    it('renders the split holders view when Holders tab is active', () => {
        const { getByText, getAllByText } = render(<MockNavigation />);
        
        // Find Holders tab
        const holdersTab = getByText('Holders');
        fireEvent.press(holdersTab);
        
        // Check for Headers
        expect(getByText('Yes holders')).toBeTruthy();
        expect(getByText('No holders')).toBeTruthy();
        
        // Check for content
        expect(getByText('UserY0')).toBeTruthy();
        expect(getByText('UserN0')).toBeTruthy();
        expect(getAllByText('100 shares').length).toBeGreaterThan(0); 
    });

    it('renders the chat tab with composer', () => {
        const { getByText, getByPlaceholderText } = render(<MockNavigation />);
        
        // Switch to comments
        fireEvent.press(getByText('Chat'));
        
        // Check for input
        // Placeholder is dynamic: "Comment on $SYMBOL"
        expect(getByPlaceholderText(/Comment on/)).toBeTruthy();
    });
});
