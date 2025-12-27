import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOOfferDetailsProps {
    ipoDetailsMap: Record<string, any>;
}

const IPOOfferDetails: React.FC<IPOOfferDetailsProps> = ({ ipoDetailsMap }) => {
    const { theme } = useTheme();

    if (!ipoDetailsMap || Object.keys(ipoDetailsMap).length === 0) return null;

    const detailsArray = Object.entries(ipoDetailsMap);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    <MaterialCommunityIcons name="finance" size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Offer Structure</Text>
            </View>

            <View style={styles.gridContainer}>
                {detailsArray.map(([key, value], index) => (
                    <LinearGradient
                        key={index}
                        colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                            styles.card,
                            {
                                borderColor: theme.colors.border,
                                // Add margin bottom to all items
                                marginBottom: 12,
                                // Add margin right to even items (0, 2, 4...) for spacing in 2-col grid
                                marginRight: index % 2 === 0 ? '4%' : 0
                            }
                        ]}
                    >
                        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>{key}</Text>
                        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                            {String(value)}
                        </Text>

                        {/* decorative corner accent */}
                        <View style={[styles.cornerAccent, { backgroundColor: theme.colors.primary, opacity: 0.1 }]} />
                    </LinearGradient>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingHorizontal: 4, // Prevent shadow clipping
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
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
    card: {
        width: '48%', // 2 columns with 4% gap
        minHeight: 110, // Ensure uniform height for visual balance
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        // Shadow for elevation
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        position: 'relative',
        overflow: 'hidden',
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
        opacity: 0.8,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    cornerAccent: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 60,
        height: 60,
        borderRadius: 30,
    }
});

export default IPOOfferDetails;
