import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';

interface EmptyStateProps {
    message?: string;
    subMessage?: string;
}

export default function EmptyState({ message = "No Data Found", subMessage = "Try adjusting your filters" }: EmptyStateProps) {
    const { theme } = useTheme();

    const getIllustration = (colors: any) => `
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Floating Particles -->
        <circle cx="45" cy="50" r="4" fill="${colors.primary}" fill-opacity="0.3"/>
        <circle cx="165" cy="40" r="3" fill="${colors.accent}" fill-opacity="0.3"/>
        <circle cx="30" cy="140" r="2" fill="${colors.textTertiary}" fill-opacity="0.3"/>

        <!-- Main Document Card -->
        <rect x="65" y="60" width="70" height="90" rx="10" fill="${colors.surface}" stroke="${colors.surfaceHighlight}" stroke-width="2"/>
        
        <!-- Document Lines -->
        <path d="M80 85H120" stroke="${colors.surfaceHighlight}" stroke-width="3" stroke-linecap="round"/>
        <path d="M80 100H110" stroke="${colors.surfaceHighlight}" stroke-width="3" stroke-linecap="round"/>
        <path d="M80 115H115" stroke="${colors.surfaceHighlight}" stroke-width="3" stroke-linecap="round"/>
        <path d="M80 130H100" stroke="${colors.surfaceHighlight}" stroke-width="3" stroke-linecap="round"/>

        <!-- Magnifying Glass -->
        <circle cx="125" cy="125" r="28" fill="${theme.dark ? colors.deepNavy : colors.white}" stroke="${colors.primary}" stroke-width="4"/>
        <path d="M146 146L162 162" stroke="${colors.primary}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Reflection/Shine on Glass -->
        <path d="M135 110C138 113 140 118 138 123" stroke="${colors.primary}" stroke-width="2" stroke-linecap="round" stroke-opacity="0.3"/>

        <!-- Question Mark -->
        <path d="M125 115C125 115 129 115 129 119C129 123 125 124 125 128" stroke="${colors.textSecondary}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="125" cy="133" r="1.5" fill="${colors.textSecondary}"/>
    </svg>
    `;

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <SvgXml xml={getIllustration(theme.colors)} width="160" height="160" />
            </View>
            <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>
            {subMessage && (
                <Text style={[styles.subMessage, { color: theme.colors.textTertiary }]}>{subMessage}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20
    },
    imageContainer: {
        marginBottom: 20,
        opacity: 0.9
    },
    message: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8
    },
    subMessage: {
        fontSize: 13,
        textAlign: 'center'
    }
});
