import React, { useLayoutEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { useIPODetails } from '../services/queries';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';

import IPOTopCard from '../components/ipo/IPOTopCard';
import IPOGMPCard from '../components/ipo/IPOGMPCard';
import IPOIssueDetails from '../components/ipo/IPOIssueDetails';
import IPOTimeline from '../components/ipo/IPOTimeline';
import IPOOfferDetails from '../components/ipo/IPOOfferDetails';
import IPOLotSizeTable from '../components/ipo/IPOLotSizeTable';
import IPOReservationTable from '../components/ipo/IPOReservationTable';
import IPODocuments from '../components/ipo/IPODocuments';
import IPOSubscription from '../components/ipo/IPOSubscription';
import IPOKPIs from '../components/ipo/IPOKPIs';
import IPOCompanyInfo from '../components/ipo/IPOCompanyInfo';

const { width } = Dimensions.get('window');

export default function IPODetailScreen({ navigation, route }) {
    const { ipo } = route.params || {};
    const { theme } = useTheme();

    // TanStack Query
    const {
        data: details = null,
        isLoading: loading,
        isRefetching,
        refetch
    } = useIPODetails(ipo?.id);

    const companyName = ipo?.name || details?.ipo_name || 'IPO Details';
    const tag = ipo?.is_sme ? 'SME IPO' : 'Mainboard IPO';

    const onRefresh = () => {
        refetch();
    };

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

            // Validating GMP and Est Price
            gmpValue: (() => {
                const gmpStr = ipo?.premium ? `${ipo.premium}` : (basic['GMP Rumors *'] || '0');
                return parseFloat(gmpStr.toString().replace(/[₹,]/g, '')) || 0;
            })(),

            estData: (() => {
                const priceBandStr = basic['Price'] || ipo?.price_band || '';
                const cleanStr = (s) => s ? s.toString().replace(/[₹,]/g, '').trim() : '';
                let upper = 0;
                if (priceBandStr) {
                    const parts = cleanStr(priceBandStr).split('-');
                    const last = parts[parts.length - 1];
                    upper = parseFloat(last) || 0;
                }

                const gmpStr = ipo?.premium ? `${ipo.premium}` : (basic['GMP Rumors *'] || '0');
                const gmpVal = parseFloat(cleanStr(gmpStr)) || 0;

                return {
                    upperPrice: upper,
                    percentage: upper > 0 ? ((gmpVal / upper) * 100).toFixed(1) : '0.0',
                    estPrice: upper > 0 ? (upper + gmpVal) : 0
                };
            })(),

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
            applicationBreakup: details?.application_breakup || [],

            // Added missing keys from user JSON
            subscriptionDemand: details?.subscription_demand || [],
            qibInterest: details?.qib_interest || [],
            peerValuation: details?.peer_valuation || [],
            peerFinancials: details?.peer_financials || [],
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
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={theme.colors.primary} />
            }
        >
            <IPOTopCard
                ipo={ipo}
                details={details}
                companyName={companyName}
                tag={tag}
                statusColor={statusColor}
            />

            <IPOGMPCard
                gmpValue={displayData.gmpValue}
                estData={displayData.estData}
            />

            <IPOIssueDetails
                priceBand={displayData.priceBand}
                lotSize={displayData.lotSize}
                minInvest={displayData.minInvest}
                issueSize={displayData.issueSize}
            />

            <IPOTimeline timeline={displayData.timeline} />

            <IPOOfferDetails ipoDetailsMap={displayData.ipoDetailsMap} />

            <IPOLotSizeTable lotDistribution={displayData.lotDistribution} />

            <IPOReservationTable reservation={displayData.reservation} />

            <IPODocuments documents={details?.documents} openLink={openLink} />

            <IPOSubscription
                loading={loading}
                subscription={details?.subscription}
                subscriptionDemand={displayData.subscriptionDemand}
                applicationBreakup={displayData.applicationBreakup}
            />

            <IPOKPIs
                kpi={details?.kpi}
                peerValuation={displayData.peerValuation}
                peerFinancials={displayData.peerFinancials}
            />

            <IPOCompanyInfo
                details={details}
                leadManagers={displayData.leadManagers}
                address={displayData.address}
                companyName={companyName}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: defaultTheme.colors.background, padding: defaultTheme.spacing.md },
});
