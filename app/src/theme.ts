export const palette = {
    primary: '#34D399',
    secondary: '#1F2937',
    accent: '#60A5FA',
    success: '#10B981',
    error: '#EF4444',
    gold: '#FBBF24',
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
};

const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

const typography = {
    header: {
        fontSize: 28,
        fontWeight: 'bold' as 'bold',
    },
    subHeader: {
        fontSize: 20,
        fontWeight: '600' as '600',
    },
    body: {
        fontSize: 16,
    },
    caption: {
        fontSize: 14,
    }
};

const shadows = {
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    button: {
        shadowColor: '#34D399',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    }
};

export const darkTheme = {
    dark: true,
    colors: {
        primary: palette.primary,
        secondary: palette.gray800,
        accent: palette.accent,
        background: palette.gray900,
        surface: palette.gray800,
        surfaceLight: palette.gray700,
        text: palette.gray50,
        textSecondary: palette.gray400,
        success: palette.success,
        error: palette.error,
        border: palette.gray700,
        gold: palette.gold,
    },
    spacing,
    typography,
    shadows,
};

export const lightTheme = {
    dark: false,
    colors: {
        primary: '#059669', // Darker green for light mode
        secondary: palette.gray200,
        accent: '#2563EB', // Darker blue
        background: palette.gray50,
        surface: palette.white,
        surfaceLight: palette.gray100,
        text: palette.gray900,
        textSecondary: palette.gray700,
        success: palette.success,
        error: palette.error,
        border: palette.gray200,
        gold: '#D97706', // Darker gold
    },
    spacing,
    typography,
    shadows,
};

export type Theme = typeof darkTheme;

// Default export for backwards compatibility during migration
export const theme = darkTheme;
