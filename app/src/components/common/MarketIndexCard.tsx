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

const MarketIndexCard: React.FC<MarketIndexCardProps> = ({
    name,
    value,
    change,
    percentChange,
    isUp,
    isClosed,
}) => {
    const { theme } = useTheme();

    return (
        <LinearGradient
            colors={theme.gradients.darkCard}
            style={[styles.card, { borderColor: theme.colors.border }]}
        >
            {/* LEFT */}
            <View style={styles.left}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                    {name}
                </Text>

                <Text style={[styles.value, { color: theme.colors.text }]}>
                    {value || 'Loading...'}
                </Text>

                {isClosed && (
                    <Text style={[styles.closed, { color: theme.colors.error }]}>
                        MARKET CLOSED
                    </Text>
                )}
            </View>

            {/* RIGHT */}
            <View
                style={[
                    styles.changeBadge,
                    {
                        backgroundColor:
                            (isUp ? theme.colors.success : theme.colors.error) + '20',
                    },
                ]}
            >
                <Ionicons
                    name={isUp ? 'arrow-up' : 'arrow-down'}
                    size={12}
                    color={isUp ? theme.colors.success : theme.colors.error}
                />
                <Text
                    style={[
                        styles.changeText,
                        { color: isUp ? theme.colors.success : theme.colors.error },
                    ]}
                >
                    {change} {percentChange}
                </Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    card: {
        height: 72,
        minWidth: 150,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
        marginRight: 12,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    left: {
        justifyContent: 'center',
    },

    label: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },

    value: {
        fontSize: 17,
        fontWeight: '700',
        marginTop: 2,
    },

    closed: {
        fontSize: 9,
        fontWeight: '700',
        marginTop: 2,
        opacity: 0.75,
    },

    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
        marginLeft: 12,
    },

    changeText: {
        fontSize: 11,
        fontWeight: '700',
    },
});

export default MarketIndexCard;
