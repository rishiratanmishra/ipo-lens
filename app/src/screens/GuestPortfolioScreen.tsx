import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function GuestPortfolioScreen() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceLight, borderColor: theme.colors.border }]}>
                <Ionicons name="pie-chart" size={80} color={theme.colors.primary} style={{ opacity: 0.8 }} />
            </View>

            <Text style={[styles.title, { color: theme.colors.text }]}>Track Your Portfolio</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Log in to manage your IPO applications, track allotments, and calculate profits.
            </Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={[styles.buttonText, { color: theme.colors.background }]}>Log In</Text>
                    <Ionicons name="arrow-forward" size={20} color={theme.colors.background} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.outlineButton, { borderColor: theme.colors.primary }]}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={[styles.outlineButtonText, { color: theme.colors.primary }]}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: defaultTheme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: defaultTheme.spacing.xl,
    },
    iconContainer: {
        marginBottom: defaultTheme.spacing.xl,
        padding: 20,
        backgroundColor: defaultTheme.colors.surfaceLight,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: defaultTheme.colors.border,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
        marginBottom: defaultTheme.spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: defaultTheme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: defaultTheme.spacing.xl * 2,
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    button: {
        backgroundColor: defaultTheme.colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        ...defaultTheme.shadows.button,
    },
    buttonText: {
        color: defaultTheme.colors.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: defaultTheme.colors.primary,
    },
    outlineButtonText: {
        color: defaultTheme.colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    }
});
