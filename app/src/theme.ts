export const theme = {
    colors: {
        primary: '#34D399', // Bright Green (Action Buttons, Success)
        secondary: '#1F2937', // Dark Grey (Cards, Inputs)
        accent: '#60A5FA', // Blue (Links, Info)
        background: '#111827', // Very Dark Blue/Black (Main Bg)
        surface: '#1F2937', // Card Background
        surfaceLight: '#374151', // Lighter Card/Input Background
        text: '#F9FAFB', // White/Off-white
        textSecondary: '#9CA3AF', // Grey Text
        success: '#10B981',
        error: '#EF4444',
        border: '#374151',
        gold: '#FBBF24', // For 'trending' flame or accents
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    typography: {
        header: {
            fontSize: 28,
            fontWeight: 'bold' as 'bold',
            color: '#F9FAFB',
        },
        subHeader: {
            fontSize: 20,
            fontWeight: '600' as '600',
            color: '#F3F4F6',
        },
        body: {
            fontSize: 16,
            color: '#D1D5DB',
        },
        caption: {
            fontSize: 14,
            color: '#9CA3AF',
        }
    },
    shadows: {
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
    }
};

export type Theme = typeof theme;
