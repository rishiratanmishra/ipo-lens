import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getIPOs } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';

export default function IPOListScreen({ navigation }) {
    const [ipos, setIpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        loadData(1);
    }, []);

    const loadData = async (pageNum) => {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        // Fetch flattened list (all statuses)
        const { ipos: data } = await getIPOs(undefined, undefined, pageNum, 20);

        if (pageNum === 1) {
            setIpos(data);
        } else {
            setIpos(prev => [...prev, ...data]);
        }

        if (data.length < 5) { // Threshold to determine if more data exists (since we fetch multiple groups, 20 limit applies to each group potentially, but flattened result can be large. If flattened result is small, we are likely done).
            // Actually, get_ipos.php slices EACH group by 20. So max result could be 20 * 3 = 60 items if all 3 groups are full.
            // If we get 0 items, definitely done.
            // Let's rely on data.length === 0 to stop.
            if (data.length === 0) setHasMore(false);
        }

        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadData(nextPage);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        loadData(1);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return { backgroundColor: theme.colors.success };
            case 'CLOSED': return { backgroundColor: theme.colors.error };
            case 'UPCOMING': return { backgroundColor: theme.colors.secondary };
            case 'LISTED': return { backgroundColor: theme.colors.accent };
            default: return { backgroundColor: theme.colors.textSecondary };
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surfaceHighlight, shadowColor: theme.colors.text }]} onPress={() => navigation.navigate('IPODetail', { ipo: item })}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconPlaceholder, { backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.iconText, { color: theme.colors.primary }]}>{item.name ? item.name.charAt(0) : '?'}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.companyName, { color: theme.colors.primary }]} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.row}>
                        <View style={[styles.badge, getStatusStyle(item.status)]}>
                            <Text style={styles.badgeText}>{item.status}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <View style={[styles.cardBody, { marginBottom: 12 }]}>
                <View style={styles.infoCol}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Open</Text>
                    <Text style={[styles.value, { color: theme.colors.text }]}>{item.open_date || 'NA'}</Text>
                </View>
                <View style={styles.infoCol}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Close</Text>
                    <Text style={[styles.value, { color: theme.colors.text }]}>{item.close_date || 'NA'}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoCol}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Price Band</Text>
                    <Text style={[styles.value, { color: theme.colors.text }]}>₹{item.min_price} - {item.max_price}</Text>
                </View>
                <View style={styles.infoCol}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Lot Size</Text>
                    <Text style={[styles.value, { color: theme.colors.text }]}>{item.lot_size} Shares</Text>
                </View>
            </View>

            {item.premium ? (
                <View style={[styles.gmpContainer, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.gmpLabel, { color: theme.colors.secondary }]}>GMP Trend</Text>
                    <Text style={[styles.gmpValue, { color: theme.colors.text }]}>₹{parseInt(item.premium) || item.premium} {item.trend && <Text style={{ fontSize: 12, color: item.trend === 'UP' ? theme.colors.success : theme.colors.textSecondary }}>({item.trend})</Text>}</Text>
                </View>
            ) : null}
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator size="large" color={theme.colors.primary} style={{ flex: 1, backgroundColor: theme.colors.background }} />;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
            <FlatList
                data={ipos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
                ListEmptyComponent={<Text style={[styles.empty, { color: theme.colors.textSecondary }]}>No active IPOs available.</Text>}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 20 }} /> : null}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: defaultTheme.colors.background },
    listContent: { padding: defaultTheme.spacing.md },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: defaultTheme.spacing.md,
        marginBottom: defaultTheme.spacing.md,
        ...defaultTheme.shadows.card
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    iconPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: defaultTheme.colors.background, justifyContent: 'center', alignItems: 'center' },
    iconText: { fontSize: 18, fontWeight: 'bold', color: defaultTheme.colors.primary },
    companyName: { fontSize: 16, fontWeight: 'bold', color: defaultTheme.colors.primary },
    row: { flexDirection: 'row', marginTop: 4 },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

    divider: { height: 1, backgroundColor: defaultTheme.colors.border, marginVertical: defaultTheme.spacing.sm },

    cardBody: { flexDirection: 'row', justifyContent: 'space-between' },
    infoCol: { flex: 1 },
    label: { fontSize: 12, color: defaultTheme.colors.textSecondary },
    value: { fontSize: 14, fontWeight: '600', color: defaultTheme.colors.text },

    gmpContainer: { marginTop: defaultTheme.spacing.sm, backgroundColor: '#FFF9C4', padding: 8, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    gmpLabel: { fontSize: 12, fontWeight: 'bold', color: '#F57F17' },
    gmpValue: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },

    empty: { textAlign: 'center', marginTop: 40, color: defaultTheme.colors.textSecondary }
});
