import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    const { theme, isDark } = useTheme();

    return (
        <View style={{ flex: 1 }}>
            <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor="transparent" translucent />
            <LinearGradient
                colors={theme.gradients.background}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={[styles.pillBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                        <View style={[styles.statusDot, { backgroundColor: theme.colors.success }]} />
                        <Text style={[styles.pillText, { color: theme.colors.textSecondary }]}>#1 IPO Tracking App</Text>
                    </View>
                </View>

                <View style={styles.heroContent}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        Master the Indian{'\n'}
                        <Text style={[styles.highlight, { color: theme.colors.primary }]}>IPO Market</Text>
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        Real-time GMP, subscription data, and allotment status at your fingertips.
                    </Text>
                </View>

                <View style={styles.featuresContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.featuresScroll}
                        decelerationRate="fast"
                        snapToInterval={220}
                    >
                        <View style={[
                            styles.featureCard,
                            {
                                backgroundColor: theme.colors.surfaceHighlight,
                                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                            }
                        ]}>
                            <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)' }]}>
                                <Ionicons name="stats-chart" size={28} color={theme.colors.accent} />
                            </View>
                            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Track Live GMP</Text>
                            <Text style={[styles.featureDesc, { color: theme.colors.textSecondary }]}>Get real-time grey market premiums updates instantly.</Text>
                        </View>

                        <View style={[
                            styles.featureCard,
                            {
                                backgroundColor: theme.colors.surfaceHighlight,
                                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                            }
                        ]}>
                            <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)' }]}>
                                <Ionicons name="checkmark-circle" size={28} color={theme.colors.gold} />
                            </View>
                            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Instant Status</Text>
                            <Text style={[styles.featureDesc, { color: theme.colors.textSecondary }]}>Check IPO allotment status across all registrars.</Text>
                        </View>

                        <View style={[
                            styles.featureCard,
                            {
                                backgroundColor: theme.colors.surfaceHighlight,
                                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                            }
                        ]}>
                            <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)' }]}>
                                <Ionicons name="notifications" size={28} color={theme.colors.success} />
                            </View>
                            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Smart Alerts</Text>
                            <Text style={[styles.featureDesc, { color: theme.colors.textSecondary }]}>Never miss a listing day or subscription deadline.</Text>
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.footer}>
                    <View style={styles.trustBadge}>
                        <View style={styles.avatarGroup}>
                            <View style={[styles.avatar, { backgroundColor: '#FF6B6B', borderColor: theme.colors.surface }]} />
                            <View style={[styles.avatar, { backgroundColor: '#4ECDC4', borderColor: theme.colors.surface }]} />
                            <View style={[styles.avatar, { backgroundColor: '#FFE66D', borderColor: theme.colors.surface }]} />
                            <View style={[styles.avatar, { backgroundColor: '#A855F7', borderColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#FFF' }}>+2k</Text>
                            </View>
                        </View>
                        <Text style={[styles.trustText, { color: theme.colors.textSecondary }]}>Trusted by 50k+ Investors</Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: theme.colors.primary,
                                shadowColor: theme.colors.primary,
                                shadowOpacity: isDark ? 0.4 : 0.2
                            }
                        ]}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={[styles.buttonText, { color: theme.colors.background }]}>Get Started</Text>
                        <Ionicons name="arrow-forward" size={20} color={theme.colors.background} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginContainer}
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.loginText, { color: theme.colors.textSecondary }]}>
                            Already have an account? <Text style={[styles.loginLink, { color: theme.colors.text }]}>Log in</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    container: {
        flexGrow: 1,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 70 : 60,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    pillBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 8,
        marginBottom: 20,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    pillText: {
        fontSize: 13,
        fontWeight: '600',
    },
    heroContent: {
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 10,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 44,
        letterSpacing: -0.5,
    },
    highlight: {
        // Inherits parent style
    },
    subtitle: {
        marginTop: 16,
        fontSize: 17,
        textAlign: 'center',
        lineHeight: 26,
        maxWidth: 300,
    },
    featuresContainer: {
        marginTop: 40,
        marginBottom: 30,
        height: 200,
    },
    featuresScroll: {
        paddingHorizontal: 24,
        paddingRight: 12,
    },
    featureCard: {
        width: 200,
        height: 180,
        borderRadius: 24,
        padding: 20,
        marginRight: 16,
        borderWidth: 1,
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    featureDesc: {
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        paddingHorizontal: 24,
        marginTop: 'auto',
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 12,
    },
    avatarGroup: {
        flexDirection: 'row',
        paddingLeft: 10,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        marginLeft: -10,
    },
    trustText: {
        fontSize: 14,
        fontWeight: '500',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
        elevation: 8,
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    loginContainer: {
        paddingVertical: 10,
    },
    loginText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
    },
    loginLink: {
        fontWeight: '700',
    },
});

export default WelcomeScreen;
