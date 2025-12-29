import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { View, Text } from 'react-native';

const SanityComponent = () => (
  <View>
    <Text>Hello Testing World</Text>
  </View>
);

describe('Sanity Check', () => {
  it('renders correctly', () => {
    render(<SanityComponent />);
    expect(screen.getByText('Hello Testing World')).toBeTruthy();
  });

  it('math works', () => {
    expect(1 + 1).toBe(2);
  });
});
