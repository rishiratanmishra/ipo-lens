import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';
import { getIPOs, getGMPTrends, IPO } from '../services/api';
import SegmentedControl from '../components/common/SegmentedControl';

const { width } = Dimensions.get('window');

export default function GMPListScreen({ navigation }) {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('Mainboard');
    const [ipos, setIpos] = useState<IPO[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedMinPremium, setSelectedMinPremium] = useState<number>(1);
    const [selectedMaxPremium, setSelectedMaxPremium] = useState<number | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [sortBy, setSortBy] = useState<'gmp_high' | 'gmp_low'>('gmp_high'); // Top Gainers by default

    const fetchIPOs = useCallback(async (pageNumber: number, shouldAppend: boolean = false) => {
        if (shouldAppend) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const limit = 20;
            const { ipos: data } = await getGMPTrends(
                pageNumber,
                limit,
                activeTab === 'SME' ? 1 : 0,
                selectedStatus,
                selectedMinPremium,
                selectedMaxPremium,
                sortBy
            );

            if (shouldAppend) {
                setIpos(prev => [...prev, ...data]);
            } else {
                setIpos(data);
            }

            setHasMore(data.length === limit);
            setPage(pageNumber);
        } catch (error) {
            console.error("Failed to load GMP data", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    }, [activeTab, selectedStatus, selectedMinPremium, selectedMaxPremium, sortBy]);

    useEffect(() => {
        fetchIPOs(1, false);
    }, [fetchIPOs]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchIPOs(1, false);
    };

    const handleLoadMore = () => {
        if (!loadingMore && !loading && hasMore) {
            fetchIPOs(page + 1, true);
        }
    };

    const renderItem = useCallback(({ item }: { item: IPO }) => (
        <GMPCard item={item} theme={theme} navigation={navigation} />
    ), [theme, navigation]);

    const hasActiveFilters = selectedStatus !== '' || selectedMinPremium > 1 || selectedMaxPremium !== undefined;

    const clearFilters = () => {
        setSelectedStatus('');
        setSelectedMinPremium(1);
        setSelectedMaxPremium(undefined);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>GMP Trends</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                        Grey Market Premium Tracker
                    </Text>
                </View>
                <View style={styles.headerRight}>
                    <View style={[styles.updateBadge, { backgroundColor: theme.colors.success + '20', borderColor: theme.colors.success + '40', borderWidth: 1 }]}>
                        <View style={[styles.liveDot, { backgroundColor: theme.colors.success }]} />
                        <Text style={[styles.updateText, { color: theme.colors.success }]}>Live</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.filterButton, {
                            backgroundColor: hasActiveFilters ? theme.colors.primary + '20' : theme.colors.surfaceHighlight,
                            borderColor: hasActiveFilters ? theme.colors.primary : theme.colors.border,
                            borderWidth: 1
                        }]}
                        onPress={() => setFilterModalVisible(true)}
                    >
                        <Ionicons
                            name="filter"
                            size={18}
                            color={hasActiveFilters ? theme.colors.primary : theme.colors.text}
                        />
                        {hasActiveFilters && (
                            <View style={[styles.filterDot, { backgroundColor: theme.colors.primary }]} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Segmented Control */}
            <SegmentedControl
                tabs={['Mainboard', 'SME']}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* List Header */}
            <View style={styles.listHeaderRow}>
                <View>
                    <Text style={[styles.listHeaderTitle, { color: theme.colors.text }]}>
                        {selectedStatus ? `${selectedStatus} IPOs` : sortBy === 'gmp_high' ? 'Top Gainers' : 'Top Losers'}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.sortButton, { backgroundColor: theme.colors.surfaceHighlight, borderColor: theme.colors.border, borderWidth: 1 }]}
                    onPress={() => setSortBy(sortBy === 'gmp_high' ? 'gmp_low' : 'gmp_high')}
                >
                    <Ionicons
                        name={sortBy === 'gmp_high' ? "trending-up" : "trending-down"}
                        size={16}
                        color={sortBy === 'gmp_high' ? theme.colors.success : theme.colors.error}
                    />
                    <Text style={[styles.sortButtonText, { color: theme.colors.text }]}>
                        {sortBy === 'gmp_high' ? 'Gainers' : 'Losers'}
                    </Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
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
                        <View style={styles.emptyContainer}>
                            <Ionicons name="trending-up-outline" size={64} color={theme.colors.textTertiary} />
                            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No GMP Data Available</Text>
                            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                                Try adjusting your filters or check back later
                            </Text>
                        </View>
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore ? (
                            <View style={{ padding: 20 }}>
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            </View>
                        ) : <View style={{ height: 20 }} />
                    }
                />
            )}

            {/* Filter Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setFilterModalVisible(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Filters</Text>
                            <View style={styles.modalHeaderActions}>
                                {hasActiveFilters && (
                                    <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
                                        <Text style={[styles.clearButtonText, { color: theme.colors.error }]}>Clear All</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                                    <Ionicons name="close" size={24} color={theme.colors.text} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Filter Content */}
                        <View style={styles.filterContent}>
                            {/* Status Filter */}
                            <View style={styles.filterGroup}>
                                <Text style={[styles.filterGroupTitle, { color: theme.colors.text }]}>Status</Text>
                                <View style={styles.filterChipsWrapper}>
                                    {['All', 'OPEN', 'UPCOMING', 'CLOSED', 'LISTED'].map((status) => (
                                        <TouchableOpacity
                                            key={status}
                                            style={[
                                                styles.filterChip,
                                                {
                                                    backgroundColor: (selectedStatus === '' && status === 'All') || selectedStatus === status
                                                        ? '#34D39920'
                                                        : theme.colors.surfaceHighlight,
                                                    borderColor: (selectedStatus === '' && status === 'All') || selectedStatus === status
                                                        ? '#34D399'
                                                        : theme.colors.border,
                                                }
                                            ]}
                                            onPress={() => setSelectedStatus(status === 'All' ? '' : status)}
                                        >
                                            <Text style={[
                                                styles.filterChipText,
                                                {
                                                    color: (selectedStatus === '' && status === 'All') || selectedStatus === status
                                                        ? '#059669'
                                                        : theme.colors.textSecondary
                                                }
                                            ]}>
                                                {status}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Premium Range Filter */}
                            <View style={styles.filterGroup}>
                                <Text style={[styles.filterGroupTitle, { color: theme.colors.text }]}>Premium Range</Text>
                                <View style={styles.filterChipsWrapper}>
                                    {[
                                        { label: 'All', min: 1, max: undefined },
                                        { label: '₹50-100', min: 50, max: 100 },
                                        { label: '₹100-200', min: 100, max: 200 },
                                        { label: '₹200+', min: 200, max: undefined },
                                    ].map((option) => (
                                        <TouchableOpacity
                                            key={option.label}
                                            style={[
                                                styles.filterChip,
                                                {
                                                    backgroundColor: selectedMinPremium === option.min && selectedMaxPremium === option.max
                                                        ? '#34D39920'
                                                        : theme.colors.surfaceHighlight,
                                                    borderColor: selectedMinPremium === option.min && selectedMaxPremium === option.max
                                                        ? '#34D399'
                                                        : theme.colors.border,
                                                }
                                            ]}
                                            onPress={() => {
                                                setSelectedMinPremium(option.min);
                                                setSelectedMaxPremium(option.max);
                                            }}
                                        >
                                            <Text style={[
                                                styles.filterChipText,
                                                {
                                                    color: selectedMinPremium === option.min && selectedMaxPremium === option.max
                                                        ? '#059669'
                                                        : theme.colors.textSecondary
                                                }
                                            ]}>
                                                {option.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* Apply Button */}
                        <TouchableOpacity
                            style={[styles.applyButton, { backgroundColor: '#34D399' }]}
                            onPress={() => setFilterModalVisible(false)}
                        >
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

// Memoized Card Component for better performance
const GMPCard = React.memo(({ item, theme, navigation }: { item: IPO, theme: any, navigation: any }) => {
    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'OPEN': return theme.colors.success;
            case 'UPCOMING': return theme.colors.accent;
            case 'CLOSED': return theme.colors.error;
            case 'LISTED': return theme.colors.textSecondary;
            default: return theme.colors.text;
        }
    };

    const getStatusBgColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'OPEN': return theme.colors.success + '15';
            case 'UPCOMING': return theme.colors.accent + '15';
            case 'CLOSED': return theme.colors.error + '15';
            case 'LISTED': return theme.colors.textSecondary + '15';
            default: return theme.colors.surfaceHighlight;
        }
    };

    const calculateGmpStats = (item: IPO) => {
        const gmp = parseFloat(item.premium || '0');
        const price = item.max_price || item.min_price || 0;

        let percentage = '0';
        let estListing: number = 0;

        if (price > 0) {
            const pct = ((gmp / price) * 100).toFixed(1);
            percentage = pct;
            estListing = price + gmp;
        }

        // Fallback: search for parens in premium string
        if (item.premium && item.premium.includes('(')) {
            const match = item.premium.match(/\((.*?)%\)/);
            if (match) {
                percentage = match[1];
            }
        }

        const pctNum = parseFloat(percentage);
        return {
            percentage,
            estListing,
            fire: pctNum > 50,
            isPositive: gmp > 0,
            isNegative: gmp < 0
        };
    };

    const formatCompanyName = (name: string) => {
        if (!name) return '';
        return name
            .replace(/ (Limited|Ltd\.?|Pvt\.?|Private|IPO)$/i, '')
            .replace(/ (Limited|Ltd\.?|Pvt\.?|Private|IPO)$/i, '')
            .trim();
    };

    const { percentage, estListing, isPositive, isNegative } = calculateGmpStats(item);
    const displayName = formatCompanyName(item.name);
    const gmpValue = parseInt(item.premium || '0');
    const statusColor = getStatusColor(item.status);
    const statusBgColor = getStatusBgColor(item.status);

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('IPODetail', { ipo: item })}
            style={{ marginBottom: 16 }}
        >
            <LinearGradient
                colors={theme.gradients.darkCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.card, { borderColor: theme.colors.border }]}
            >
                {/* Top Section - Company Info */}
                <View style={styles.cardHeader}>
                    <View style={styles.companySection}>
                        <View style={[styles.logoContainer, { backgroundColor: theme.colors.surface }]}>
                            {item.icon_url ? (
                                <Image
                                    source={{ uri: item.icon_url }}
                                    style={styles.logoImage}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Text style={[styles.logoText, { color: theme.colors.text }]}>
                                    {displayName.substring(0, 1) || '?'}
                                </Text>
                            )}
                        </View>
                        <View style={styles.companyInfo}>
                            <Text style={[styles.companyName, { color: theme.colors.text }]} numberOfLines={1}>
                                {displayName}
                            </Text>
                            <View style={styles.priceRow}>
                                <View style={[styles.priceBadge, { backgroundColor: theme.colors.text + '10' }]}>
                                    <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                                        Price Band
                                    </Text>
                                </View>
                                <Text style={[styles.priceValue, { color: theme.colors.textSecondary }]}>
                                    {item.min_price ? `₹${item.min_price} - ${item.max_price}` : 'TBA'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Status Badge */}
                    <View style={[styles.statusBadge, { backgroundColor: statusBgColor, borderColor: statusColor + '40', borderWidth: 1 }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                </View>

                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                {/* Bottom Section - GMP Stats */}
                <View style={styles.statsSection}>
                    {/* GMP Premium */}
                    <View style={styles.statBox}>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>GMP</Text>
                        <View style={styles.gmpRow}>

                            <Text style={[
                                styles.gmpValue,
                                { color: isNegative ? theme.colors.error : isPositive ? theme.colors.success : theme.colors.textSecondary }
                            ]}>
                                {isNegative ? '-₹' : '₹'}{Math.abs(gmpValue)}
                            </Text>
                        </View>
                    </View>

                    {/* Gain Percentage */}
                    <View style={styles.statBox}>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Gain</Text>
                        <View style={[
                            styles.percentageBadge,
                            { backgroundColor: isNegative ? theme.colors.error + '15' : isPositive ? theme.colors.success + '15' : theme.colors.surfaceHighlight }
                        ]}>
                            <Ionicons
                                name={isNegative ? "trending-down" : isPositive ? "trending-up" : "remove"}
                                size={14}
                                color={isNegative ? theme.colors.error : isPositive ? theme.colors.success : theme.colors.textSecondary}
                            />
                            <Text style={[
                                styles.percentageText,
                                { color: isNegative ? theme.colors.error : isPositive ? theme.colors.success : theme.colors.textSecondary }
                            ]}>
                                {percentage}%
                            </Text>
                        </View>
                    </View>

                    {/* Est. Listing */}
                    <View style={styles.statBox}>
                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Est. Listing</Text>
                        <Text style={[styles.estListingValue, { color: theme.colors.text }]}>
                            {typeof estListing === 'number' && !isNaN(estListing) && estListing >= 0 ? `₹${Math.round(estListing)}` : 'TBA'}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: defaultTheme.colors.background
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.5,
        color: defaultTheme.colors.text,
    },
    headerSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
        color: defaultTheme.colors.textSecondary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    updateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    updateText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    filterSection: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    listHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
        marginTop: 8,
    },
    listHeaderTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: defaultTheme.colors.text,
    },
    listHeaderSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 2,
        color: defaultTheme.colors.textSecondary,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    sortButtonText: {
        fontSize: 13,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    card: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
        position: 'relative',
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        // Elevation for Android
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 16,
    },
    companySection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    logoContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        backgroundColor: defaultTheme.colors.white,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    companyInfo: {
        flex: 1,
    },
    companyName: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    priceBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priceLabel: {
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    priceValue: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 100,
    },
    statusText: {
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    divider: {
        height: 1,
        marginHorizontal: 16,
        opacity: 0.3,
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    gmpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    gmpValue: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    percentageBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    percentageText: {
        fontSize: 14,
        fontWeight: '700',
    },
    estListingValue: {
        fontSize: 15,
        fontWeight: '700',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 80,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    filterDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
    },
    modalHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    clearButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    filterContent: {
        marginBottom: 20,
    },
    filterGroup: {
        marginBottom: 24,
    },
    filterGroupTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    filterChipsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 100,
        borderWidth: 1,
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '600',
    },
    applyButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
