import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const MOCK_GMP_LIST = [
    {
        id: '1',
        name: 'Inox India Ltd',
        priceRange: '₹627 - 660',
        status: 'Bidding Open',
        statusColor: theme.colors.success,
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
        statusColor: theme.colors.accent,
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
        statusColor: theme.colors.error,
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
        statusColor: theme.colors.error,
        gmp: '₹20',
        gmpChange: '5.56%',
        estListing: '₹380',
        fire: false
    }
];

export default function GMPListScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('Mainboard');

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('IPODetail', { ipo: item })}>
            <View style={styles.cardLeft}>
                <View style={styles.logoPlaceholder}>
                     <Text style={styles.logoText}>{item.name.substring(0, 1)}</Text>
                </View>
                <View>
                    <Text style={styles.companyName}>{item.name}</Text>
                    <Text style={styles.priceRange}>{item.priceRange}</Text>
                    <Text style={[styles.statusText, {color: item.statusColor}]}>● {item.status}</Text>
                </View>
            </View>
            <View style={styles.cardRight}>
                <View style={styles.gmpRow}>
                    {item.fire && <Text>🔥</Text>}
                    <Text style={styles.gmpValue}>{item.gmp}</Text>
                </View>
                <Text style={styles.gmpChange}>{item.gmpChange}</Text>
                <Text style={styles.estListing}>Est: {item.estListing}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>GMP Trends</Text>
                <View style={styles.headerRight}>
                     <View style={styles.updateBadge}>
                        <Ionicons name="time-outline" size={12} color={theme.colors.textSecondary} />
                        <Text style={styles.updateText}>10m ago</Text>
                     </View>
                     <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="search" size={20} color={theme.colors.text} />
                     </TouchableOpacity>
                     
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'Mainboard' && styles.activeTab]}
                    onPress={() => setActiveTab('Mainboard')}
                >
                    <Text style={[styles.tabText, activeTab === 'Mainboard' && styles.activeTabText]}>Mainboard</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'SME' && styles.activeTab]}
                    onPress={() => setActiveTab('SME')}
                >
                    <Text style={[styles.tabText, activeTab === 'SME' && styles.activeTabText]}>SME</Text>
                </TouchableOpacity>
            </View>

            {/* Market Mood Hero */}
            <View style={styles.heroCard}>
                <View>
                    <Text style={styles.heroLabel}>MARKET MOOD</Text>
                    <Text style={styles.heroTitle}>Bullish Sentiment</Text>
                    <Text style={styles.heroSubtitle}>High listing gains expected</Text>
                </View>
                <View style={styles.moodIcon}>
                     <Ionicons name="trending-up" size={32} color={theme.colors.success} />
                </View>
            </View>

            <View style={styles.listHeaderRow}>
                <Text style={styles.listHeaderTitle}>Active IPOs</Text>
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
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
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
        backgroundColor: theme.colors.surfaceLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    updateText: {
        fontSize: 10,
        color: theme.colors.textSecondary,
    },
    iconButton: {
        padding: 4,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.md,
        marginTop: theme.spacing.md,
        gap: 16,
    },
    tab: {
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: theme.colors.primary,
    },
    tabText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: theme.colors.text,
    },
    heroCard: {
        margin: theme.spacing.md,
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
        color: theme.colors.success,
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 2,
    },
    heroSubtitle: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    moodIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    listHeaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    listContent: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceLight,
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
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 2,
    },
    priceRange: {
        fontSize: 12,
        color: theme.colors.textSecondary,
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
        color: theme.colors.success,
    },
    gmpChange: {
        fontSize: 12,
        color: theme.colors.success,
        marginBottom: 2,
    },
    estListing: {
        fontSize: 10,
        color: theme.colors.textSecondary,
    }
});
