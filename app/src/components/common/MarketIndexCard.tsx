import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface MarketIndexCardProps {
    name: string;
    value: string;
    change: string;
    percentChange: string;
    isUp: boolean;
    isClosed?: boolean;
}

const MarketIndexCard: React.FC<MarketIndexCardProps> = ({ name, value, change, percentChange, isUp, isClosed }) => {
    const { theme } = useTheme();

    return (
        <LinearGradient
            colors={theme.gradients.darkCard}
            style={[styles.tickerCard, { borderColor: theme.colors.border, position: 'relative' }]}
        >
            <View>
                <Text style={[styles.tickerLabel, { color: theme.colors.textSecondary }]}>{name}</Text>
                <Text style={[styles.tickerValue, { color: theme.colors.text }]}>
                    {value || 'Loading...'}
                </Text>
            </View>
            <View style={[styles.trendBadge, { marginBottom: 25, backgroundColor: (isUp ? theme.colors.success : theme.colors.error) + '20' }]}>
                <Ionicons
                    name={isUp ? "arrow-up" : "arrow-down"}
                    size={12}
                    color={isUp ? theme.colors.success : theme.colors.error}
                />
                <Text style={{ fontSize: 10, color: isUp ? theme.colors.success : theme.colors.error, fontWeight: 'bold' }}>
                    {change} ({percentChange || '0.0%'})
                </Text>
            </View>
            {isClosed && (
                <View style={{ position: 'absolute', bottom: 8, right: 12 }}>
                    <Text style={{ fontSize: 8, color: theme.colors.error, fontWeight: '700', opacity: 0.8 }}>MARKET CLOSED</Text>
                </View>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    tickerCard: {
        padding: 12,
        borderRadius: 16,
        marginRight: 12,
        width: 'auto',
        minWidth: 140, // Added min-width to ensure consistency
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
    },
    tickerLabel: { fontSize: 10, fontWeight: '700', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
    tickerValue: { fontSize: 16, fontWeight: '700' },
    trendBadge: { flexDirection: 'row', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, alignItems: 'center', gap: 2 },
});

export default MarketIndexCard;
