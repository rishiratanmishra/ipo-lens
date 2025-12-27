import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOGMPCardProps {
    gmpValue: number;
    estData: {
        upperPrice: number;
        percentage: string;
        estPrice: number;
    };
}

const IPOGMPCard: React.FC<IPOGMPCardProps> = ({ gmpValue, estData }) => {
    const { theme } = useTheme();

    let color = theme.colors.textSecondary;
    let sign = '';
    let badgeBg = theme.colors.surfaceHighlight;

    if (gmpValue > 0) {
        color = theme.colors.success;
        sign = '+';
        badgeBg = 'rgba(16, 185, 129, 0.1)';
    } else if (gmpValue < 0) {
        color = theme.colors.error;
        sign = ''; // Minus added manually
        badgeBg = 'rgba(239, 68, 68, 0.1)';
    }

    return (
        <View style={[styles.gmpCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.leftContent}>
                <Text style={[styles.cardLabel, { color: theme.colors.textSecondary }]}>EXPECTED GMP</Text>

                <View style={styles.gmpRow}>
                    <Text style={[styles.gmpValue, { color: color }]}>
                        {gmpValue < 0 ? '-' : ''}₹{Math.abs(gmpValue)}
                    </Text>
                    {estData.upperPrice > 0 && (
                        <View style={[styles.percentBadge, { backgroundColor: badgeBg }]}>
                            <Text style={[styles.percentText, { color: color }]}>
                                {sign}{estData.percentage}%
                            </Text>
                        </View>
                    )}
                </View>

                {estData.estPrice > 0 && (
                    <View style={[styles.estContainer, { backgroundColor: theme.colors.surfaceHighlight, borderLeftColor: color }]}>
                        <Text style={[styles.estLabel, { color: theme.colors.textSecondary }]}>Est. Listing</Text>
                        <Text style={[styles.estValue, { color: theme.colors.text }]}>₹{estData.estPrice}</Text>
                    </View>
                )}
            </View>

            <View style={styles.rightContent}>
                <View style={styles.gmpChart}>
                    <View style={[styles.bar, { height: 12, backgroundColor: theme.colors.border }]} />
                    <View style={[styles.bar, { height: 20, backgroundColor: theme.colors.textSecondary }]} />
                    <View style={[styles.bar, { height: 28, backgroundColor: color }]} />
                </View>
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
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: defaultTheme.colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    leftContent: {
        flex: 1,
    },
    rightContent: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingLeft: 16,
    },
    cardLabel: {
        color: defaultTheme.colors.textSecondary,
        fontSize: 11,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: '600',
    },
    gmpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    gmpValue: {
        fontSize: 26,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },
    percentBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    percentText: {
        fontSize: 13,
        fontWeight: '700',
    },
    estContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        alignSelf: 'flex-start',
        gap: 8,
    },
    estLabel: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    estValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    gmpChart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 6,
        height: 40,
    },
    bar: {
        width: 8,
        borderRadius: 4,
    },
});

export default IPOGMPCard;
