import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <LinearGradient
                colors={[theme.colors.background, '#0f172a']}
                style={styles.background}
            />

            <View style={styles.header}>
                <View style={styles.logoContainer}>
                     <Ionicons name="rupee-sign-outline" size={24} color={theme.colors.primary} />
                     <Text style={styles.logoText}>IPO Lens</Text>
                </View>
            </View>

            <View style={styles.heroContent}>
                <View style={styles.chartPlaceholder}>
                     <LinearGradient
                        colors={['rgba(52, 211, 153, 0.1)', 'rgba(52, 211, 153, 0)']}
                        style={styles.chartGlow}
                     />
                     <Ionicons name="trending-up" size={120} color={theme.colors.primary} style={{opacity: 0.8}} />
                </View>

                <Text style={styles.title}>
                    Master the Indian <Text style={styles.highlight}>IPO Market</Text>
                </Text>
                <Text style={styles.subtitle}>
                    Real-time GMP, subscription data, and allotment status at your fingertips.
                </Text>
            </View>

            <View style={styles.featuresContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft: theme.spacing.md}}>
                    <View style={styles.featureCard}>
                        <View style={styles.featureIcon}>
                            <Ionicons name="stats-chart" size={32} color={theme.colors.accent} />
                        </View>
                        <Text style={styles.featureTitle}>Track Live GMP</Text>
                        <Text style={styles.featureDesc}>Get real-time grey market premiums</Text>
                    </View>
                    
                    <View style={styles.featureCard}>
                        <View style={styles.featureIcon}>
                            <Ionicons name="checkmark-circle" size={32} color={theme.colors.gold} />
                        </View>
                        <Text style={styles.featureTitle}>Instant Status</Text>
                        <Text style={styles.featureDesc}>Check allotment status instantly</Text>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <View style={styles.trustBadge}>
                    <View style={styles.avatarGroup}>
                        <View style={[styles.avatar, {backgroundColor: '#FF6B6B'}]} />
                        <View style={[styles.avatar, {backgroundColor: '#4ECDC4', marginLeft: -10}]} />
                        <View style={[styles.avatar, {backgroundColor: '#FFE66D', marginLeft: -10}]} />
                    </View>
                    <Text style={styles.trustText}>Trusted by 50k+ Investors</Text>
                </View>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Start Tracking</Text>
                    <Ionicons name="arrow-forward" size={20} color={theme.colors.background} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>
                        Already have an account? <Text style={styles.loginLink}>Log in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: theme.colors.background,
        paddingBottom: theme.spacing.xl,
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
        color: theme.colors.text,
    },
    heroContent: {
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.xl,
    },
    chartPlaceholder: {
        width: width * 0.8,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(52, 211, 153, 0.2)',
        borderRadius: 20,
        backgroundColor: 'rgba(31, 41, 55, 0.5)',
        overflow: 'hidden',
    },
    chartGlow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        lineHeight: 40,
    },
    highlight: {
        color: theme.colors.primary,
    },
    subtitle: {
        marginTop: theme.spacing.md,
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    featuresContainer: {
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
        height: 180,
    },
    featureCard: {
        width: 200,
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: 16,
        padding: theme.spacing.md,
        marginRight: theme.spacing.md,
        justifyContent: 'flex-end',
    },
    featureIcon: {
        marginBottom: theme.spacing.md,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    footer: {
        paddingHorizontal: theme.spacing.lg,
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
    },
    avatarGroup: {
        flexDirection: 'row',
        marginRight: theme.spacing.sm,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    trustText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    button: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: theme.colors.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginText: {
        textAlign: 'center',
        marginTop: theme.spacing.md,
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    loginLink: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
});

export default WelcomeScreen;
