import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, Linking, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBrokers } from '../services/queries';
import { Broker } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SvgUri } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import SegmentedControl from '../components/common/SegmentedControl';

export default function BrokerListScreen() {
    const { theme } = useTheme();

    // TanStack Query
    const {
        data: brokers = [],
        isLoading,
        isRefetching,
        refetch
    } = useBrokers();

    const [filteredBrokers, setFilteredBrokers] = useState<Broker[]>([]);
    const [selectedTab, setSelectedTab] = useState('All');
    const [tabs, setTabs] = useState(['All']);

    useEffect(() => {
        if (brokers.length > 0) {
            // Extract unique categories
            const allCats = new Set<string>();
            brokers.forEach(b => {
                if (b.categories) {
                    b.categories.forEach(c => allCats.add(c));
                }
            });
            setTabs(['All', ...Array.from(allCats)]);
        }
    }, [brokers]);

    useEffect(() => {
        if (selectedTab === 'All') {
            setFilteredBrokers(brokers);
        } else {
            setFilteredBrokers(brokers.filter(b => b.categories && b.categories.includes(selectedTab)));
        }
    }, [selectedTab, brokers]);

    const onRefresh = async () => {
        refetch();
    };

    const openLink = (url: string) => {
        if (url) Linking.openURL(url);
    };

    const renderLogo = (url: string) => {
        if (!url) {
            return (
                <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>No Logo</Text>
                </View>
            );
        }

        const isSvg = url.toLowerCase().endsWith('.svg');

        if (isSvg) {
            return (
                <View style={[styles.logo, { overflow: 'hidden' }]}>
                    <SvgUri
                        width="100%"
                        height="100%"
                        uri={url}
                    />
                </View>
            );
        }

        return (
            <Image
                source={{ uri: url }}
                style={styles.logo}
                resizeMode="contain"
                onError={(e) => console.log("Image Load Error:", url, e.nativeEvent.error)}
            />
        );
    };

    const renderItem = ({ item }: { item: Broker }) => (
        <View style={[
            styles.card,
            { backgroundColor: theme.colors.card, shadowColor: theme.colors.text },
            item.is_featured && {
                borderColor: theme.colors.gold,
                borderWidth: 1.5
            }
        ]}>
            {item.is_featured && (
                <View style={styles.featuredBadgeWrapper}>
                    <LinearGradient
                        colors={[theme.colors.gold, '#F59E0B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.featuredBadge}
                    >
                        <Text style={styles.featuredText}>RECOMMENDED</Text>
                    </LinearGradient>
                </View>
            )}

            <View style={styles.cardHeader}>
                <View style={[styles.logoWrapper, { backgroundColor: theme.colors.surfaceHighlight, borderColor: theme.colors.border }]}>
                    {renderLogo(item.logo)}
                </View>

                <View style={styles.headerInfo}>
                    <Text style={[styles.name, { color: theme.colors.text }]}>{item.title}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                        {item.rating > 0 && (
                            <View style={styles.ratingRow}>
                                <View style={styles.stars}>
                                    {[...Array(5)].map((_, i) => (
                                        <Ionicons
                                            key={i}
                                            name={i < Math.floor(item.rating) ? "star" : (i < item.rating ? "star-half" : "star-outline")}
                                            size={14}
                                            color="#f1c40f"
                                        />
                                    ))}
                                </View>
                                <Text style={[styles.ratingVal, { color: theme.colors.textSecondary }]}>{item.rating}/5</Text>
                            </View>
                        )}
                        {item.categories && item.categories.length > 0 && (
                            <View style={[
                                styles.catBadge,
                                {
                                    backgroundColor: theme.dark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                                    borderColor: theme.dark ? 'rgba(16, 185, 129, 0.3)' : '#d1fae5'
                                }
                            ]}>
                                <Text style={[styles.catText, { color: theme.colors.primary }]}>{item.categories[0]}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>Min Deposit</Text>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>{item.min_deposit || 'N/A'}</Text>
                </View>
                <View style={[styles.vertDivider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>Fees</Text>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>{item.fees || 'N/A'}</Text>
                </View>
            </View>

            {item.pros && item.pros.length > 0 && (
                <View style={[styles.prosContainer, { backgroundColor: theme.dark ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5' }]}>
                    {item.pros.slice(0, 3).map((p, index) => (
                        <View key={index} style={styles.proRow}>
                            <Ionicons name="checkmark-circle" size={14} color={theme.colors.primary} style={{ marginTop: 2 }} />
                            <Text style={[styles.proText, { color: theme.colors.textSecondary }]} numberOfLines={1}>{p}</Text>
                        </View>
                    ))}
                </View>
            )}

            <TouchableOpacity onPress={() => openLink(item.affiliate_link)} activeOpacity={0.9}>
                <LinearGradient
                    colors={item.is_featured ? [theme.colors.gold, '#D97706'] : [theme.colors.primary, '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Open Free Account</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    if (isLoading && !isRefetching) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ flex: 1, marginTop: 50 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Best Trading Brokers</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                        Compare and choose the best
                    </Text>
                </View>
                <View style={styles.headerRight}>
                    <View style={[styles.updateBadge, { backgroundColor: theme.colors.surfaceHighlight }]}>
                        <Ionicons name="shield-checkmark-outline" size={12} color={theme.colors.success} />
                        <Text style={[styles.updateText, { color: theme.colors.textSecondary }]}>Verified</Text>
                    </View>
                </View>
            </View>

            {/* Segmented Control Tabs */}
            <SegmentedControl
                tabs={tabs}
                activeTab={selectedTab}
                onTabChange={setSelectedTab}
            />

            <FlatList
                data={filteredBrokers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
                ListEmptyComponent={<Text style={[styles.empty, { color: theme.colors.textSecondary }]}>No Brokers found in {selectedTab}.</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
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
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    updateText: {
        fontSize: 10,
    },
    iconButton: {
        padding: 4,
    },
    listContent: { padding: 15, paddingBottom: 100 },

    card: {
        padding: 16,
        marginBottom: 20,
        borderRadius: 16,
        elevation: 4,
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 }
    },

    featuredBadgeWrapper: { position: 'absolute', top: 16, right: 0, zIndex: 10 },
    featuredBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        elevation: 2
    },
    featuredText: { fontSize: 10, fontWeight: '800', color: '#fff' },

    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    logoWrapper: {
        width: 60,
        height: 60,
        borderRadius: 14,
        borderWidth: 1,
        marginRight: 15,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
    },
    logo: {
        width: '100%',
        height: '100%',
        padding: 6,
        backgroundColor: '#ffffff',
    },
    logoPlaceholder: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },

    headerInfo: { flex: 1, paddingRight: 80 },
    name: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    stars: { flexDirection: 'row', marginRight: 6 },
    ratingVal: { fontSize: 12, fontWeight: '600' },

    catBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        marginTop: 4,
    },
    catText: {
        fontSize: 10,
        fontWeight: '500',
    },

    divider: { height: 1, width: '100%', marginBottom: 15, opacity: 0.5 },

    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    statItem: { alignItems: 'center', flex: 1 },
    statLabel: { fontSize: 11, fontWeight: '500', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
    statValue: { fontSize: 14, fontWeight: '700' },
    vertDivider: { width: 1, height: '80%', opacity: 0.5 },

    prosContainer: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 15
    },
    proRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
    proText: { fontSize: 12, flex: 1 },

    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
        elevation: 2
    },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

    empty: { textAlign: 'center', marginTop: 30 }
});
