import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const palette = {
    // Premium Dark Palette
    richBlack: '#050505', // Deepest background
    deepNavy: '#0B0F19', // Main background
    surface: '#121826', // Card background
    surfaceHighlight: '#1F2937', // Lighter surface
    secondary: '#1F2937', // Compatibility alias
    
    // Accents (Neon/Vibrant)
    primary: '#10B981', // Emerald Green (unchanged base, used for success/growth)
    primaryLight: '#34D399',
    accent: '#3B82F6', // Royal Blue
    purple: '#8B5CF6', // Violet for premium feel
    action: '#F59E0B', // Gold/Amber for actions
    gold: '#F59E0B', // Compatibility alias for Gold
    
    // Functional
    success: '#059669',
    error: '#EF4444',
    warning: '#FBBF24',
    
    // Neutrals
    white: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.05)',
    glassStroke: 'rgba(255, 255, 255, 0.1)',
    text: '#F3F4F6',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    border: '#1F2937',
};

const spacing = {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

const typography = {
    header: {
        fontSize: 32,
        fontWeight: '700' as '700',
        letterSpacing: -0.5,
        color: palette.white,
    },
    subHeader: {
        fontSize: 22,
        fontWeight: '600' as '600',
        letterSpacing: -0.3,
        color: palette.text,
    },
    title: {
        fontSize: 18,
        fontWeight: '600' as '600',
        color: palette.text,
    },
    body: {
        fontSize: 15,
        fontWeight: '400' as '400',
        color: palette.textSecondary,
        lineHeight: 22,
    },
    caption: {
        fontSize: 13,
        fontWeight: '500' as '500',
        color: palette.textTertiary,
    },
    price: {
        fontSize: 24,
        fontWeight: '700' as '700',
        letterSpacing: 0.5,
        color: palette.white,
    }
};

const shadows = {
    soft: {
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    glow: {
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 10,
    }
};

const gradients = {
    primary: [palette.primary, '#059669'] as const,
    darkCard: ['#1F2937', '#111827'] as const, // Subtle gradient for cards
    glass: ['rgba(31, 41, 55, 0.7)', 'rgba(17, 24, 39, 0.8)'] as const,
    gold: ['#FBBF24', '#D97706'] as const,
    blue: ['#60A5FA', '#2563EB'] as const,
    background: [palette.deepNavy, '#050505'] as const, 
};

// Premium Light Palette ("Clean Air")
export const lightPalette = {
    richBlack: '#FFFFFF', // Inverted for light mode (Background)
    deepNavy: '#F8FAFC', // Main background ( Slate 50)
    surface: '#FFFFFF', // Card background
    surfaceHighlight: '#F1F5F9', // Lighter surface (Slate 100)
    secondary: '#E2E8F0', // Compatibility alias
    
    // Accents
    primary: '#059669', // Darker Emerald for better contrast on white
    primaryLight: '#34D399',
    accent: '#2563EB', // Darker Royal Blue
    purple: '#7C3AED', // Darker Violet
    action: '#D97706', // Darker Gold
    gold: '#D97706',
    
    // Functional
    success: '#059669',
    error: '#DC2626',
    warning: '#D97706',
    
    // Neutrals
    white: '#000000', // Inverted logic for text mostly, but better to map explicitly below
    actualWhite: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.7)', // Frosted glass for light mode
    glassStroke: 'rgba(0, 0, 0, 0.05)',
    text: '#0F172A', // Slate 900
    textSecondary: '#64748B', // Slate 500
    textTertiary: '#94A3B8', // Slate 400
    border: '#E2E8F0', // Slate 200
};

export const darkTheme = {
    dark: true,
    colors: {
        ...palette,
        background: palette.deepNavy,
        card: palette.surface,
        text: palette.text,
        border: palette.border,
        notification: palette.error,
    },
    spacing,
    typography,
    shadows,
    gradients,
    layout: {
        width,
        height,
    }
};

const lightGradients = {
    primary: ['#059669', '#34D399'] as const,
    darkCard: ['#FFFFFF', '#F8FAFC'] as const, // Subtle gradient for cards (White to v. light gray)
    glass: ['rgba(255, 255, 255, 0.8)', 'rgba(241, 245, 249, 0.9)'] as const, // Light glass
    gold: ['#F59E0B', '#FBBF24'] as const,
    blue: ['#2563EB', '#60A5FA'] as const,
    background: ['#F8FAFC', '#F1F5F9'] as const, 
};

export const lightTheme = {
    dark: false,
    colors: {
        ...lightPalette,
        richBlack: lightPalette.richBlack, // Backgrounds
        deepNavy: lightPalette.deepNavy,
        surface: lightPalette.surface,
        surfaceHighlight: lightPalette.surfaceHighlight,
        secondary: lightPalette.secondary,
        
        primary: lightPalette.primary,
        purple: lightPalette.purple,
        action: lightPalette.action,
        gold: lightPalette.gold,
        
        success: lightPalette.success,
        error: lightPalette.error,
        warning: lightPalette.warning,
        
        white: lightPalette.text, // Mapped to dark text for contrast on light backgrounds
        glass: lightPalette.glass,
        glassStroke: lightPalette.glassStroke,
        
        background: lightPalette.deepNavy,
        card: lightPalette.surface,
        text: lightPalette.text,
        textSecondary: lightPalette.textSecondary,
        textTertiary: lightPalette.textTertiary,
        border: lightPalette.border,
        notification: lightPalette.error,
    },
    spacing,
    typography: {
        ...typography,
        header: { ...typography.header, color: lightPalette.text },
        subHeader: { ...typography.subHeader, color: lightPalette.text },
        title: { ...typography.title, color: lightPalette.text },
        price: { ...typography.price, color: lightPalette.text },
    },
    shadows: {
        soft: shadows.soft,
        card: {
            shadowColor: '#64748B', // Blue-ish gray shadow for "Clean Air" feel
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 4,
        },
        glow: shadows.glow,
    },
    gradients: lightGradients,
    layout: {
        width,
        height,
    }
};

export type Theme = typeof darkTheme;
export const theme = darkTheme;

