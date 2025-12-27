import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOKPIsProps {
    kpi: any[];
}

const IPOKPIs: React.FC<IPOKPIsProps> = ({ kpi }) => {
    const { theme } = useTheme();

    if (!kpi || kpi.length === 0) return null;

    return (
        <View style={{ marginTop: 24 }}>
            <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Key Performance Indicators</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[styles.kpiCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    {/* Header Row */}
                    <View style={[styles.tableRow, { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
                        <Text style={[styles.kpiHead, { width: 100, color: theme.colors.textSecondary }]}>Metric</Text>
                        {Object.keys(kpi[0]).filter(k => k !== 'kpi').map((key, i) => (
                            <Text key={i} style={[styles.kpiHead, { width: 80, color: theme.colors.textSecondary, textAlign: 'right' }]}>{key}</Text>
                        ))}
                    </View>
                    {/* Data Rows */}
                    {kpi.map((row, index) => (
                        <View key={index} style={[styles.tableRow, { borderBottomWidth: index === kpi.length - 1 ? 0 : 1, borderBottomColor: theme.colors.border }]}>
                            <Text style={[styles.kpiCell, { width: 100, color: theme.colors.text, fontWeight: 'bold' }]}>{row.kpi}</Text>
                            {Object.keys(row).filter(k => k !== 'kpi').map((key, i) => (
                                <Text key={i} style={[styles.kpiCell, { width: 80, color: theme.colors.text, textAlign: 'right' }]}>{row[key]}</Text>
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>
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
    kpiCard: {
        borderRadius: 12,
        padding: 16,
        minWidth: '100%',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        alignItems: 'center',
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
});

export default IPOKPIs;
