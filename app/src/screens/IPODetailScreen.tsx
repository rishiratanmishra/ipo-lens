import React, { useLayoutEffect, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Linking, Image } from 'react-native';
import { getIPODetails, IPODetails } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';

const { width } = Dimensions.get('window');

export default function IPODetailScreen({ navigation, route }) {
    const { ipo } = route.params || {};
    const [details, setDetails] = useState<IPODetails | null>(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    const companyName = ipo?.name || details?.ipo_name || 'IPO Details';
    const tag = ipo?.is_sme ? 'SME IPO' : 'Mainboard IPO';

    useEffect(() => {
        let isMounted = true;
        const fetchDetails = async () => {
            if (ipo?.id) {
                const data = await getIPODetails(ipo.id);
                if (isMounted) {
                    setDetails(data);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchDetails();
        return () => { isMounted = false; };
    }, [ipo?.id]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: companyName,
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 16 }}>
                    <Ionicons name="star-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, companyName, theme]);

    // Data merging logic
    const displayData = useMemo(() => {
        const basic = details?.basic_details || {};
        const ipoDetails = details?.ipo_details || {};

        // Parse date range if needed
        let openDate = ipo?.open_date;
        let closeDate = ipo?.close_date;

        if (!openDate && details?.dates) {
            const parts = details.dates.split('–').map(s => s.trim());
            if (parts.length === 2) {
                openDate = parts[0];
                closeDate = parts[1];
            } else {
                // Try with hyphen
                const parts2 = details.dates.split('-').map(s => s.trim());
                if (parts2.length === 2) {
                    openDate = parts2[0];
                    closeDate = parts2[1];
                }
            }
        }

        const getRoughDate = (str) => {
            if (!str || str === 'TBA') return null;
            const d = new Date(str);
            if (!isNaN(d.getTime())) return d;
            return null;
        };

        const isCompleted = (dateStr) => {
            const d = getRoughDate(dateStr);
            if (!d) return false;
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            d.setHours(0, 0, 0, 0);
            // Highlight if date is reached or passed
            return d <= now;
        };

        const allotmentDate = basic['Allotment'] || ipo?.allotment_date || 'TBA';
        const listingDate = basic['Listing'] || ipo?.listing_date || 'TBA';

        return {
            priceBand: basic['Price'] || ipo?.price_band || 'N/A',
            lotSize: basic['Lot size'] || (ipo?.lot_size ? `${ipo.lot_size} Shares` : 'N/A'),
            issueSize: basic['Issue size'] || (ipo?.issue_size_cr ? `₹${ipo.issue_size_cr} Cr` : 'N/A'),
            minInvest: (ipo?.min_price && ipo?.lot_size) ? `₹${(ipo.min_price * ipo.lot_size).toLocaleString('en-IN')}` : 'N/A',
            dates: details?.dates || `${ipo?.open_date} - ${ipo?.close_date}`,
            biddingEnds: ipo?.close_date || 'N/A',
            currentGmp: ipo?.premium ? `₹${parseInt(ipo.premium)}` : (basic['GMP Rumors *'] || '₹0'),

            timeline: [
                { title: 'Offer Opens', date: openDate || 'TBA', icon: 'calendar-outline', active: isCompleted(openDate) },
                { title: 'Offer Closes', date: closeDate || 'TBA', icon: 'timer-outline', active: isCompleted(closeDate) },
                { title: 'Allotment', date: allotmentDate, icon: 'document-text-outline', active: isCompleted(allotmentDate) },
                { title: 'Listing', date: listingDate, icon: 'notifications-outline', active: isCompleted(listingDate) },
            ],
            ipoDetailsMap: ipoDetails,
            lotDistribution: details?.lot_distribution || [],
            reservation: details?.reservation || [],
            leadManagers: details?.lead_managers || [],
            address: details?.address || '',
            applicationBreakup: details?.application_breakup || []
        };
    }, [ipo, details]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return theme.colors.success;
            case 'CLOSED': return theme.colors.error;
            case 'UPCOMING': return theme.colors.secondary;
            case 'LISTED': return theme.colors.accent;
            default: return theme.colors.textSecondary;
        }
    };
    const statusColor = getStatusColor(ipo?.status || 'UPCOMING');

    const openLink = (url, title) => {
        if (!url) return;
        navigation.navigate('WebView', { url, title });
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Top Card */}
            <View style={[styles.topCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                <View style={[styles.logoContainer, { backgroundColor: theme.colors.surface }]}>
                    {(details?.image || ipo?.icon_url) ? (
                        <Image
                            source={{ uri: details?.image || ipo?.icon_url }}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <Text style={[styles.logoText, { color: theme.colors.primary }]}>{companyName.substring(0, 1)}</Text>
                    )}
                </View>
                <View style={styles.headerInfo}>
                    <Text style={[styles.companyTitle, { color: theme.colors.text }]}>{companyName}</Text>
                    <Text style={[styles.companySubtitle, { color: theme.colors.textSecondary }]}>{tag} • NSE & BSE</Text>
                    <View style={styles.timerBadge}>
                        <Ionicons name="calendar" size={12} color="#F59E0B" />
                        <Text style={styles.timerText}>{displayData.dates}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: theme.colors.surface, borderColor: statusColor, borderWidth: 1 }]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>{ipo?.status || 'UPCOMING'}</Text>
                </View>
            </View>

            {/* GMP Card */}
            <View style={[styles.gmpCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View>
                    <Text style={[styles.cardLabel, { color: theme.colors.textSecondary }]}>CURRENT GMP</Text>
                    <View style={styles.gmpRow}>
                        <Text style={[styles.gmpValue, { color: theme.colors.text }]}>{displayData.currentGmp}</Text>

                    </View>
                </View>
                {/* Visual */}
                <View style={styles.gmpChart}>
                    <View style={[styles.bar, { height: 10 }]} />
                    <View style={[styles.bar, { height: 20 }]} />
                    <View style={[styles.bar, { height: 25, backgroundColor: theme.colors.primary }]} />
                </View>
            </View>

            <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Issue Details</Text>
            <View style={styles.grid}>
                <View style={[styles.detailCard, { marginRight: 8, backgroundColor: theme.colors.surfaceHighlight }]}>
                    <Ionicons name="cash-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>PRICE BAND</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{displayData.priceBand}</Text>
                </View>
                <View style={[styles.detailCard, { marginLeft: 8, backgroundColor: theme.colors.surfaceHighlight }]}>
                    <Ionicons name="cube-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>LOT SIZE</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{displayData.lotSize}</Text>
                </View>
            </View>
            <View style={[styles.grid, { marginTop: 16 }]}>
                <View style={[styles.detailCard, { marginRight: 8, backgroundColor: theme.colors.surfaceHighlight }]}>
                    <Ionicons name="wallet-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>MIN INVESTMENT</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{displayData.minInvest}</Text>
                </View>
                <View style={[styles.detailCard, { marginLeft: 8, backgroundColor: theme.colors.surfaceHighlight }]}>
                    <Ionicons name="pie-chart-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>ISSUE SIZE</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{displayData.issueSize}</Text>
                </View>
            </View>

            {/* Offer Structure */}
            {Object.keys(displayData.ipoDetailsMap).length > 0 && (
                <View style={{ marginTop: 24 }}>
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Offer Structure</Text>
                    <View style={[styles.infoCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                        {Object.entries(displayData.ipoDetailsMap).map(([key, value], index) => (
                            <View key={index} style={[styles.infoRow, { borderBottomWidth: index === Object.keys(displayData.ipoDetailsMap).length - 1 ? 0 : 1, borderBottomColor: theme.colors.border }]}>
                                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>{key}</Text>
                                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{value}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Lot Size Distribution */}
            {displayData.lotDistribution.length > 0 && (
                <View style={{ marginTop: 24 }}>
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Lot Size & Investment</Text>
                    <View style={[styles.tableCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                        <View style={[styles.tableHeader, { borderBottomColor: theme.colors.border }]}>
                            <Text style={[styles.tableHeadText, { flex: 1.5, color: theme.colors.textSecondary }]}>Category</Text>
                            <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'center', color: theme.colors.textSecondary }]}>Lot(s)</Text>
                            <Text style={[styles.tableHeadText, { flex: 1.5, textAlign: 'right', color: theme.colors.textSecondary }]}>Amount</Text>
                        </View>
                        {displayData.lotDistribution.map((item, index) => (
                            <View key={index} style={[styles.tableRow, { borderBottomColor: theme.colors.border }]}>
                                <Text style={[styles.tableCell, { flex: 1.5, color: theme.colors.text }]}>{item.Category}</Text>
                                <Text style={[styles.tableCell, { flex: 1, textAlign: 'center', color: theme.colors.text }]}>{item['Lot(s)']}</Text>
                                <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'right', color: theme.colors.text }]}>₹{parseInt(item.Amount).toLocaleString('en-IN')}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Reservation */}
            {displayData.reservation.length > 0 && (
                <View style={{ marginTop: 24 }}>
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Quota Reservation</Text>
                    <View style={[styles.tableCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                        <View style={[styles.tableHeader, { borderBottomColor: theme.colors.border }]}>
                            <Text style={[styles.tableHeadText, { flex: 2, color: theme.colors.textSecondary }]}>Category</Text>
                            <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right', color: theme.colors.textSecondary }]}>Shares</Text>
                            <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right', color: theme.colors.textSecondary }]}>%</Text>
                        </View>
                        {displayData.reservation.map((item, index) => (
                            <View key={index} style={[styles.tableRow, { borderBottomColor: theme.colors.border }]}>
                                <Text style={[styles.tableCell, { flex: 2, color: theme.colors.text }]}>{item.Category}</Text>
                                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', color: theme.colors.text }]}>{parseInt(item['Shares Offered']).toLocaleString('en-IN')}</Text>
                                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', color: theme.colors.primary, fontWeight: 'bold' }]}>{item['%']}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Documents */}
            {details?.documents && details.documents.length > 0 && (
                <View style={{ marginTop: 24 }}>
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Documents</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {details.documents.map((doc, index) => (
                            <TouchableOpacity key={index} style={[styles.docButton, { borderColor: theme.colors.primary }]} onPress={() => openLink(doc.url, doc.title)}>
                                <Ionicons name="document-text" size={16} color={theme.colors.primary} />
                                <Text style={[styles.docButtonText, { color: theme.colors.primary }]}>{doc.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Subscription */}
            <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
                <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Subscription Status</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : details?.subscription && details.subscription.length > 0 ? (
                <View style={[styles.subscriptionContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeadText, { flex: 2, color: theme.colors.textSecondary }]}>Category</Text>
                        <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right', color: theme.colors.textSecondary }]}>Times</Text>
                        {displayData.applicationBreakup.length > 0 && <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right', color: theme.colors.textSecondary }]}>Apps</Text>}
                    </View>
                    {details.subscription.map((item, index) => {
                        // Try to find matching app data if available
                        const appData = displayData.applicationBreakup.find(
                            a => a.Category.toLowerCase().includes(item.Category.toLowerCase().replace('s', '')) // loose matching
                        );
                        return (
                            <View key={index} style={[styles.tableRow, { borderBottomColor: theme.colors.border }]}>
                                <Text style={[styles.tableCell, { flex: 2, color: theme.colors.text }]}>{item.Category}</Text>
                                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', color: theme.colors.success, fontWeight: 'bold' }]}>{item.Times}x</Text>
                                {displayData.applicationBreakup.length > 0 && (
                                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', color: theme.colors.text }]}>
                                        {appData ? parseInt(appData.Applied).toLocaleString('en-IN') : '-'}
                                    </Text>
                                )}
                            </View>
                        );
                    })}
                </View>
            ) : (
                <Text style={{ color: theme.colors.textSecondary, fontStyle: 'italic' }}>Subscription data not available yet.</Text>
            )}

            {/* Timeline */}
            <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.colors.text }]}>Timeline</Text>
            <View style={[styles.timelineContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                {displayData.timeline.map((item, index) => (
                    <View key={index} style={styles.timelineItem}>
                        <View style={styles.timelineLeft}>
                            <View style={[
                                styles.timelineIconBox,
                                { backgroundColor: theme.colors.surface, borderColor: theme.colors.textSecondary },
                                item.active && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                            ]}>
                                <Ionicons name={item.icon as any} size={20} color={item.active ? theme.colors.background : theme.colors.textSecondary} />
                            </View>
                            {index < displayData.timeline.length - 1 && <View style={[styles.timelineLine, { backgroundColor: theme.colors.textSecondary }]} />}
                        </View>
                        <View style={styles.timelineContent}>
                            <Text style={[styles.timelineTitle, { color: theme.colors.text }]}>{item.title}</Text>
                            <Text style={[styles.timelineDate, { color: theme.colors.textSecondary }]}>{item.date}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* KPIs or Financials */}
            {details?.kpi && details.kpi.length > 0 && (
                <>
                    <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.colors.text }]}>Key Performance Indicators</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={[styles.kpiCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                            {/* Header Row */}
                            <View style={[styles.tableRow, { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
                                <Text style={[styles.kpiHead, { width: 100, color: theme.colors.textSecondary }]}>Metric</Text>
                                {Object.keys(details.kpi[0]).filter(k => k !== 'kpi').map((key, i) => (
                                    <Text key={i} style={[styles.kpiHead, { width: 80, color: theme.colors.textSecondary, textAlign: 'right' }]}>{key}</Text>
                                ))}
                            </View>
                            {/* Data Rows */}
                            {details.kpi.map((row, index) => (
                                <View key={index} style={[styles.tableRow, { borderBottomWidth: index === details.kpi.length - 1 ? 0 : 1, borderBottomColor: theme.colors.border }]}>
                                    <Text style={[styles.kpiCell, { width: 100, color: theme.colors.text, fontWeight: 'bold' }]}>{row.kpi}</Text>
                                    {Object.keys(row).filter(k => k !== 'kpi').map((key, i) => (
                                        <Text key={i} style={[styles.kpiCell, { width: 80, color: theme.colors.text, textAlign: 'right' }]}>{row[key]}</Text>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </>
            )}

            {/* About */}
            <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.colors.text }]}>About {companyName}</Text>
            <View style={[styles.aboutCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>
                    {details?.about_company || 'Company information is being updated.'}
                </Text>
            </View>

            {/* Lead Managers */}
            {displayData.leadManagers.length > 0 && (
                <View style={{ marginTop: 24 }}>
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Lead Managers</Text>
                    <View style={[styles.infoCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                        {displayData.leadManagers.map((mgr, index) => (
                            <View key={index} style={[styles.infoRow, { borderBottomWidth: index === displayData.leadManagers.length - 1 ? 0 : 1, borderBottomColor: theme.colors.border }]}>
                                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{mgr.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Address */}
            {displayData.address ? (
                <View style={{ marginTop: 24 }}>
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Company Address</Text>
                    <View style={[styles.aboutCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                        <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>{displayData.address}</Text>
                    </View>
                </View>
            ) : null}

            {/* Address / Registrar */}
            {details?.registrar && (
                <View style={{ marginTop: 24 }}>
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Registrar</Text>
                    <View style={[styles.aboutCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                        <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>{details.registrar}</Text>
                    </View>
                </View>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: defaultTheme.colors.background, padding: defaultTheme.spacing.md },
    topCard: {
        flexDirection: 'row',
        backgroundColor: defaultTheme.colors.surfaceHighlight,
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
    logoImage: {
        width: 50,
        height: 50,
        borderRadius: 4,
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
        backgroundColor: defaultTheme.colors.surfaceHighlight,
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
        backgroundColor: defaultTheme.colors.surfaceHighlight,
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
        backgroundColor: defaultTheme.colors.surfaceHighlight,
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
        backgroundColor: defaultTheme.colors.surfaceHighlight,
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
        backgroundColor: defaultTheme.colors.surfaceHighlight,
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
    },
    docButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
        marginBottom: 8,
    },
    docButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
    tableHeader: {
        flexDirection: 'row',
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        marginBottom: 8,
    },
    tableHeadText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        alignItems: 'center',
    },
    tableCell: {
        fontSize: 14,
    },
    kpiCard: {
        borderRadius: 12,
        padding: 16,
        minWidth: '100%',
    },
    kpiHead: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    kpiCell: {
        fontSize: 12,
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    infoCard: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    infoLabel: {
        fontSize: 14,
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right',
        flex: 1,
    },
    tableCard: {
        borderRadius: 12,
        padding: 16,
    }
});
