import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';

const MOCK_GMP_LIST = [
    {
        id: '1',
        name: 'Inox India Ltd',
        priceRange: '₹627 - 660',
        status: 'Bidding Open',
        statusType: 'success',
        gmp: '₹450',
        gmpChange: '71.77%',
        estListing: '₹1,110',
        fire: true
    },
    {
        id: '2',
        name: 'Motisons Jewellers',
        priceRange: '₹52 - 55',
        status: 'Allotment Out',
        statusType: 'accent',
        gmp: '₹109',
        gmpChange: '198.18%',
        estListing: '₹164',
        fire: true
    },
    {
        id: '3',
        name: 'Muthoot Microfin',
        priceRange: '₹277 - 291',
        status: 'Closed',
        statusType: 'error',
        gmp: '₹35',
        gmpChange: '12.03%',
        estListing: '₹326',
        fire: false
    },
    {
        id: '4',
        name: 'Suraj Estate Dev',
        priceRange: '₹340 - 360',
        status: 'Closed',
        statusType: 'error',
        gmp: '₹20',
        gmpChange: '5.56%',
        estListing: '₹380',
        fire: false
    }
];

export default function GMPListScreen({ navigation }) {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('Mainboard');

    const getStatusColor = (type) => {
        // @ts-ignore - Assuming colors exist on theme
        return theme.colors[type] || theme.colors.text;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.colors.surfaceHighlight }]}
            onPress={() => navigation.navigate('IPODetail', { ipo: item })}
        >
            <View style={styles.cardLeft}>
                <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.logoText, { color: theme.colors.text }]}>{item.name.substring(0, 1)}</Text>
                </View>
                <View>
                    <Text style={[styles.companyName, { color: theme.colors.text }]}>{item.name}</Text>
                    <Text style={[styles.priceRange, { color: theme.colors.textSecondary }]}>{item.priceRange}</Text>
                    <Text style={[styles.statusText, { color: getStatusColor(item.statusType) }]}>● {item.status}</Text>
                </View>
            </View>
            <View style={styles.cardRight}>
                <View style={styles.gmpRow}>
                    {item.fire && <Text>🔥</Text>}
                    <Text style={[styles.gmpValue, { color: theme.colors.success }]}>{item.gmp}</Text>
                </View>
                <Text style={[styles.gmpChange, { color: theme.colors.success }]}>{item.gmpChange}</Text>
                <Text style={[styles.estListing, { color: theme.colors.textSecondary }]}>Est: {item.estListing}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>GMP Trends</Text>
                <View style={styles.headerRight}>
                    <View style={[styles.updateBadge, { backgroundColor: theme.colors.surfaceHighlight }]}>
                        <Ionicons name="time-outline" size={12} color={theme.colors.textSecondary} />
                        <Text style={[styles.updateText, { color: theme.colors.textSecondary }]}>10m ago</Text>
                    </View>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="search" size={20} color={theme.colors.text} />
                    </TouchableOpacity>

                </View>
            </View>

            {/* Tabs */}
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

            {/* Market Mood Hero */}
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
                <Text style={[styles.listHeaderTitle, { color: theme.colors.text }]}>Active IPOs</Text>
                <TouchableOpacity>
                    <Ionicons name="filter" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={MOCK_GMP_LIST}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
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
