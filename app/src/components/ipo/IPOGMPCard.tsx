import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOGMPCardProps {
    currentGmp: string;
}

const IPOGMPCard: React.FC<IPOGMPCardProps> = ({ currentGmp }) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.gmpCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View>
                <Text style={[styles.cardLabel, { color: theme.colors.textSecondary }]}>EXPECTED GMP</Text>
                <View style={styles.gmpRow}>
                    <Text style={[styles.gmpValue, { color: theme.colors.text }]}>{currentGmp}</Text>
                </View>
            </View>
            <View style={styles.gmpChart}>
                <View style={[styles.bar, { height: 10 }]} />
                <View style={[styles.bar, { height: 20 }]} />
                <View style={[styles.bar, { height: 25, backgroundColor: theme.colors.primary }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default IPOGMPCard;
