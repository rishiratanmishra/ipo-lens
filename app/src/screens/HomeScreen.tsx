import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';
import { getIPOs, IPO } from '../services/api';

const TABS = [
    { id: 'OPEN', label: 'Open' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'LISTED', label: 'Listed' },
    { id: 'CLOSED', label: 'Closed' },
];

export default function HomeScreen({ navigation }) {
    const { user } = React.useContext(AuthContext);
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('OPEN');
    const [ipos, setIpos] = useState<IPO[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch only Mainboard IPOs (is_sme = 0) for Home Screen
            const data = await getIPOs(activeTab, 0);
            setIpos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab]);

    useFocusEffect(
        useCallback(() => {
            // Optional: Auto-refresh when screen comes into focus if needed
            // loadData(); 
        }, [activeTab])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return { backgroundColor: theme.colors.success + '20', color: theme.colors.success };
            case 'CLOSED': return { backgroundColor: theme.colors.error + '20', color: theme.colors.error };
            case 'LISTED': return { backgroundColor: theme.colors.accent + '20', color: theme.colors.accent };
            case 'UPCOMING': return { backgroundColor: theme.colors.secondary + '20', color: theme.colors.text };
            default: return { backgroundColor: theme.colors.surfaceLight, color: theme.colors.textSecondary };
        }
    };

    const renderIPOCard = ({ item }) => {
        const statusStyle = getStatusStyle(item.status);
        return (
            <TouchableOpacity
                style={[styles.ipoCard, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}
                onPress={() => navigation.navigate('IPODetail', { ipo: item })}
            >
                <View style={styles.cardHeader}>
                    <View style={[styles.iconPlaceholder, { backgroundColor: theme.colors.surfaceLight }]}>
                        <Text style={[styles.iconText, { color: theme.colors.primary }]}>
                            {item.company_name?.charAt(0) || '?'}
                        </Text>
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={[styles.companyName, { color: theme.colors.text }]} numberOfLines={1}>
                            {item.company_name}
                        </Text>
                        <Text style={[styles.companyTag, { color: theme.colors.textSecondary }]}>
                            {item.is_sme ? 'SME IPO' : 'Mainboard'}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status}</Text>
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                <View style={styles.cardDetails}>
                    <View>
                        <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Price Band</Text>
                        <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                            {item.price_band_lower ? `₹${item.price_band_lower} - ${item.price_band_upper}` : 'TBA'}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Dates</Text>
                        <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                            {item.open_date ? `${new Date(item.open_date).getDate()} - ${new Date(item.close_date).getDate()} ${new Date(item.close_date).toLocaleString('default', { month: 'short' })}` : 'TBA'}
                        </Text>
                    </View>
                </View>

                {item.gmp_price && (
                    <View style={[styles.gmpRow, { backgroundColor: theme.colors.surfaceLight }]}>
                        <Text style={[styles.gmpLabel, { color: theme.colors.secondary }]}>Expected GMP: </Text>
                        <Text style={[styles.gmpValue, { color: theme.colors.success }]}>₹{item.gmp_price}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
            {/* Header */}
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
                        <Ionicons name="notifications-outline" size={22} color={theme.colors.success} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tickers - Keep explicit height to avoid jumping */}
            <View style={{ height: 100 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tickerScroll}>
                    <View style={[styles.tickerCard, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.tickerLabel, { color: theme.colors.textSecondary }]}>NIFTY 50</Text>
                        <View style={styles.tickerRow}>
                            <Text style={[styles.tickerValue, { color: theme.colors.text }]}>20,930.50</Text>
                            <Ionicons name="trending-up" size={14} color={theme.colors.success} />
                        </View>
                    </View>
                    <View style={[styles.tickerCard, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.tickerLabel, { color: theme.colors.textSecondary }]}>SENSEX</Text>
                        <View style={styles.tickerRow}>
                            <Text style={[styles.tickerValue, { color: theme.colors.text }]}>69,500.10</Text>
                            <Ionicons name="trending-up" size={14} color={theme.colors.success} />
                        </View>
                    </View>
                </ScrollView>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {TABS.map(tab => (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id)}
                            style={[
                                styles.tab,
                                activeTab === tab.id ? { backgroundColor: theme.colors.primary } : { backgroundColor: theme.colors.surfaceLight }
                            ]}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === tab.id ? { color: '#fff' } : { color: theme.colors.text }
                            ]}>{tab.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* List */}
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
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={{ color: theme.colors.textSecondary, marginTop: 40 }}>No {activeTab.toLowerCase()} IPOs found.</Text>
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
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    welcomeText: { fontSize: 12, color: defaultTheme.colors.textSecondary, textTransform: 'uppercase' },
    userName: { fontSize: 16, fontWeight: 'bold' },
    headerRight: { flexDirection: 'row', gap: 12 },
    iconButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },

    tickerScroll: { paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' },
    tickerCard: { padding: 12, borderRadius: 12, marginRight: 12, width: 140, justifyContent: 'center' },
    tickerLabel: { fontSize: 10, fontWeight: '600', marginBottom: 4 },
    tickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    tickerValue: { fontSize: 16, fontWeight: 'bold' },

    tabsContainer: { paddingVertical: 12 },
    tab: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
    tabText: { fontWeight: 'bold', fontSize: 14 },

    listContent: { paddingHorizontal: 20, paddingBottom: 100 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    ipoCard: { borderRadius: 16, padding: 16, marginBottom: 16, ...defaultTheme.shadows.card },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    iconPlaceholder: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    iconText: { fontSize: 20, fontWeight: 'bold' },
    cardInfo: { flex: 1 },
    companyName: { fontSize: 16, fontWeight: 'bold' },
    companyTag: { fontSize: 12 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    divider: { height: 1, marginVertical: 8 },
    cardDetails: { flexDirection: 'row', justifyContent: 'space-between' },
    detailLabel: { fontSize: 12, marginBottom: 4 },
    detailValue: { fontSize: 14, fontWeight: 'bold' },
    gmpRow: { flexDirection: 'row', marginTop: 12, padding: 8, borderRadius: 8, alignItems: 'center' },
    gmpLabel: { fontSize: 12, fontWeight: '600' },
    gmpValue: { fontSize: 14, fontWeight: 'bold', marginLeft: 4 }
});
