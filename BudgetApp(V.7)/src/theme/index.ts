export const theme = {
  colors: {
    primary: '#FFB23F',
    primaryDark: '#FF8F3F',
    secondary: '#2196F3',
    background: '#1A1A1A',
    surface: '#FFFFFF',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.5)',
    },
    gradients: {
      primary: ['#FFB23F', '#FF8F3F'],
      income: ['#4CAF50', '#388E3C'],
      expense: ['#F44336', '#D32F2F'],
      accounts: ['#2196F3', '#1976D2'],
      bills: ['#9C27B0', '#7B1FA2'],
      analytics: ['#FF9800', '#F57C00'],
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    circle: 9999,
  },
  typography: {
    h1: {
      size: 42,
      weight: '700',
      letterSpacing: -1,
    },
    h2: {
      size: 32,
      weight: '700',
      letterSpacing: 0,
    },
    h3: {
      size: 24,
      weight: '600',
      letterSpacing: 0,
    },
    body1: {
      size: 16,
      weight: '400',
      letterSpacing: 0.3,
    },
    body2: {
      size: 14,
      weight: '400',
      letterSpacing: 0.2,
    },
    button: {
      size: 16,
      weight: '600',
      letterSpacing: 0.3,
    },
    caption: {
      size: 12,
      weight: '400',
      letterSpacing: 0.2,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 12,
    },
  },
  animation: {
    scale: {
      pressed: 0.95,
      normal: 1,
    },
    duration: {
      short: 150,
      medium: 250,
      long: 350,
    },
  },
} as const;

export type Theme = typeof theme;

// Utility types
export type ThemeColors = keyof typeof theme.colors;
export type ThemeGradients = keyof typeof theme.colors.gradients;
export type ThemeSpacing = keyof typeof theme.spacing;
export type ThemeBorderRadius = keyof typeof theme.borderRadius;
export type ThemeTypography = keyof typeof theme.typography;
export type ThemeShadows = keyof typeof theme.shadows; 