export const COLORS = {
  primary: '#F53636', // Red (Gradient End)
  primaryGradient: ['#C99315', '#F53636'] as const, // Gold -> Red Gradient
  secondary: '#00FFFF', // Cyan
  background: '#0B0B0D', // Deep Black -> Charcoal
  surface: '#141417', // Updated Surface -> Charcoal Card
  surfaceLight: '#2A2A2A',
  text: '#FFFFFF', // Primary text
  textSecondary: '#9A9A9A', // Secondary text
  success: '#00FF9D',
  error: '#FF0055',
  border: '#333333',
  stroke: {
    settings: '#242428', // Settings-only border
  },
  white: '#FFFFFF',
  black: '#000000',
};

// High-saturation neon palette for icons
export const VIBRANT_COLORS = [
    '#D946EF', // Neon Purple (Fuchsia)
    '#3B82F6', // Bright Blue
    '#F472B6', // Hot Pink
    '#F97316', // Bright Orange
    '#22C55E', // Neon Green
    '#EAB308', // Bright Yellow/Gold
    '#06B6D4', // Cyan
    '#8B5CF6', // Violet
];

// Pastel palette for bright icon backgrounds (Black foreground)
export const LIGHT_PASTELS = [
    '#D1E8FF', // Sky Blue
    '#FFD1DC', // Light Pink
    '#D1FFD6', // Light Green
    '#FFFACD', // Lemon Chiffon
    '#E6E6FA', // Lavender
    '#FFE4B5', // Moccasin
    '#E0FFFF', // Light Cyan
    '#FFDAB9', // Peach Puff
];

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16, // Base
  l: 24, // Section
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const FONT_SIZE = {
  xs: 12,
  s: 14, // Body small
  m: 16, // Body default
  l: 20, // Subheader
  xl: 32, // Header
  xxl: 64, // Hero
};

export const FONT_FAMILY = {
  // Raw Weights
  regular: 'ClashDisplay-Regular',
  medium: 'ClashDisplay-Medium',
  bold: 'ClashDisplay-Bold',

  // Semantics
  body: 'ClashDisplay-Regular',   // Body + Microcopy
  header: 'ClashDisplay-Medium',  // Section Headers
  balance: 'ClashDisplay-Bold',   // Key numeric values
  mono: 'ClashDisplay-Medium',    // Tickers/Code (Alias to Medium for now)
  
  // Legacy/Helpers
  bodyBold: 'ClashDisplay-Bold', // Ensure this maps to Bold
};

export const BORDER_RADIUS = {
  s: 4,
  m: 8,
  l: 12,
  xl: 16,
  full: 9999,
  button: 80, // 80px radius for buttons
};

export const BUTTON_HEIGHT = 56;
