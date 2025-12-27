import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
                <LinearGradient
                    colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.detailCard, { marginRight: 8, borderColor: theme.colors.border }]}
                >
                    <Ionicons name="cash-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>PRICE BAND</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{priceBand}</Text>
                    <View style={[styles.cornerAccent, { backgroundColor: theme.colors.primary, opacity: 0.1 }]} />
                </LinearGradient>
                <LinearGradient
                    colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.detailCard, { marginLeft: 8, borderColor: theme.colors.border }]}
                >
                    <Ionicons name="cube-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>LOT SIZE</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{lotSize}</Text>
                    <View style={[styles.cornerAccent, { backgroundColor: theme.colors.primary, opacity: 0.1 }]} />
                </LinearGradient>
            </View>
            <View style={[styles.grid, { marginTop: 16 }]}>
                <LinearGradient
                    colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.detailCard, { marginRight: 8, borderColor: theme.colors.border }]}
                >
                    <Ionicons name="wallet-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>MIN INVESTMENT</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{minInvest}</Text>
                    <View style={[styles.cornerAccent, { backgroundColor: theme.colors.primary, opacity: 0.1 }]} />
                </LinearGradient>
                <LinearGradient
                    colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.detailCard, { marginLeft: 8, borderColor: theme.colors.border }]}
                >
                    <Ionicons name="pie-chart-outline" size={20} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>ISSUE SIZE</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>{issueSize}</Text>
                    <View style={[styles.cornerAccent, { backgroundColor: theme.colors.primary, opacity: 0.1 }]} />
                </LinearGradient>
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
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        position: 'relative',
        overflow: 'hidden',
    },
    detailIcon: {
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
        opacity: 0.8,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    cornerAccent: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 60,
        height: 60,
        borderRadius: 30,
    }
});

export default IPOIssueDetails;
