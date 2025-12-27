import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getBuybacks, Buyback } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';
import SegmentedControl from '../components/common/SegmentedControl';

export default function BuybackListScreen() {
    const { theme } = useTheme();
    const [buybacks, setBuybacks] = useState<Buyback[]>([]);
    const [filteredData, setFilteredData] = useState<Buyback[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Tabs configuration
    const tabs = ['Open', 'Upcoming', 'Closed'];
    const [activeTab, setActiveTab] = useState('Open');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (buybacks.length > 0) {
            filterData();
        }
    }, [activeTab, buybacks]);

    const filterData = () => {
        const filtered = buybacks.filter(item => {
            // Normalize comparison
            const itemType = (item.type || '').toLowerCase();
            const tabLower = activeTab.toLowerCase();
            return itemType === tabLower;
        });
        setFilteredData(filtered);
    };

    const loadData = async () => {
        setLoading(true);
        const data = await getBuybacks();
        setBuybacks(data);
        setLoading(false);
        setRefreshing(false);
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
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
                activeOpacity={0.7}
            >
                <View style={[styles.cardLeft, { maxWidth: '75%' }]}>
                    <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.surface, overflow: 'hidden' }]}>
                        {hasLogo ? (
                            <Image
                                source={{ uri: item.logo }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="contain"
                            />
                        ) : (
                            <Text style={[styles.logoText, { color: theme.colors.text }]}>
                                {firstChar}
                            </Text>
                        )}
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.companyName, { color: theme.colors.text }]} numberOfLines={1}>
                            {displayName}
                        </Text>
                        <Text style={[styles.priceRange, { color: theme.colors.textSecondary }]}>
                            Price: {price}
                        </Text>
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            ● {item.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardRight}>
                    {/* Can put chevron or detailed status */}
                </View>
            </TouchableOpacity>
        );
    };

    if (loading && !refreshing) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
    );

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

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={[styles.empty, { color: theme.colors.textSecondary }]}>No {activeTab} Buybacks found.</Text>
                    </View>
                }
            />
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
        color: defaultTheme.colors.textSecondary,
    },
    listContent: {
        paddingHorizontal: defaultTheme.spacing.md,
        paddingBottom: 20
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    priceRange: {
        fontSize: 12,
        marginBottom: 2,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardRight: {
        alignItems: 'flex-end',
    },
    empty: {
        textAlign: 'center',
        marginTop: 20
    }
});
