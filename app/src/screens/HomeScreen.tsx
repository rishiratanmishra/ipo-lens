import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const MOCK_SUBSCRIPTION_DATA = [
    {
        id: '1',
        name: 'Tata Technologies',
        type: 'Mainboard',
        subscribed: '15.4x',
        priceRange: '₹475 - 500',
        progress: 0.7,
        logo: 'https://companieslogo.com/img/orig/TATA.NS-72dbc7c3.png?t=1631949774' // Placeholder logo URL
    },
    {
        id: '2',
        name: 'Gandhar Oil Ref.',
        type: 'Mainboard',
        subscribed: '64.x',
        priceRange: '₹160 - 169',
        progress: 0.9,
    }
];

const MOCK_GMP_DATA = [
    {
        id: '1',
        name: 'Doms Industries',
        tag: 'TOP GAINER',
        gmp: '+65%',
        exp: '₹1,200',
        color: '#10B981'
    },
    {
        id: '2',
        name: 'Inox India',
        gmp: '+45%',
        exp: 'GMP Value',
        color: '#10B981'
    },
    {
        id: '3',
        name: 'Motisons',
        gmp: '+110%',
        exp: 'GMP Value',
        color: '#10B981'
    }
];

const MOCK_LIST_DATA = [
    { id: '1', name: 'Inox India Ltd', range: 'Dec 14 - 18', status: 'Open', price: '₹627 - 660', gmp: '45%' },
    { id: '2', name: 'Motisons Jewellers', range: 'Dec 18 - 20', status: 'Upcoming', type: 'SME', price: '₹52 - 55', gmp: '110%' },
    { id: '3', name: 'Muthoot Microfin', range: 'Dec 18 - 20', status: 'Upcoming', price: '₹277 - 291', gmp: '12%' },
];

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={20} color={theme.colors.primary} />
                    </View>
                    <View>
                        <Text style={styles.welcomeText}>WELCOME BACK</Text>
                        <Text style={styles.userName}>Investor</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="search" size={22} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={22} color={theme.colors.success} />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Tickers */}
                <View style={styles.tickerContainer}>
                    <View style={styles.tickerCard}>
                        <Text style={styles.tickerLabel}>NIFTY 50</Text>
                        <View style={styles.tickerValueRow}>
                            <Text style={styles.tickerValue}>20,930.50</Text>
                            <View style={styles.tickerChangePositive}>
                                <Ionicons name="trending-up" size={12} color={theme.colors.success} />
                                <Text style={styles.tickerChangeText}>0.5%</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.tickerCard}>
                        <Text style={styles.tickerLabel}>SENSEX</Text>
                        <View style={styles.tickerValueRow}>
                            <Text style={styles.tickerValue}>69,500.10</Text>
                            <View style={styles.tickerChangePositive}>
                                <Ionicons name="trending-up" size={12} color={theme.colors.success} />
                                <Text style={styles.tickerChangeText}>0.2%</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Open for Subscription */}
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <View style={styles.statusDot} />
                        <Text style={styles.sectionTitle}>Open for Subscription</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('IPO')}>
                         <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {MOCK_SUBSCRIPTION_DATA.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={styles.subscriptionCard}
                            onPress={() => navigation.navigate('IPODetail', { ipo: item })}
                        >
                            <View style={styles.subCardHeader}>
                                <View style={styles.logoPlaceholder}>
                                    <Ionicons name="business" size={24} color={theme.colors.text} />
                                </View>
                                <View>
                                    <View style={styles.endsInBadge}>
                                        <Text style={styles.endsInText}>ENDS IN 2D</Text>
                                    </View>
                                    <Text style={styles.companyName}>{item.name}</Text>
                                    <View style={styles.tag}>
                                        <Text style={styles.tagText}>{item.type}</Text>
                                    </View>
                                </View>
                            </View>
                            
                            <View style={styles.subStatsRow}>
                                <View>
                                    <Text style={styles.statLabel}>SUBSCRIBED</Text>
                                    <Text style={[styles.statValue, {color: theme.colors.success, fontSize: 20}]}>{item.subscribed}</Text>
                                </View>
                                <View>
                                    <Text style={styles.statLabel}>PRICE RANGE</Text>
                                    <Text style={styles.statValue}>{item.priceRange}</Text>
                                </View>
                            </View>

                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, {width: `${item.progress * 100}%`}]} />
                            </View>

                            <TouchableOpacity style={styles.applyButton}>
                                <Text style={styles.applyButtonText}>Apply Now</Text>
                                <Ionicons name="arrow-forward" size={16} color={theme.colors.background} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Trending GMP */}
                <View style={[styles.sectionHeader, {marginTop: theme.spacing.xl}]}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={styles.sectionTitle}>Trending GMP</Text>
                        <Text style={{fontSize: 20}}> 🔥</Text>
                    </View>
                </View>

                <View style={styles.gmpGrid}>
                    <TouchableOpacity style={styles.gmpHeroCard}>
                        <Text style={styles.topGainerText}>TOP GAINER</Text>
                        <Text style={styles.gmpHeroName}>{MOCK_GMP_DATA[0].name}</Text>
                        <Text style={styles.gmpHeroValue}>{MOCK_GMP_DATA[0].gmp}</Text>
                        <Text style={styles.gmpHeroExp}>Exp: {MOCK_GMP_DATA[0].exp}</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.gmpSideColumn}>
                        {MOCK_GMP_DATA.slice(1).map((item) => (
                            <View key={item.id} style={styles.gmpSmallCard}>
                                <Text style={styles.gmpSmallName}>{item.name}</Text>
                                <Text style={styles.gmpSmallLabel}>{item.exp}</Text>
                                <Text style={[styles.gmpSmallValue, {color: item.color}]}>{item.gmp}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* List Filters */}
                <View style={styles.filterRow}>
                    <TouchableOpacity style={[styles.filterChip, styles.activeFilterChip]}>
                        <Text style={styles.activeFilterText}>Upcoming</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterText}>Mainboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterText}>SME</Text>
                    </TouchableOpacity>
                </View>

                {/* IPO List */}
                {MOCK_LIST_DATA.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.listCard}
                         onPress={() => navigation.navigate('IPODetail', { ipo: item })}
                    >
                        <View style={styles.listHeader}>
                            <View style={styles.listLogo}>
                                <Text style={styles.listLogoText}>{item.name.substring(0, 4)}</Text>
                            </View>
                            <View style={styles.listInfo}>
                                <Text style={styles.listName}>{item.name}</Text>
                                <Text style={styles.listStatus}>{item.range} • <Text style={{color: item.status === 'Open' ? theme.colors.success : theme.colors.textSecondary}}>{item.status}</Text></Text>
                            </View>
                            {item.type === 'SME' && (
                                <View style={styles.smeTag}>
                                    <Text style={styles.smeTagText}>SME</Text>
                                </View>
                            )}
                            {item.price === 'main' && <View style={styles.mainTag}><Text style={styles.smeTagText}>MAIN</Text></View>}
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.listFooter}>
                            <View>
                                <Text style={styles.listFooterLabel}>OFFER PRICE</Text>
                                <Text style={styles.listFooterValue}>{item.price}</Text>
                            </View>
                            <View style={{alignItems: 'flex-end'}}>
                                <Text style={styles.listFooterLabel}>GMP INDICATOR</Text>
                                <Text style={[styles.listFooterValue, {color: theme.colors.success}]}>↑ {item.gmp}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

            </ScrollView>

            <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('GMP')}>
                 <Ionicons name="filter" size={24} color={theme.colors.background} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { padding: theme.spacing.md, paddingBottom: 80 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: theme.colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 10,
        color: theme.colors.secondary, // Actually primary or accent color in design usually
        fontWeight: 'bold',
        color: theme.colors.primary
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.success,
        borderWidth: 1,
        borderColor: theme.colors.background
    },
    tickerContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: theme.spacing.md,
    },
    tickerCard: {
        flex: 1,
        backgroundColor: theme.colors.surfaceLight,
        padding: 12,
        borderRadius: 12,
    },
    tickerLabel: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginBottom: 4,
    },
    tickerValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
    },
    tickerValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    tickerChangePositive: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    tickerChangeText: {
        color: theme.colors.success,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.md,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.success,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    viewAll: {
        color: theme.colors.success,
        fontSize: 14,
        fontWeight: '600',
    },
    horizontalScroll: {
        marginLeft: -theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
    },
    subscriptionCard: {
        width: width * 0.75,
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: 16,
        padding: theme.spacing.md,
        marginRight: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    subCardHeader: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
        gap: 12,
    },
    logoPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#2D3748',
        justifyContent: 'center',
        alignItems: 'center',
    },
    endsInBadge: {
        backgroundColor: '#7f1d1d',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 4,
    },
    endsInText: {
        color: '#fca5a5',
        fontSize: 10,
        fontWeight: 'bold',
    },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    tag: {
        backgroundColor: theme.colors.surface,
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    tagText: {
        color: theme.colors.textSecondary,
        fontSize: 10,
    },
    subStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    statLabel: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        marginBottom: 2,
    },
    statValue: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: theme.colors.surface,
        borderRadius: 3,
        marginBottom: theme.spacing.lg,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 3,
    },
    applyButton: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    applyButtonText: {
        color: theme.colors.background,
        fontWeight: 'bold',
        fontSize: 16,
    },
    gmpGrid: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    gmpHeroCard: {
        flex: 1,
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: 16,
        padding: theme.spacing.md,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(52, 211, 153, 0.2)',
    },
    topGainerText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    gmpHeroName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    gmpHeroValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.success,
        marginVertical: 8,
    },
    gmpHeroExp: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    gmpSideColumn: {
        flex: 1,
        gap: theme.spacing.md,
    },
    gmpSmallCard: {
        flex: 1,
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: 16,
        padding: theme.spacing.md,
        justifyContent: 'center',
    },
    gmpSmallName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    gmpSmallLabel: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        marginTop: 2,
    },
    gmpSmallValue: {
        position: 'absolute',
        right: 12,
        fontSize: 18,
        fontWeight: 'bold',
    },
    filterRow: {
        flexDirection: 'row',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.md,
        gap: 12,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: 20,
    },
    activeFilterChip: {
        backgroundColor: theme.colors.surfaceLight, // Usually darker or highlighted, but design shows minimal
        borderWidth: 1,
        borderColor: theme.colors.textSecondary
    },
    filterText: {
        color: theme.colors.textSecondary,
    },
    activeFilterText: {
        color: theme.colors.text,
        fontWeight: 'bold'
    },
    listCard: {
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: 16,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    listLogo: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listLogoText: {
        color: theme.colors.background,
        fontWeight: 'bold',
    },
    listInfo: {
        flex: 1,
    },
    listName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 2,
    },
    listStatus: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    smeTag: {
        backgroundColor: '#92400e',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    mainTag: {
        backgroundColor: '#064e3b',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    smeTagText: {
        color: '#fcd34d',
        fontSize: 10,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: 12,
    },
    listFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    listFooterLabel: {
        fontSize: 10,
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    listFooterValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    }
});
