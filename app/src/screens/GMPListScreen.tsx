import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';
import { getIPOs, IPO } from '../services/api';

export default function GMPListScreen({ navigation }) {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('Mainboard');
    const [ipos, setIpos] = useState<IPO[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const { ipos: data } = await getIPOs(undefined, activeTab === 'SME' ? 1 : 0);
            const gmpData = data.filter(item => item.premium && item.premium !== '0');
            setIpos(gmpData);
        } catch (error) {
            console.error("Failed to load GMP data", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeTab]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'OPEN': return theme.colors.success;
            case 'UPCOMING': return theme.colors.accent;
            case 'CLOSED': return theme.colors.error;
            case 'LISTED': return theme.colors.textSecondary;
            default: return theme.colors.text;
        }
    };

    const calculateGmpStats = (item: IPO) => {
        const gmp = parseFloat(item.premium || '0');
        const price = item.max_price || 0; // Fallback to max_price

        let percentage = '0%';
        let estListing = '₹0';

        // If the premium string contains percentage (e.g. "47 (67.1%)"), we could extract it.
        // But calculating it ensures consistency with local price data.
        if (price > 0) {
            const pct = ((gmp / price) * 100).toFixed(2);
            percentage = `${pct}%`;
            estListing = `₹${price + gmp}`;
        }

        // Fallback: search for parens in premium string
        if (item.premium && item.premium.includes('(')) {
            const match = item.premium.match(/\((.*?)%\)/);
            if (match) {
                percentage = match[1] + '%';
            }
        }

        return { percentage, estListing, fire: parseFloat(percentage) > 50 };
    };

    const formatCompanyName = (name: string) => {
        if (!name) return '';
        return name
            .replace(/ (Limited|Ltd\.?|Pvt\.?|Private|IPO)$/i, '')
            .replace(/ (Limited|Ltd\.?|Pvt\.?|Private|IPO)$/i, '')
            .trim();
    };

    const renderItem = ({ item }: { item: IPO }) => {
        const { percentage, estListing, fire } = calculateGmpStats(item);
        const displayName = formatCompanyName(item.name);

        return (
            <TouchableOpacity
                style={[styles.card, { backgroundColor: theme.colors.surfaceHighlight }]}
                onPress={() => navigation.navigate('IPODetail', { ipo: item })}
            >
                <View style={[styles.cardLeft, { maxWidth: '65%' }]}>
                    <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.logoText, { color: theme.colors.text }]}>
                            {displayName.substring(0, 1) || '?'}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.companyName, { color: theme.colors.text }]} numberOfLines={1}>
                            {displayName}
                        </Text>
                        <Text style={[styles.priceRange, { color: theme.colors.textSecondary }]}>
                            {item.min_price ? `₹${item.min_price} - ${item.max_price}` : 'Price TBA'}
                        </Text>
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            ● {item.status}
                        </Text>
                    </View>
                </View>
                <View style={styles.cardRight}>
                    <View style={styles.gmpRow}>
                        {fire && <Text>🔥</Text>}
                        <Text style={[styles.gmpValue, { color: theme.colors.success }]}>₹{parseInt(item.premium || '0')}</Text>
                    </View>
                    <Text style={[styles.gmpChange, { color: theme.colors.success }]}>{percentage}</Text>
                    <Text style={[styles.estListing, { color: theme.colors.textSecondary }]}>Est: {estListing}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>GMP Trends</Text>
                <View style={styles.headerRight}>
                    <View style={[styles.updateBadge, { backgroundColor: theme.colors.surfaceHighlight }]}>
                        <Ionicons name="time-outline" size={12} color={theme.colors.textSecondary} />
                        <Text style={[styles.updateText, { color: theme.colors.textSecondary }]}>Live</Text>
                    </View>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="search" size={20} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Mainboard' && { borderBottomColor: theme.colors.primary }]}
                    onPress={() => setActiveTab('Mainboard')}
                >
                    <Text style={[
                        styles.tabText,
                        { color: theme.colors.textSecondary },
                        activeTab === 'Mainboard' && { color: theme.colors.text }
                    ]}>Mainboard</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'SME' && { borderBottomColor: theme.colors.primary }]}
                    onPress={() => setActiveTab('SME')}
                >
                    <Text style={[
                        styles.tabText,
                        { color: theme.colors.textSecondary },
                        activeTab === 'SME' && { color: theme.colors.text }
                    ]}>SME</Text>
                </TouchableOpacity>
            </View>

            <LinearGradient
                colors={theme.gradients.darkCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.heroCard, { borderColor: theme.colors.success + '40' }]}
            >
                <View>
                    <Text style={[styles.heroLabel, { color: theme.colors.success }]}>MARKET MOOD</Text>
                    <Text style={[styles.heroTitle, { color: theme.colors.text }]}>Bullish Sentiment</Text>
                    <Text style={[styles.heroSubtitle, { color: theme.colors.textSecondary }]}>High listing gains expected</Text>
                </View>
                <View style={[styles.moodIcon, { backgroundColor: theme.colors.success + '20' }]}>
                    <Ionicons name="trending-up" size={32} color={theme.colors.success} />
                </View>
            </LinearGradient>

            <View style={styles.listHeaderRow}>
                <Text style={[styles.listHeaderTitle, { color: theme.colors.text }]}>Top Gainers</Text>
                <TouchableOpacity>
                    <Ionicons name="filter" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={ipos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                    }
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ color: theme.colors.textSecondary }}>No GMP data available</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: defaultTheme.colors.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: defaultTheme.spacing.md,
        paddingVertical: defaultTheme.spacing.sm,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    updateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: defaultTheme.colors.surfaceHighlight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    updateText: {
        fontSize: 10,
        color: defaultTheme.colors.textSecondary,
    },
    iconButton: {
        padding: 4,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: defaultTheme.spacing.md,
        marginTop: defaultTheme.spacing.md,
        gap: 16,
    },
    tab: {
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: defaultTheme.colors.primary,
    },
    tabText: {
        fontSize: 16,
        color: defaultTheme.colors.textSecondary,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: defaultTheme.colors.text,
    },
    heroCard: {
        margin: defaultTheme.spacing.md,
        padding: 20,
        backgroundColor: 'rgba(52, 211, 153, 0.1)', // Light green tint
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(52, 211, 153, 0.3)',
    },
    heroLabel: {
        color: defaultTheme.colors.success,
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
        marginBottom: 2,
    },
    heroSubtitle: {
        color: defaultTheme.colors.textSecondary,
        fontSize: 12,
    },
    moodIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: defaultTheme.colors.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: defaultTheme.spacing.md,
        marginBottom: defaultTheme.spacing.sm,
    },
    listHeaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    listContent: {
        paddingHorizontal: defaultTheme.spacing.md,
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: defaultTheme.colors.surfaceHighlight,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    logoPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: defaultTheme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
        marginBottom: 2,
    },
    priceRange: {
        fontSize: 12,
        color: defaultTheme.colors.textSecondary,
        marginBottom: 2,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardRight: {
        alignItems: 'flex-end',
    },
    gmpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    gmpValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: defaultTheme.colors.success,
    },
    gmpChange: {
        fontSize: 12,
        color: defaultTheme.colors.success,
        marginBottom: 2,
    },
    estListing: {
        fontSize: 10,
        color: defaultTheme.colors.textSecondary,
    }
});
