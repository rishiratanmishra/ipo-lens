import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOReservationTableProps {
    reservation: any[];
}

const IPOReservationTable: React.FC<IPOReservationTableProps> = ({ reservation }) => {
    const { theme } = useTheme();

    if (reservation.length === 0) return null;

    return (
        <View style={{ marginTop: 24 }}>
            <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Quota Reservation</Text>
            <View style={[styles.tableCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                <View style={[styles.tableHeader, { borderBottomColor: theme.colors.border }]}>
                    <Text style={[styles.tableHeadText, { flex: 2, color: theme.colors.textSecondary }]}>Category</Text>
                    <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right', color: theme.colors.textSecondary }]}>Shares</Text>
                    <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right', color: theme.colors.textSecondary }]}>%</Text>
                </View>
                {reservation.map((item, index) => (
                    <View key={index} style={[styles.tableRow, { borderBottomColor: theme.colors.border }]}>
                        <Text style={[styles.tableCell, { flex: 2, color: theme.colors.text }]}>{item.Category}</Text>
                        <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', color: theme.colors.text }]}>{parseInt(item['Shares Offered']).toLocaleString('en-IN')}</Text>
                        <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', color: theme.colors.primary, fontWeight: 'bold' }]}>{item['%']}</Text>
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

export default IPOReservationTable;
