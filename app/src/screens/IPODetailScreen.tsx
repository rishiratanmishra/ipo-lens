import React, { useLayoutEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';

const { width } = Dimensions.get('window');

// Helper to generate mock data based on theme
const getMockDetails = (theme) => ({
    biddingEnds: '2 days',
    currentGmp: '₹55',
    gmpChange: '+45%',
    priceBand: '₹72 - ₹76',
    lotSize: '195 Shares',
    minInvest: '₹14,820',
    issueSize: '₹9,375 Cr',
    subscription: {
        retail: { value: '12.5x', label: 'Retail', color: theme.colors.primary },
        nii: { value: '4.2x', label: 'Non-Institutional (NII)', color: theme.colors.accent },
        qib: { value: '0.8x', label: 'QIB', color: theme.colors.gold || '#FFD700' }, // Fallback if gold not in theme
    },
    timeline: [
        { title: 'Offer Opens', date: '14 Jul, 2021', icon: 'calendar-outline', active: true },
        { title: 'Offer Closes', date: '16 Jul, 2021', icon: 'timer-outline', active: true },
        { title: 'Basis of Allotment', date: '21 Jul, 2021', icon: 'document-text-outline', active: false },
        { title: 'Listing Date', date: '23 Jul, 2021', icon: 'notifications-outline', active: false },
    ],
    financials: [
        { year: '2019', value: 1.3, height: 60 },
        { year: '2020', value: 2.6, height: 100 },
        { year: '2021', value: 3.1, height: 140, active: true },
    ],
    about: "Zomato is an Indian multinational restaurant aggregator and food delivery company. It provides information, menus and user-reviews of restaurants as well as food delivery options from partner restaurants in select cities."
});

export default function IPODetailScreen({ navigation, route }) {
    const { ipo } = route.params || {};
    const companyName = ipo?.name || 'Zomato Ltd';
    const tag = ipo?.type || 'Mainboard IPO';
    const { theme } = useTheme();

    const MOCK_DETAILS = useMemo(() => getMockDetails(theme), [theme]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: companyName + ' IPO',
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 16 }}>
                    <Ionicons name="star-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, companyName, theme]);

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Top Card */}
            <View style={[styles.topCard, { backgroundColor: theme.colors.surfaceLight }]}>
                <View style={[styles.logoContainer, { backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.logoText, { color: theme.colors.primary }]}>{companyName.substring(0, 1)}</Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={[styles.companyTitle, { color: theme.colors.text }]}>{companyName}</Text>
                    <Text style={[styles.companySubtitle, { color: theme.colors.textSecondary }]}>{tag} • NSE & BSE</Text>
                    <View style={styles.timerBadge}>
                        <Ionicons name="time" size={12} color="#F59E0B" />
                        <Text style={styles.timerText}>Bidding Ends in {MOCK_DETAILS.biddingEnds}</Text>
                    </View>
                </View>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>OPEN</Text>
                </View>
            </View>

            {/* Current GMP Card */}
            <View style={[styles.gmpCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View>
                    <Text style={[styles.cardLabel, { color: theme.colors.textSecondary }]}>CURRENT GMP</Text>
                    <View style={styles.gmpRow}>
                        <Text style={[styles.gmpValue, { color: theme.colors.text }]}>{MOCK_DETAILS.currentGmp}</Text>
                        <View style={styles.gmpChangeBadge}>
                            <Ionicons name="trending-up" size={12} color={theme.colors.success} />
                            <Text style={styles.gmpChangeText}>{MOCK_DETAILS.gmpChange}</Text>
                        </View>
                    </View>
                </View>
                {/* Simple Bar Chart Visualization */}
                <View style={styles.gmpChart}>
                    <View style={[styles.bar, { height: 10 }]} />
                    <View style={[styles.bar, { height: 15 }]} />
                    <View style={[styles.bar, { height: 12 }]} />
                    <View style={[styles.bar, { height: 20 }]} />
                    <View style={[styles.bar, { height: 25, backgroundColor: theme.colors.primary }]} />
                </View>
            </View>

            <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Issue Details</Text>
            <View style={styles.grid}>
                <View style={[styles.detailCard, { marginRight: 8, backgroundColor: theme.colors.surfaceLight }]}>
                    <Ionicons name="cash-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>PRICE BAND</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{MOCK_DETAILS.priceBand}</Text>
                </View>
                <View style={[styles.detailCard, { marginLeft: 8, backgroundColor: theme.colors.surfaceLight }]}>
                    <Ionicons name="cube-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>LOT SIZE</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{MOCK_DETAILS.lotSize}</Text>
                </View>
            </View>
            <View style={[styles.grid, { marginTop: 16 }]}>
                <View style={[styles.detailCard, { marginRight: 8, backgroundColor: theme.colors.surfaceLight }]}>
                    <Ionicons name="wallet-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>MIN INVESTMENT</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{MOCK_DETAILS.minInvest}</Text>
                </View>
                <View style={[styles.detailCard, { marginLeft: 8, backgroundColor: theme.colors.surfaceLight }]}>
                    <Ionicons name="pie-chart-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>ISSUE SIZE</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{MOCK_DETAILS.issueSize}</Text>
                </View>
            </View>

            <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
                <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Subscription Status</Text>
                <View style={[styles.liveBadge, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.liveText, { color: theme.colors.textSecondary }]}>Live: 2:30 PM</Text>
                </View>
            </View>

            <View style={[styles.subscriptionContainer, { backgroundColor: theme.colors.surfaceLight }]}>
                {Object.values(MOCK_DETAILS.subscription).map((item, index) => (
                    <View key={index} style={styles.subRow}>
                        <View style={styles.subHeader}>
                            <Text style={[styles.subLabel, { color: theme.colors.text }]}>{item.label}</Text>
                            <Text style={[styles.subValue, { color: theme.colors.success }]}>{item.value} <Text style={{ fontSize: 10, color: theme.colors.textSecondary }}>Subscribed</Text></Text>
                        </View>
                        <View style={[styles.subProgressBg, { backgroundColor: theme.colors.background }]}>
                            <View style={[styles.subProgressFill, { width: '60%', backgroundColor: item.color }]} />
                        </View>
                        {index === 0 && <Text style={[styles.chanceText, { color: theme.colors.textSecondary }]}>Chance of allotment: Low</Text>}
                    </View>
                ))}
            </View>

            <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.colors.text }]}>Timeline</Text>
            <View style={[styles.timelineContainer, { backgroundColor: theme.colors.surfaceLight }]}>
                {MOCK_DETAILS.timeline.map((item, index) => (
                    <View key={index} style={styles.timelineItem}>
                        <View style={styles.timelineLeft}>
                            <View style={[
                                styles.timelineIconBox,
                                { backgroundColor: theme.colors.surface, borderColor: theme.colors.textSecondary },
                                item.active && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                            ]}>
                                <Ionicons name={item.icon as any} size={20} color={item.active ? theme.colors.background : theme.colors.textSecondary} />
                            </View>
                            {index < MOCK_DETAILS.timeline.length - 1 && <View style={[styles.timelineLine, { backgroundColor: theme.colors.textSecondary }]} />}
                        </View>
                        <View style={styles.timelineContent}>
                            <Text style={[styles.timelineTitle, { color: theme.colors.text }]}>{item.title}</Text>
                            <Text style={[styles.timelineDate, { color: theme.colors.textSecondary }]}>{item.date}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.colors.text }]}>Financials (Cr)</Text>
            <View style={[styles.financialsCard, { backgroundColor: theme.colors.surfaceLight }]}>
                <View style={styles.chartContainer}>
                    {MOCK_DETAILS.financials.map((item, index) => (
                        <View key={index} style={styles.chartCol}>
                            <Text style={[styles.chartYear, { color: theme.colors.textSecondary }]}>{item.year}</Text>
                            <View style={[styles.chartBar, { height: item.height, backgroundColor: item.active ? theme.colors.primary : '#4B5563' }]} />
                            <Text style={[styles.chartValue, { color: theme.colors.text }]}>₹{item.value}k</Text>
                        </View>
                    ))}
                </View>
                <TouchableOpacity style={[styles.financialsLink, { borderTopColor: theme.colors.border }]}>
                    <Text style={[styles.financialsLinkText, { color: theme.colors.primary }]}>View Detailed Financials</Text>
                    <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.colors.text }]}>About {companyName}</Text>
            <View style={[styles.aboutCard, { backgroundColor: theme.colors.surfaceLight }]}>
                <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>{MOCK_DETAILS.about}</Text>
                <TouchableOpacity>
                    <Text style={[styles.readMore, { color: theme.colors.primary }]}>Read More</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: defaultTheme.colors.background, padding: defaultTheme.spacing.md },
    topCard: {
        flexDirection: 'row',
        backgroundColor: defaultTheme.colors.surfaceLight,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: defaultTheme.colors.primary,
    },
    headerInfo: {
        flex: 1,
    },
    companyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    companySubtitle: {
        fontSize: 12,
        color: defaultTheme.colors.textSecondary,
        marginVertical: 4,
    },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timerText: {
        color: '#F59E0B',
        fontSize: 12,
        fontWeight: 'bold',
    },
    statusBadge: {
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        position: 'absolute',
        top: 16,
        right: 16,
    },
    statusText: {
        color: defaultTheme.colors.success,
        fontSize: 10,
        fontWeight: 'bold',
    },
    gmpCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: defaultTheme.colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: defaultTheme.colors.border,
    },
    cardLabel: {
        color: defaultTheme.colors.textSecondary,
        fontSize: 10,
        marginBottom: 4,
    },
    gmpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    gmpValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    gmpChangeBadge: {
        flexDirection: 'row',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignItems: 'center',
    },
    gmpChangeText: {
        color: defaultTheme.colors.success,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    gmpChart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 4,
        height: 30,
    },
    bar: {
        width: 6,
        backgroundColor: '#4B5563',
        borderRadius: 2,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
        marginBottom: 12,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    liveBadge: {
        backgroundColor: '#374151',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    liveText: {
        color: defaultTheme.colors.textSecondary,
        fontSize: 10,
    },
    grid: {
        flexDirection: 'row',
    },
    detailCard: {
        flex: 1,
        backgroundColor: defaultTheme.colors.surfaceLight,
        borderRadius: 12,
        padding: 12,
    },
    detailIcon: {
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 10,
        color: defaultTheme.colors.textSecondary,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    subscriptionContainer: {
        backgroundColor: defaultTheme.colors.surfaceLight,
        borderRadius: 12,
        padding: 16,
    },
    subRow: {
        marginBottom: 16,
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    subLabel: {
        color: defaultTheme.colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    subValue: {
        color: defaultTheme.colors.success,
        fontWeight: 'bold',
    },
    subProgressBg: {
        height: 6,
        backgroundColor: defaultTheme.colors.background,
        borderRadius: 3,
    },
    subProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
    chanceText: {
        color: defaultTheme.colors.textSecondary,
        fontSize: 10,
        marginTop: 4,
    },
    timelineContainer: {
        backgroundColor: defaultTheme.colors.surfaceLight,
        borderRadius: 12,
        padding: 16,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 0,
        height: 70, // Fixed height for alignment
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: 16,
        width: 40,
    },
    timelineIconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: defaultTheme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: defaultTheme.colors.textSecondary,
        zIndex: 1,
    },
    timelineIconBoxActive: {
        backgroundColor: defaultTheme.colors.primary,
        borderColor: defaultTheme.colors.primary,
    },
    timelineLine: {
        flex: 1,
        width: 1,
        backgroundColor: defaultTheme.colors.textSecondary,
    },
    timelineContent: {
        paddingTop: 8,
    },
    timelineTitle: {
        color: defaultTheme.colors.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    timelineDate: {
        color: defaultTheme.colors.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    financialsCard: {
        backgroundColor: defaultTheme.colors.surfaceLight,
        borderRadius: 12,
        padding: 16,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 180,
        marginBottom: 16,
    },
    chartCol: {
        alignItems: 'center',
        gap: 8,
    },
    chartYear: {
        color: defaultTheme.colors.textSecondary,
        fontSize: 12,
    },
    chartBar: {
        width: 60,
        borderRadius: 4,
    },
    chartValue: {
        color: defaultTheme.colors.text,
        fontWeight: 'bold',
        fontSize: 12,
    },
    financialsLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: defaultTheme.colors.border,
        paddingTop: 12,
    },
    financialsLinkText: {
        color: defaultTheme.colors.primary,
        fontWeight: 'bold',
        marginRight: 4,
    },
    aboutCard: {
        backgroundColor: defaultTheme.colors.surfaceLight,
        borderRadius: 12,
        padding: 16,
    },
    aboutText: {
        color: defaultTheme.colors.textSecondary,
        lineHeight: 20,
    },
    readMore: {
        color: defaultTheme.colors.primary,
        fontWeight: 'bold',
        marginTop: 8,
    }
});
