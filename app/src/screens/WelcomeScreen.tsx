import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    const { theme } = useTheme();

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
            <LinearGradient
                colors={[theme.colors.background, '#0f172a']}
                style={styles.background}
            />

            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Text style={[styles.logoText, { color: theme.colors.text }]}>IPO Lens</Text>
                </View>
            </View>

            <View style={styles.heroContent}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    Master the Indian <Text style={[styles.highlight, { color: theme.colors.primary }]}>IPO Market</Text>
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    Real-time GMP, subscription data, and allotment status at your fingertips.
                </Text>
            </View>

            <View style={styles.featuresContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: defaultTheme.spacing.md }}>
                    <View style={[styles.featureCard, { backgroundColor: theme.colors.surfaceLight }]}>
                        <View style={styles.featureIcon}>
                            <Ionicons name="stats-chart" size={32} color={theme.colors.accent} />
                        </View>
                        <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Track Live GMP</Text>
                        <Text style={[styles.featureDesc, { color: theme.colors.textSecondary }]}>Get real-time grey market premiums</Text>
                    </View>

                    <View style={[styles.featureCard, { backgroundColor: theme.colors.surfaceLight }]}>
                        <View style={styles.featureIcon}>
                            <Ionicons name="checkmark-circle" size={32} color={theme.colors.gold} />
                        </View>
                        <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Instant Status</Text>
                        <Text style={[styles.featureDesc, { color: theme.colors.textSecondary }]}>Check allotment status instantly</Text>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <View style={styles.trustBadge}>
                    <View style={styles.avatarGroup}>
                        <View style={[styles.avatar, { backgroundColor: '#FF6B6B', borderColor: theme.colors.background }]} />
                        <View style={[styles.avatar, { backgroundColor: '#4ECDC4', marginLeft: -10, borderColor: theme.colors.background }]} />
                        <View style={[styles.avatar, { backgroundColor: '#FFE66D', marginLeft: -10, borderColor: theme.colors.background }]} />
                    </View>
                    <Text style={[styles.trustText, { color: theme.colors.textSecondary }]}>Trusted by 50k+ Investors</Text>
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={[styles.buttonText, { color: theme.colors.background }]}>Start Tracking</Text>
                    <Ionicons name="arrow-forward" size={20} color={theme.colors.background} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.loginText, { color: theme.colors.textSecondary }]}>
                        Already have an account? <Text style={[styles.loginLink, { color: theme.colors.text }]}>Log in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: defaultTheme.colors.background,
        paddingBottom: defaultTheme.spacing.xl,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    header: {
        paddingTop: 60,
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    heroContent: {
        alignItems: 'center',
        paddingHorizontal: defaultTheme.spacing.lg,
        marginTop: defaultTheme.spacing.xl,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
        textAlign: 'center',
        lineHeight: 40,
    },
    highlight: {
        color: defaultTheme.colors.primary,
    },
    subtitle: {
        marginTop: defaultTheme.spacing.md,
        fontSize: 16,
        color: defaultTheme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    featuresContainer: {
        marginTop: defaultTheme.spacing.xl,
        marginBottom: defaultTheme.spacing.xl,
        height: 180,
    },
    featureCard: {
        width: 200,
        backgroundColor: defaultTheme.colors.surfaceLight,
        borderRadius: 16,
        padding: defaultTheme.spacing.md,
        marginRight: defaultTheme.spacing.md,
        justifyContent: 'flex-end',
    },
    featureIcon: {
        marginBottom: defaultTheme.spacing.md,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: 14,
        color: defaultTheme.colors.textSecondary,
    },
    footer: {
        paddingHorizontal: defaultTheme.spacing.lg,
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: defaultTheme.spacing.lg,
    },
    avatarGroup: {
        flexDirection: 'row',
        marginRight: defaultTheme.spacing.sm,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: defaultTheme.colors.background,
    },
    trustText: {
        color: defaultTheme.colors.textSecondary,
        fontSize: 14,
    },
    button: {
        backgroundColor: defaultTheme.colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        shadowColor: defaultTheme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: defaultTheme.colors.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginText: {
        textAlign: 'center',
        marginTop: defaultTheme.spacing.md,
        color: defaultTheme.colors.textSecondary,
        fontSize: 14,
    },
    loginLink: {
        color: defaultTheme.colors.text,
        fontWeight: 'bold',
    },
});

export default WelcomeScreen;
