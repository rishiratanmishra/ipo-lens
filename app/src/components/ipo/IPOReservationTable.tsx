import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOReservationTableProps {
    reservation: any[];
}

const IPOReservationTable: React.FC<IPOReservationTableProps> = ({ reservation }) => {
    const { theme } = useTheme();

    if (!reservation || reservation.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    <MaterialCommunityIcons name="chart-pie" size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Quota Reservation</Text>
            </View>

            <LinearGradient
                colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.tableCard, { borderColor: theme.colors.border }]}
            >
                <View style={styles.tableWrapper}>
                    {/* Sticky Column Container */}
                    <View style={styles.stickyColumnContainer}>
                        {/* Sticky Header */}
                        <View style={[styles.stickyHeaderCell, { borderBottomColor: theme.colors.border, borderBottomWidth: 1 }]}>
                            <Text style={[styles.tableHeadText, { color: theme.colors.textSecondary }]}>CATEGORY</Text>
                        </View>

                        {/* Sticky Column Data */}
                        {reservation.map((item, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.stickyDataCell,
                                    {
                                        borderBottomColor: theme.colors.border,
                                        borderBottomWidth: index === reservation.length - 1 ? 0 : 1
                                    }
                                ]}
                            >
                                <Text style={[styles.categoryText, { color: theme.colors.text }]} numberOfLines={1}>
                                    {item.Category}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Scrollable Content Container */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.scrollableSection}
                    >
                        <View>
                            {/* Scrollable Headers */}
                            <View style={styles.scrollableHeaderRow}>
                                <View style={[styles.headerCell, { borderBottomColor: theme.colors.border, borderBottomWidth: 1 }]}>
                                    <Text style={[styles.tableHeadText, { color: theme.colors.textSecondary }]}>SHARES</Text>
                                </View>
                                <View style={[styles.headerCell, { borderBottomColor: theme.colors.border, borderBottomWidth: 1 }]}>
                                    <Text style={[styles.tableHeadText, { color: theme.colors.textSecondary }]}>ALLOCATION</Text>
                                </View>
                            </View>

                            {/* Scrollable Data Rows */}
                            {reservation.map((item, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.scrollableDataRow,
                                        {
                                            borderBottomColor: theme.colors.border,
                                            borderBottomWidth: index === reservation.length - 1 ? 0 : 1
                                        }
                                    ]}
                                >
                                    <View style={styles.dataCell}>
                                        <Text style={[styles.sharesText, { color: theme.colors.text }]}>
                                            {parseInt(item['Shares Offered']).toLocaleString('en-IN')}
                                        </Text>
                                    </View>
                                    <View style={styles.dataCell}>
                                        <View style={[styles.badge, { backgroundColor: theme.colors.surfaceHighlight }]}>
                                            <Text style={[styles.percentageText, { color: theme.colors.primary }]}>{item['%']}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
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
    tableWrapper: {
        flexDirection: 'row',
    },
    stickyColumnContainer: {
        width: 100,
    },  
    stickyHeaderCell: {
        paddingBottom: 12,
        marginBottom: 8,
        justifyContent: 'center',
    },
    stickyDataCell: {
        paddingVertical: 14,
        paddingRight: 12,
        justifyContent: 'center',
    },
    scrollableSection: {
        flex: 1,
    },
    scrollableHeaderRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    scrollableDataRow: {
        flexDirection: 'row',
        paddingVertical: 14,
        alignItems: 'center',
    },
    tableHeadText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
    },
    headerCell: {
        width: 120,
        paddingBottom: 12,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dataCell: {
        width: 120,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    sharesText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    percentageText: {
        fontSize: 13,
        fontWeight: '700',
    },
});

export default IPOReservationTable;

