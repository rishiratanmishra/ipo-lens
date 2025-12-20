import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';

const { width } = Dimensions.get('window');

const MOCK_SUBSCRIPTION_DATA = [
    {
        id: '1',
        name: 'Tata Technologies',
        type: 'Mainboard',
        subscribed: '15.4x',
        priceRange: '₹475 - 500',
        progress: 0.7,
        logo: 'https://companieslogo.com/img/orig/TATA.NS-72dbc7c3.png?t=1631949774'
    },
    {
        id: '2',
        name: 'Gandhar Oil Ref.',
        type: 'Mainboard',
        subscribed: '64.x',
        priceRange: '₹160 - 169',
        progress: 0.9,
        logo: 'https://companieslogo.com/img/orig/500325.BO.png'
    }
];

const MOCK_GMP_DATA = [
    { id: '1', name: 'Inox India Ltd', range: 'Dec 14 - 18', status: 'Open', price: '₹627 - 660', gmp: '45%' },
    { id: '2', name: 'Motisons Jewellers', range: 'Dec 18 - 20', status: 'Upcoming', type: 'SME', price: '₹52 - 55', gmp: '110%' },
    { id: '3', name: 'Muthoot Microfin', range: 'Dec 18 - 20', status: 'Upcoming', price: '₹277 - 291', gmp: '12%' },
];

export default function HomeScreen({ navigation }) {
    const { user } = React.useContext(AuthContext);
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.navigate('Menu')} style={[styles.avatar, { backgroundColor: theme.colors.surfaceLight }]}>
                        <Ionicons name="menu" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.welcomeText}>WELCOME BACK</Text>
                        <Text style={[styles.userName, { color: theme.colors.text }]}>
                            {user ? user.username.split(' ')[0] : 'Investor'}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.surfaceLight }]}>
                        <Ionicons name="search" size={22} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.surfaceLight }]}>
                        <Ionicons name="notifications-outline" size={22} color={theme.colors.success} />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Tickers */}
                <View style={[styles.tickerContainer, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.tickerCard}>
                        <Text style={styles.tickerLabel}>NIFTY 50</Text>
                        <View style={styles.tickerValueRow}>
                            <Text style={[styles.tickerValue, { color: theme.colors.text }]}>20,930.50</Text>
                            <View style={styles.tickerChangePositive}>
                                <Ionicons name="trending-up" size={12} color={theme.colors.success} />
                                <Text style={styles.tickerChangeText}>0.5%</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.dividerVertical} />
                    <View style={styles.tickerCard}>
                        <Text style={styles.tickerLabel}>SENSEX</Text>
                        <View style={styles.tickerValueRow}>
                            <Text style={[styles.tickerValue, { color: theme.colors.text }]}>69,500.10</Text>
                            <View style={styles.tickerChangePositive}>
                                <Ionicons name="trending-up" size={12} color={theme.colors.success} />
                                <Text style={styles.tickerChangeText}>0.2%</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Open for Subscription */}
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <View style={[styles.statusDot, { backgroundColor: theme.colors.primary }]} />
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Open for Subscription</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('IPO')}>
                        <Text style={[styles.viewAll, { color: theme.colors.primary }]}>View All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {MOCK_SUBSCRIPTION_DATA.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.trendingCard, { backgroundColor: theme.colors.surface }]}
                            onPress={() => navigation.navigate('IPODetail', { ipo: item })}
                        >
                            <View style={styles.cardHeader}>
                                <Image source={{ uri: item.logo || 'https://via.placeholder.com/50' }} style={styles.companyLogo} />
                                <View style={[styles.statusBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                                    <Text style={[styles.statusText, { color: theme.colors.primary }]}>Live</Text>
                                </View>
                            </View>
                            <Text style={[styles.companyName, { color: theme.colors.text }]}>{item.name}</Text>
                            <Text style={[styles.companyType, { color: theme.colors.textSecondary }]}>{item.type}</Text>

                            <View style={styles.subscriptionInfo}>
                                <Text style={[styles.subLabel, { color: theme.colors.textSecondary }]}>Subscribed</Text>
                                <Text style={[styles.subValue, { color: theme.colors.text }]}>{item.subscribed}</Text>
                            </View>

                            <View style={[styles.progressBarBg, { backgroundColor: theme.colors.border }]}>
                                <View style={[styles.progressBarFill, { width: `${item.progress * 100}%`, backgroundColor: theme.colors.primary }]} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Market Pulse (GMP) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Market Pulse (GMP)</Text>
                        <TouchableOpacity>
                            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {MOCK_GMP_DATA.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.gmpCard, { backgroundColor: theme.colors.surface }]}
                            onPress={() => { }}
                        >
                            <View style={styles.gmpCardLeft}>
                                <View style={[styles.gmpIconBox, { backgroundColor: theme.colors.surfaceLight }]}>
                                    <Text style={[styles.gmpIconText, { color: theme.colors.text }]}>{item.name.charAt(0)}</Text>
                                </View>
                                <View>
                                    <Text style={[styles.gmpCompanyName, { color: theme.colors.text }]}>{item.name}</Text>
                                    <Text style={[styles.ipoDate, { color: theme.colors.textSecondary }]}>{item.range}</Text>
                                </View>
                            </View>
                            <View style={styles.gmpCardRight}>
                                <Text style={[styles.gmpDiff, { color: theme.colors.success }]}>+{item.gmp}</Text>
                                <View style={[styles.statusPill, { backgroundColor: theme.colors.surfaceLight }]}>
                                    <Text style={[styles.statusPillText, { color: theme.colors.textSecondary }]}>{item.status}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Trending GMP */}
                <View style={[styles.sectionHeader, { marginTop: theme.spacing.xl }]}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Trending GMP</Text>
                        <Text style={{ fontSize: 20 }}> 🔥</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: defaultTheme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: defaultTheme.spacing.md,
        paddingVertical: defaultTheme.spacing.sm,
        borderBottomWidth: 1, // Added for mobile header separation
        borderBottomColor: 'transparent',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: defaultTheme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 12,
        color: defaultTheme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: defaultTheme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: defaultTheme.colors.error,
        borderWidth: 1,
        borderColor: defaultTheme.colors.surface,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    tickerContainer: {
        flexDirection: 'row',
        backgroundColor: defaultTheme.colors.surface,
        margin: 20,
        padding: 16,
        borderRadius: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tickerCard: {
        flex: 1,
    },
    dividerVertical: {
        width: 1,
        height: 40,
        backgroundColor: defaultTheme.colors.border,
        marginHorizontal: 16,
    },
    tickerLabel: {
        fontSize: 12,
        color: defaultTheme.colors.textSecondary,
        marginBottom: 4,
        fontWeight: '600',
    },
    tickerValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    tickerValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    tickerChangePositive: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    tickerChangeText: {
        fontSize: 12,
        color: defaultTheme.colors.success,
        fontWeight: '600',
    },
    section: {
        marginTop: defaultTheme.spacing.lg,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
        marginTop: defaultTheme.spacing.md,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: defaultTheme.colors.primary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    viewAll: {
        fontSize: 14,
        color: defaultTheme.colors.primary,
        fontWeight: '600',
    },
    seeAllText: {
        fontSize: 14,
        color: defaultTheme.colors.primary,
        fontWeight: '600',
    },
    // New Styles for Cards
    trendingCard: {
        width: 280,
        borderRadius: 16,
        padding: 16,
        marginRight: 16,
        backgroundColor: defaultTheme.colors.surface,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    companyLogo: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: defaultTheme.colors.primary + '20',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: defaultTheme.colors.primary,
    },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: defaultTheme.colors.text,
    },
    companyType: {
        fontSize: 14,
        marginBottom: 12,
        color: defaultTheme.colors.textSecondary,
    },
    subscriptionInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    subLabel: {
        fontSize: 12,
        color: defaultTheme.colors.textSecondary,
    },
    subValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: defaultTheme.colors.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: defaultTheme.colors.primary,
        borderRadius: 3,
    },
    // GMP Card Styles
    gmpCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: defaultTheme.colors.surface,
    },
    gmpCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    gmpIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: defaultTheme.colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gmpIconText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    gmpCompanyName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
        color: defaultTheme.colors.text,
    },
    ipoDate: {
        fontSize: 12,
        color: defaultTheme.colors.textSecondary,
    },
    gmpCardRight: {
        alignItems: 'flex-end',
    },
    gmpDiff: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: defaultTheme.colors.success,
    },
    statusPill: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        backgroundColor: defaultTheme.colors.surfaceLight,
    },
    statusPillText: {
        fontSize: 10,
        fontWeight: '600',
        color: defaultTheme.colors.textSecondary,
    },
});
