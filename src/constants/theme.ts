import { Platform } from 'react-native';

export const SakuraTheme = {
  colors: {
    // Canvas & Surfaces
    canvas: '#fff7f9',
    card: '#ffffff',
    cardSubtle: '#fdf2f4',
    cardHighlight: '#fce7f3',
    cardSecondary: '#f9f2f4',

    // Core Sakura Palette
    primary: '#be185d',       // Deep berry plum for primary buttons & active elements
    primaryDark: '#9d174d',   // Ultra-deep rose plum for wallet headers & balance summaries
    primaryLight: '#f472b6',  // Vibrant sakura blossom pink
    primaryPetal: '#fce7f3',  // Light sakura petal pink
    secondary: '#af275a',
    secondaryDark: '#831843', // Berry plum deep

    // Text hierarchy
    textPrimary: '#4c0519',   // Deep slate plum
    textSecondary: '#881337', // Subdued plum
    textMuted: '#9f1239',     // Currency prefix & labels
    textWhite: '#ffffff',

    // Functional & Feedback
    income: '#047857',        // Emerald green
    incomeBg: '#ecfdf5',
    incomeBorder: '#a7f3d0',
    expense: '#be185d',       // Rose crimson
    expenseBg: '#fff1f2',
    expenseBorder: '#fecdd3',
    warning: '#d97706',
    warningBg: '#fef3c7',
    warningBorder: '#fde68a',
    error: '#ba1a1a',
    errorBg: '#ffdad6',

    // Borders & Dividers
    border: '#fbcfe8',        // Soft petal outline
    borderLight: '#fdf2f4',
    outlineVariant: '#e0bec4',

    // Shadows
    shadowColor: '#9d174d',
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  typography: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'system-ui, -apple-system, sans-serif',
    }),
  },
};

export interface ThemeColorPalette {
  text: string;
  background: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

export interface ThemeColors {
  light: ThemeColorPalette;
  dark: ThemeColorPalette;
}

export const Colors: ThemeColors = {
  light: {
    text: SakuraTheme.colors.textPrimary,
    background: SakuraTheme.colors.canvas,
    tint: SakuraTheme.colors.primary,
    tabIconDefault: '#e0bec4',
    tabIconSelected: SakuraTheme.colors.primary,
  },
  dark: {
    text: SakuraTheme.colors.textPrimary,
    background: SakuraTheme.colors.canvas,
    tint: SakuraTheme.colors.primary,
    tabIconDefault: '#e0bec4',
    tabIconSelected: SakuraTheme.colors.primary,
  },
};
