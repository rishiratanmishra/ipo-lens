import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOKPIsProps {
    kpi: any[];
    peerValuation?: any[];
    peerFinancials?: any[];
}

const IPOKPIs: React.FC<IPOKPIsProps> = ({ kpi, peerValuation, peerFinancials }) => {
    const { theme } = useTheme();

    // Check if we have any data to show
    const hasKpi = kpi && kpi.length > 0;
    const hasPeer = peerValuation && peerValuation.length > 0;

    if (!hasKpi && !hasPeer) return null;

    // Helper to render a table
    const renderTable = (data: any[], title: string, keyPropName: string = 'kpi') => {
        if (!data || data.length === 0) return null;

        // Dynamic keys excluding the Label Key
        const columns = Object.keys(data[0]).filter(k => k !== keyPropName);

        return (
            <View style={{ marginBottom: 24 }}>
                <Text style={[styles.subHeader, { color: theme.colors.textSecondary }]}>{title}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <LinearGradient
                        colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.kpiCard, { borderColor: theme.colors.border }]}
                    >
                        {/* Header Row */}
                        <View style={[styles.tableRow, { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
                            <Text style={[styles.kpiHead, { width: 120, color: theme.colors.textSecondary }]}>
                                {keyPropName.toUpperCase()}
                            </Text>
                            {columns.map((key, i) => (
                                <Text key={i} style={[styles.kpiHead, { width: 100, color: theme.colors.textSecondary, textAlign: 'right' }]}>
                                    {key.toUpperCase()}
                                </Text>
                            ))}
                        </View>

                        {/* Data Rows */}
                        {data.map((row, index) => (
                            <View key={index} style={[styles.tableRow, {
                                borderBottomWidth: index === data.length - 1 ? 0 : 1,
                                borderBottomColor: theme.colors.border
                            }]}>
                                <Text style={[styles.kpiCell, { width: 120, color: theme.colors.text, fontWeight: 'bold' }]}>
                                    {row[keyPropName] || row['Company'] || 'Metric'}
                                </Text>
                                {columns.map((key, i) => (
                                    <Text key={i} style={[styles.kpiCell, { width: 100, color: theme.colors.text, textAlign: 'right' }]}>
                                        {row[key]}
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </LinearGradient>
                </ScrollView>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    <MaterialCommunityIcons name="google-analytics" size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Financials & Valuation</Text>
            </View>

            {renderTable(kpi, "Key Performance Indicators", "kpi")}
            {renderTable(peerValuation, "Peer Comparison", "Company")}
            {/* assuming 'Company' key for peers based on common patterns, fallback handled */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingHorizontal: 4,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    subHeader: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    kpiCard: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        minWidth: '100%',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        alignItems: 'center',
    },
    kpiHead: {
        fontSize: 11,
        fontWeight: '700',
        paddingVertical: 4,
        paddingHorizontal: 4,
        letterSpacing: 0.5,
    },
    kpiCell: {
        fontSize: 13,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
});

export default IPOKPIs;
