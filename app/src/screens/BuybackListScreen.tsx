import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBuybacks, useBuybacksInfinite } from '../services/queries';
import { Buyback } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';
import SegmentedControl from '../components/common/SegmentedControl';
import EmptyState from '../components/common/EmptyState';

export default function BuybackListScreen() {
    const { theme } = useTheme();
    // Tabs configuration
    const tabs = ['Open', 'Upcoming', 'Closed'];
    const [activeTab, setActiveTab] = useState('Open');

    // TanStack Query Infinite Scroll
    const {
        data,
        isLoading,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        refetch
    } = useBuybacksInfinite(10, activeTab);

    // Flatten pages into a single array
    const buybacks = data?.pages.flatMap(page => page.buybacks) || [];

    const onRefresh = () => {
        refetch();
    };

    const loadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const formatCompanyName = (name: string) => {
        if (!name) return '';
        return name
            .replace(/ (Limited|Ltd\.?|Pvt\.?|Private|IPO)$/i, '')
            .replace(/ (Limited|Ltd\.?|Pvt\.?|Private|Buyback)$/i, '')
            .trim();
    };

    const getStatusColor = (status: string) => {
        if (!status) return theme.colors.text;
        const s = status.toLowerCase();
        if (s.includes('closes') || s.includes('open')) return theme.colors.success;
        if (s.includes('upcoming') || s.includes('starts')) return theme.colors.accent;
        if (s.includes('closed')) return theme.colors.error;
        return theme.colors.textSecondary;
    };

    const renderItem = ({ item }: { item: Buyback }) => {
        const displayName = formatCompanyName(item.company || item.company_name);
        const firstChar = displayName ? displayName.substring(0, 1) : '?';
        const price = item.offer_price || item.buyback_price;
        const hasLogo = item.logo && item.logo.trim() !== '';

        return (
            <TouchableOpacity
                style={[styles.card, { backgroundColor: theme.colors.surfaceHighlight }]}
                activeOpacity={0.9}
            >
                {/* Header */}
                <View style={styles.cardHeader}>
                    <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.surface }]}>
                        {hasLogo ? (
                            <Image
                                source={{ uri: item.logo }}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <Text style={[styles.logoText, { color: theme.colors.text }]}>
                                {firstChar}
                            </Text>
                        )}
                    </View>
                    <View style={styles.headerText}>
                        <Text style={[styles.companyName, { color: theme.colors.text }]} numberOfLines={2}>
                            {displayName}
                        </Text>
                        <View style={[styles.statusBadge, { borderColor: getStatusColor(item.status) }]}>
                            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                                {item.status || 'Unknown'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                {/* Details Grid */}
                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Buyback Price</Text>
                        <Text style={[styles.value, { color: theme.colors.text, fontWeight: 'bold' }]}>
                            {price ? `₹${price}` : '-'}
                        </Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Current Price</Text>
                        <Text style={[styles.value, { color: theme.colors.text }]}>
                            {item.current_market_price ? `₹${item.current_market_price}` : '-'}
                        </Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Issue Size</Text>
                        <Text style={[styles.value, { color: theme.colors.text }]}>
                            {item.issue_size || '-'}
                        </Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Shares</Text>
                        <Text style={[styles.value, { color: theme.colors.text }]}>
                            {item.shares || '-'}
                        </Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Record Date</Text>
                        <Text style={[styles.value, { color: theme.colors.text }]}>
                            {item.record_date || '-'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Buybacks</Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                    Track Open & Upcoming Buybacks
                </Text>
            </View>

            {/* Segmented Control Tabs */}
            <SegmentedControl
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {(isLoading && !buybacks.length) ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={buybacks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 10 }} />
                        ) : null
                    }
                    ListEmptyComponent={
                        !isLoading ? (
                            <EmptyState
                                message={`No ${activeTab} Buybacks found`}
                                subMessage="Check back later"
                            />
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: defaultTheme.spacing.md,
        paddingVertical: defaultTheme.spacing.sm,
        marginBottom: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 2,
        color: defaultTheme.colors.textSecondary,
    },
    listContent: {
        paddingHorizontal: defaultTheme.spacing.md,
        paddingBottom: 20,
        paddingTop: 10,
    },
    card: {
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        // Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    logoPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden'
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerText: {
        flex: 1,
    },
    companyName: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 6,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    divider: {
        height: 1,
        width: '100%',
        marginBottom: 12,
        opacity: 0.1,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridItem: {
        width: '50%',
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        marginBottom: 2,
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
    },
    empty: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16
    }
});
