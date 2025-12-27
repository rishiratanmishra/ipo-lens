import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOLotSizeTableProps {
    lotDistribution: any[];
}

const IPOLotSizeTable: React.FC<IPOLotSizeTableProps> = ({ lotDistribution }) => {
    const { theme } = useTheme();

    if (lotDistribution.length === 0) return null;

    return (
        <View style={{ marginTop: 24 }}>
            <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Lot Size & Investment</Text>
            <View style={[styles.tableCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                <View style={[styles.tableHeader, { borderBottomColor: theme.colors.border }]}>
                    <Text style={[styles.tableHeadText, { flex: 1.5, color: theme.colors.textSecondary }]}>Category</Text>
                    <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'center', color: theme.colors.textSecondary }]}>Lot(s)</Text>
                    <Text style={[styles.tableHeadText, { flex: 1.5, textAlign: 'right', color: theme.colors.textSecondary }]}>Amount</Text>
                </View>
                {lotDistribution.map((item, index) => (
                    <View key={index} style={[styles.tableRow, { borderBottomColor: theme.colors.border }]}>
                        <Text style={[styles.tableCell, { flex: 1.5, color: theme.colors.text }]}>{item.Category}</Text>
                        <Text style={[styles.tableCell, { flex: 1, textAlign: 'center', color: theme.colors.text }]}>{item['Lot(s)']}</Text>
                        <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'right', color: theme.colors.text }]}>₹{parseInt(item.Amount).toLocaleString('en-IN')}</Text>
                    </View>
                ))}
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
    tableCard: {
        borderRadius: 12,
        padding: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingBottom: 8,
        borderBottomWidth: 1,
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

export default IPOLotSizeTable;
