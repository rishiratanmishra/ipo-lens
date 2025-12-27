import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOIssueDetailsProps {
    priceBand: string;
    lotSize: string;
    minInvest: string;
    issueSize: string;
}

const IPOIssueDetails: React.FC<IPOIssueDetailsProps> = ({ priceBand, lotSize, minInvest, issueSize }) => {
    const { theme } = useTheme();

    return (
        <View>
            <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Issue Details</Text>
            <View style={styles.grid}>
                <View style={[styles.detailCard, { marginRight: 8, backgroundColor: theme.colors.surfaceHighlight }]}>
                    <Ionicons name="cash-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>PRICE BAND</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{priceBand}</Text>
                </View>
                <View style={[styles.detailCard, { marginLeft: 8, backgroundColor: theme.colors.surfaceHighlight }]}>
                    <Ionicons name="cube-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>LOT SIZE</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{lotSize}</Text>
                </View>
            </View>
            <View style={[styles.grid, { marginTop: 16 }]}>
                <View style={[styles.detailCard, { marginRight: 8, backgroundColor: theme.colors.surfaceHighlight }]}>
                    <Ionicons name="wallet-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>MIN INVESTMENT</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{minInvest}</Text>
                </View>
                <View style={[styles.detailCard, { marginLeft: 8, backgroundColor: theme.colors.surfaceHighlight }]}>
                    <Ionicons name="pie-chart-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>ISSUE SIZE</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{issueSize}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
        marginBottom: 12,
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
});

export default IPOIssueDetails;
