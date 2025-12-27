import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOOfferDetailsProps {
    ipoDetailsMap: any;
}

const IPOOfferDetails: React.FC<IPOOfferDetailsProps> = ({ ipoDetailsMap }) => {
    const { theme } = useTheme();

    if (Object.keys(ipoDetailsMap).length === 0) return null;

    return (
        <View style={{ marginTop: 24 }}>
            <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Offer Structure</Text>
            <View style={[styles.infoCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                {Object.entries(ipoDetailsMap).map(([key, value], index) => (
                    <View key={index} style={[styles.infoRow, { borderBottomWidth: index === Object.keys(ipoDetailsMap).length - 1 ? 0 : 1, borderBottomColor: theme.colors.border }]}>
                        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>{key}</Text>
                        <Text style={[styles.infoValue, { color: theme.colors.text }]}>{String(value)}</Text>
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
    infoCard: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: defaultTheme.colors.border,
    },
    infoLabel: {
        color: defaultTheme.colors.textSecondary,
        fontSize: 14,
    },
    infoValue: {
        color: defaultTheme.colors.text,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'right',
        maxWidth: '60%',
    },
});

export default IPOOfferDetails;
