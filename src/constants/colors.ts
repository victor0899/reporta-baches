export const Colors = {
  light: {
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F8F8F8',
    backgroundTertiary: '#F0F0F0',

    // Text colors
    text: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',

    // Primary colors
    primary: '#007AFF',
    primaryLight: '#E3F2FF',

    // Status colors
    success: '#34C759',
    warning: '#FFA500',
    error: '#FF3B30',
    info: '#007AFF',

    // UI elements
    border: '#DDDDDD',
    separator: '#E0E0E0',
    shadow: 'rgba(0, 0, 0, 0.1)',

    // Card and surface
    card: '#FFFFFF',
    surface: '#F8F8F8',

    // Input
    inputBackground: '#FFFFFF',
    inputBorder: '#DDDDDD',
    inputPlaceholder: '#999999',

    // Tab bar
    tabBarBackground: '#FFFFFF',
    tabBarActive: '#007AFF',
    tabBarInactive: '#999999',
  },
  dark: {
    // Background colors
    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    backgroundTertiary: '#2C2C2E',

    // Text colors
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#8E8E93',

    // Primary colors
    primary: '#0A84FF',
    primaryLight: '#1C2A3A',

    // Status colors
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',

    // UI elements
    border: '#38383A',
    separator: '#38383A',
    shadow: 'rgba(0, 0, 0, 0.3)',

    // Card and surface
    card: '#1C1C1E',
    surface: '#2C2C2E',

    // Input
    inputBackground: '#1C1C1E',
    inputBorder: '#38383A',
    inputPlaceholder: '#8E8E93',

    // Tab bar
    tabBarBackground: '#1C1C1E',
    tabBarActive: '#0A84FF',
    tabBarInactive: '#8E8E93',
  },
};

export type ThemeColors = typeof Colors.light;
