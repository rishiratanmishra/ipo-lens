import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme, theme } from '../theme';
import { getIPOs, IPO, getMarketIndices, MarketIndex } from '../services/api';
import SegmentedControl from '../components/common/SegmentedControl';
import FilterChips from '../components/common/FilterChips';


const { width } = Dimensions.get('window');

const TABS = [
    { id: 'OPEN', label: 'Open' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'CLOSED', label: 'Closed' },
];

export default function HomeScreen({ navigation }) {
    const { user } = React.useContext(AuthContext);
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('OPEN');
    const [isSme, setIsSme] = useState(false);
    const [ipos, setIpos] = useState<IPO[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [marketIndices, setMarketIndices] = useState<{ nifty: MarketIndex, sensex: MarketIndex, banknifty: MarketIndex } | null>(null);

    const loadData = useCallback(async (pageNumber = 1) => {
        if (pageNumber === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            const { ipos: data } = await getIPOs(activeTab, isSme ? 1 : 0, pageNumber);

            if (pageNumber === 1) {
                setIpos(data);
            } else {
                setIpos(prev => [...prev, ...data]);
            }

            setHasMore(data.length >= 20); // Assuming limit is 20
            setPage(pageNumber);

            if (pageNumber === 1) {
                const indices = await getMarketIndices();
                setMarketIndices(indices);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    }, [activeTab, isSme]);

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        loadData(1);
    }, [loadData]);

    useFocusEffect(
        useCallback(() => {
        }, [activeTab, isSme])
    );

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        loadData(1);
    };

    const handleLoadMore = () => {
        if (!loading && !loadingMore && hasMore) {
            console.log("Loading more...", page + 1);
            loadData(page + 1);
        }
    };

    const getStatusColors = (status) => {
        switch (status) {
            case 'OPEN': return { bg: theme.colors.success + '15', text: theme.colors.success, border: theme.colors.success + '40' };
            case 'CLOSED': return { bg: theme.colors.error + '15', text: theme.colors.error, border: theme.colors.error + '40' };
            case 'LISTED': return { bg: theme.colors.accent + '15', text: theme.colors.accent, border: theme.colors.accent + '40' };
            case 'UPCOMING': return { bg: theme.colors.surfaceHighlight, text: theme.colors.textSecondary, border: theme.colors.border };
            default: return { bg: theme.colors.surfaceHighlight, text: theme.colors.textSecondary, border: theme.colors.border };
        }
    };

    const formatCompanyName = (name: string) => {
        if (!name) return '';
        return name
            .replace(/ (Limited|Ltd\.?|Pvt\.?|Private|IPO)$/i, '')
            .replace(/ (Limited|Ltd\.?|Pvt\.?|Private|IPO)$/i, '')
            .trim();
    };

    const renderIPOCard = ({ item }: { item: IPO }) => {
        const { bg, text, border } = getStatusColors(item.status);
        const displayName = formatCompanyName(item.name);

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('IPODetail', { ipo: item })}
                style={{ marginBottom: 20 }}
            >
                <LinearGradient
                    colors={theme.gradients.darkCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.ipoCard, { borderColor: theme.colors.border }]}
                >
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconPlaceholder, { backgroundColor: theme.colors.surface }]}>

                            {/* If icon_url available show image, else initials */}
                            {item.icon_url ? (
                                <Image
                                    source={{ uri: item.icon_url }}
                                    style={styles.icon}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Text style={[styles.iconText, { color: theme.colors.text }]}>
                                    {displayName?.charAt(0) || '?'}
                                </Text>
                            )}
                        </View>

                        <View style={styles.cardInfo}>
                            <Text style={[styles.companyName, { color: theme.colors.text }]} numberOfLines={1}>
                                {displayName}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                <View style={{
                                    backgroundColor: theme.colors.text + '10',
                                    paddingHorizontal: 6,
                                    paddingVertical: 2,
                                    borderRadius: 4
                                }}>
                                    <Text style={{
                                        fontSize: 10,
                                        fontWeight: '700',
                                        color: theme.colors.textSecondary
                                    }}>
                                        Price Band
                                    </Text>
                                </View>
                                <Text style={[styles.companyTag, { color: theme.colors.textSecondary }]}>
                                    {item.min_price ? `₹${item.min_price} - ${item.max_price}` : 'Price TBA'}
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.statusBadge, { backgroundColor: bg, borderColor: border, borderWidth: 1 }]}>
                            <Text style={[styles.statusText, { color: text }]}>{item.status}</Text>
                        </View>
                    </View>
                    {/* <Text style={[styles.companyTag, { color: theme.colors.textSecondary }]}>
                                {item.is_sme ? 'SME IPO' : 'Mainboard'}
                            </Text> */}
                    <View style={[styles.cardBody, { borderTopColor: theme.colors.border, flexDirection: 'column', gap: 12 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={styles.detailColumn}>
                                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>OPEN</Text>
                                <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                                    {item.open_date || 'NA'}
                                </Text>
                            </View>
                            <View style={[styles.detailColumn, { alignItems: 'flex-end' }]}>
                                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>CLOSE</Text>
                                <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                                    {item.close_date || 'NA'}
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={styles.detailColumn}>
                                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Allotment</Text>
                                <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                                    {item.allotment_date ? item.allotment_date : 'NA'}
                                </Text>
                            </View>
                            <View style={[styles.detailColumn, { alignItems: 'flex-end' }]}>
                                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Listing Date</Text>
                                <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                                    {item?.listing_date ? item?.listing_date : 'NA'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {item.premium && (
                        <View style={[styles.gmpContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                            <View style={styles.gmpRow}>
                                <Ionicons
                                    name={parseFloat(item.premium) < 0 ? "trending-down" : (parseFloat(item.premium) === 0 ? "remove" : "trending-up")}
                                    size={16}
                                    color={parseFloat(item.premium) < 0 ? theme.colors.error : (parseFloat(item.premium) === 0 ? theme.colors.textSecondary : theme.colors.success)}
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={[styles.gmpLabel, { color: theme.colors.textSecondary }]}>Premium:</Text>
                                <Text style={[styles.gmpValue, { color: parseFloat(item.premium) < 0 ? theme.colors.error : (parseFloat(item.premium) === 0 ? theme.colors.textSecondary : theme.colors.success) }]}>
                                    {parseFloat(item.premium) < 0 ? `-₹${Math.abs(parseFloat(item.premium))}` : `₹${item.premium}`}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
                        </View>
                    )
                    }
                </LinearGradient >
            </TouchableOpacity >
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
                {/* Custom Header */}
                <View style={[styles.header]}>
                    <View>
                        <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>Welcome back,</Text>
                        <Text style={[styles.userName, { color: theme.colors.white }]}>
                            {user ? user.username.split(' ')[0] : 'Investor'}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity
                            style={[styles.iconButton, { backgroundColor: theme.colors.surfaceHighlight }]}
                            onPress={() => console.log("Notifications")}
                        >
                            <Ionicons name="notifications" size={20} color={theme.colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.iconButton, { backgroundColor: theme.colors.surfaceHighlight, borderWidth: 1, borderColor: theme.colors.primary + '50' }]}
                            onPress={() => navigation.navigate('Menu')}
                        >
                            <Ionicons name="grid-outline" size={20} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Market Ticker */}
                <View style={{ height: 85, marginBottom: 10 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tickerScroll}>
                        {/* NIFTY 50 */}
                        <LinearGradient
                            colors={theme.gradients.darkCard}
                            style={[styles.tickerCard, { borderColor: theme.colors.border }]}
                        >
                            <View>
                                <Text style={[styles.tickerLabel, { color: theme.colors.textSecondary }]}>NIFTY 50</Text>
                                <Text style={[styles.tickerValue, { color: theme.colors.text }]}>
                                    {marketIndices?.nifty.value || 'Loading...'}
                                </Text>
                            </View>
                            <View style={[styles.trendBadge, { marginBottom: 25, backgroundColor: (marketIndices?.nifty.isUp ? theme.colors.success : theme.colors.error) + '20' }]}>
                                <Ionicons
                                    name={marketIndices?.nifty.isUp ? "arrow-up" : "arrow-down"}
                                    size={12}
                                    color={marketIndices?.nifty.isUp ? theme.colors.success : theme.colors.error}
                                />
                                <Text style={{ fontSize: 10, color: marketIndices?.nifty.isUp ? theme.colors.success : theme.colors.error, fontWeight: 'bold' }}>
                                    {marketIndices?.nifty.change} ({marketIndices?.nifty.percentChange || '0.0%'})
                                </Text>
                            </View>
                        </LinearGradient>

                        {/* SENSEX */}
                        <LinearGradient
                            colors={theme.gradients.darkCard}
                            style={[styles.tickerCard, { borderColor: theme.colors.border }]}
                        >
                            <View>
                                <Text style={[styles.tickerLabel, { color: theme.colors.textSecondary }]}>SENSEX</Text>
                                <Text style={[styles.tickerValue, { color: theme.colors.text }]}>
                                    {marketIndices?.sensex.value || 'Loading...'}
                                </Text>
                            </View>
                            <View style={[styles.trendBadge, { marginBottom: 25, backgroundColor: (marketIndices?.sensex.isUp ? theme.colors.success : theme.colors.error) + '20' }]}>
                                <Ionicons
                                    name={marketIndices?.sensex.isUp ? "arrow-up" : "arrow-down"}
                                    size={12}
                                    color={marketIndices?.sensex.isUp ? theme.colors.success : theme.colors.error}
                                />
                                <Text style={{ fontSize: 10, color: marketIndices?.sensex.isUp ? theme.colors.success : theme.colors.error, fontWeight: 'bold' }}>
                                    {marketIndices?.sensex.change} ({marketIndices?.sensex.percentChange || '0.0%'})
                                </Text>
                            </View>
                        </LinearGradient>

                        {/* BANKNIFTY */}
                        <LinearGradient
                            colors={theme.gradients.darkCard}
                            style={[styles.tickerCard, { borderColor: theme.colors.border }]}
                        >
                            <View>
                                <Text style={[styles.tickerLabel, { color: theme.colors.textSecondary }]}>BANKNIFTY</Text>
                                <Text style={[styles.tickerValue, { color: theme.colors.text }]}>
                                    {marketIndices?.banknifty.value || 'Loading...'}
                                </Text>
                            </View>
                            <View style={[styles.trendBadge, { marginBottom: 25, backgroundColor: (marketIndices?.banknifty.isUp ? theme.colors.success : theme.colors.error) + '20' }]}>
                                <Ionicons
                                    name={marketIndices?.banknifty.isUp ? "arrow-up" : "arrow-down"}
                                    size={12}
                                    color={marketIndices?.banknifty.isUp ? theme.colors.success : theme.colors.error}
                                />
                                <Text style={{ fontSize: 10, color: marketIndices?.banknifty.isUp ? theme.colors.success : theme.colors.error, fontWeight: 'bold' }}>
                                    {marketIndices?.banknifty.change} ({marketIndices?.banknifty.percentChange || '0.0%'})
                                </Text>
                            </View>
                        </LinearGradient>

                    </ScrollView>
                </View>

                {/* Type Selector (Mainboard/SME) */}
                <SegmentedControl
                    tabs={['Mainboard', 'SME IPO']}
                    activeTab={isSme ? 'SME IPO' : 'Mainboard'}
                    onTabChange={(tab) => setIsSme(tab === 'SME IPO')}
                    containerStyle={{ marginHorizontal: 24, marginTop: 10, marginBottom: 20 }}
                />

                {/* Categories */}
                <FilterChips
                    options={TABS.map(tab => tab.label)}
                    selectedValue={TABS.find(tab => tab.id === activeTab)?.label || 'Open'}
                    onSelect={(label) => {
                        const selectedTab = TABS.find(tab => tab.label === label);
                        if (selectedTab) setActiveTab(selectedTab.id);
                    }}
                    containerStyle={{ marginBottom: 15, marginHorizontal: 24 }}
                />

                {/* IPO List */}
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={ipos}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderIPOCard}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                        }
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={loadingMore ? <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 20 }} /> : null}
                        ListEmptyComponent={
                            <View style={styles.center}>
                                <Text style={{ color: theme.colors.textSecondary, marginTop: 40, fontSize: 16 }}>No {activeTab.toLowerCase()} IPOs found</Text>
                                <Text style={{ color: theme.colors.textTertiary, fontSize: 12, marginTop: 8 }}>Check back later for updates</Text>
                            </View>
                        }
                    />
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 20,
    },
    welcomeText: { fontSize: 14, fontWeight: '500' },
    userName: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
    iconButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },

    tickerScroll: { paddingHorizontal: 24, alignItems: 'center' },
    tickerCard: {
        padding: 12,
        borderRadius: 16,
        marginRight: 12,
        width: 'auto',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,

    },
    tickerLabel: { fontSize: 10, fontWeight: '700', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
    tickerValue: { fontSize: 16, fontWeight: '700' },
    trendBadge: { flexDirection: 'row', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, alignItems: 'center', gap: 2 },

    listContent: { paddingHorizontal: 24, paddingBottom: 100 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    ipoCard: {
        borderRadius: 24,
        borderWidth: 1,
        overflow: 'hidden',
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        // Elevation for Android
        elevation: 10,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    iconPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12, // slightly increased spacing
    },
    iconText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardInfo: { flex: 1, justifyContent: 'center' },
    companyName: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
    companyTag: { fontSize: 13 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100, marginLeft: 10, marginBottom: 20 },
    statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

    cardBody: { borderTopWidth: 1, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16 },
    detailColumn: { flex: 1 },
    detailLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
    detailValue: { fontSize: 15, fontWeight: '600' },
    icon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        color: theme.colors.text,
        backgroundColor: theme.colors.white,
    },
    gmpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        marginHorizontal: 8,
        marginBottom: 8,
    },
    gmpRow: { flexDirection: 'row', alignItems: 'center' },
    gmpLabel: { fontSize: 13, fontWeight: '500', marginRight: 4 },
    gmpValue: { fontSize: 15, fontWeight: '800' },
});
