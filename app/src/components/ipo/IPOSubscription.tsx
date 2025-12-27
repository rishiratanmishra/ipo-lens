import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOSubscriptionProps {
    loading: boolean;
    subscription: any[];
    applicationBreakup: any[];
}

const IPOSubscription: React.FC<IPOSubscriptionProps> = ({ loading, subscription, applicationBreakup }) => {
    const { theme } = useTheme();

    return (
        <View>
            <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
                <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Subscription Status</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : subscription && subscription.length > 0 ? (
                <View style={[styles.subscriptionContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeadText, { flex: 2, color: theme.colors.textSecondary }]}>Category</Text>
                        <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right', color: theme.colors.textSecondary }]}>Times</Text>
                        {applicationBreakup.length > 0 && <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right', color: theme.colors.textSecondary }]}>Apps</Text>}
                    </View>
                    {subscription.map((item, index) => {
                        const appData = applicationBreakup.find(
                            a => a.Category.toLowerCase().includes(item.Category.toLowerCase().replace('s', ''))
                        );
                        return (
                            <View key={index} style={[styles.tableRow, { borderBottomColor: theme.colors.border }]}>
                                <Text style={[styles.tableCell, { flex: 2, color: theme.colors.text }]}>{item.Category}</Text>
                                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', color: theme.colors.success, fontWeight: 'bold' }]}>{item.Times}x</Text>
                                {applicationBreakup.length > 0 && (
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
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    subscriptionContainer: {
        borderRadius: 12,
        padding: 16,
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
});

export default IPOSubscription;
