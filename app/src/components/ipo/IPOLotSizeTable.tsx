import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOLotSizeTableProps {
    lotDistribution: any[];
}

const IPOLotSizeTable: React.FC<IPOLotSizeTableProps> = ({ lotDistribution }) => {
    const { theme } = useTheme();

    if (!lotDistribution || lotDistribution.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    <MaterialCommunityIcons name="clipboard-list-outline" size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Lot Size & Investment</Text>
            </View>

            <LinearGradient
                colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.tableCard, { borderColor: theme.colors.border }]}
            >
                {/* Table Header */}
                <View style={[styles.tableHeader, { borderBottomColor: theme.colors.border }]}>
                    <Text style={[styles.tableHeadText, { flex: 2, color: theme.colors.textSecondary }]}>CATEGORY</Text>
                    <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'center', color: theme.colors.textSecondary }]}>LOTS</Text>
                    <Text style={[styles.tableHeadText, { flex: 1.5, textAlign: 'right', color: theme.colors.textSecondary }]}>AMOUNT</Text>
                </View>

                {/* Table Body */}
                {lotDistribution.map((item, index) => (
                    <View
                        key={index}
                        style={[
                            styles.tableRow,
                            {
                                borderBottomColor: theme.colors.border,
                                borderBottomWidth: index === lotDistribution.length - 1 ? 0 : 1
                            }
                        ]}
                    >
                        <View style={{ flex: 2 }}>
                            <Text style={[styles.categoryText, { color: theme.colors.text }]}>
                                {item.Category}
                            </Text>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={[styles.badge, { backgroundColor: theme.colors.surfaceHighlight }]}>
                                <Text style={[styles.lotText, { color: theme.colors.text }]}>{item['Lot(s)']}</Text>
                            </View>
                        </View>

                        <Text style={[styles.amountText, { flex: 1.5, color: theme.colors.success }]}>
                            ₹{parseInt(item.Amount).toLocaleString('en-IN')}
                        </Text>
                    </View>
                ))}
            </LinearGradient>
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
    tableCard: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingBottom: 12,
        borderBottomWidth: 1,
        marginBottom: 8,
    },
    tableHeadText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 14,
        alignItems: 'center',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    shareText: {
        fontSize: 11,
        fontWeight: '500',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    lotText: {
        fontSize: 13,
        fontWeight: '700',
    },
    amountText: {
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'right',
        letterSpacing: 0.3,
    },
});

export default IPOLotSizeTable;
