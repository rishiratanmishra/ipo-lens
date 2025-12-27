import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOKPIsProps {
    kpi: any[];
    peerValuation?: any[];
    peerFinancials?: any[];
}

type ViewMode = 'card' | 'table';

const IPOKPIs: React.FC<IPOKPIsProps> = ({ kpi, peerValuation, peerFinancials }) => {
    const { theme } = useTheme();
    const [peerViewMode, setPeerViewMode] = useState<ViewMode>('card');

    // Check if we have any data to show
    const hasKpi = kpi && kpi.length > 0;
    const hasPeer = peerValuation && peerValuation.length > 0;

    if (!hasKpi && !hasPeer) return null;

    // Helper to render a table with sticky first column
    const renderTable = (data: any[], title: string, keyPropName: string = 'kpi', showToggle: boolean = false) => {
        if (!data || data.length === 0) return null;

        // Dynamic keys excluding the Label Key
        const columns = Object.keys(data[0]).filter(k => k !== keyPropName);

        return (
            <View style={{ marginBottom: 24 }}>
                <View style={styles.subHeaderContainer}>
                    <Text style={[styles.subHeader, { color: theme.colors.textSecondary }]}>{title}</Text>
                    {showToggle && (
                        <View style={styles.viewToggleContainer}>
                            <TouchableOpacity
                                onPress={() => setPeerViewMode('table')}
                                style={[
                                    styles.toggleButton,
                                    peerViewMode === 'table' && styles.toggleButtonActive,
                                    {
                                        backgroundColor: peerViewMode === 'table' ? theme.colors.primary : 'transparent',
                                        borderColor: theme.colors.border
                                    }
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name="view-list"
                                    size={16}
                                    color={peerViewMode === 'table' ? '#fff' : theme.colors.textSecondary}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPeerViewMode('card')}
                                style={[
                                    styles.toggleButton,
                                    peerViewMode === 'card' && styles.toggleButtonActive,
                                    {
                                        backgroundColor: peerViewMode === 'card' ? theme.colors.primary : 'transparent',
                                        borderColor: theme.colors.border
                                    }
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name="view-grid"
                                    size={16}
                                    color={peerViewMode === 'card' ? '#fff' : theme.colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
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
                                <Text style={[styles.tableHeadText, { color: theme.colors.textSecondary }]}>
                                    {keyPropName.toUpperCase()}
                                </Text>
                            </View>

                            {/* Sticky Column Data */}
                            {data.map((row, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.stickyDataCell,
                                        {
                                            borderBottomColor: theme.colors.border,
                                            borderBottomWidth: index === data.length - 1 ? 0 : 1
                                        }
                                    ]}
                                >
                                    <Text style={[styles.labelText, { color: theme.colors.text }]} numberOfLines={2}>
                                        {row[keyPropName] || row['Company'] || 'Metric'}
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
                                    {columns.map((key, i) => (
                                        <View key={i} style={[styles.headerCell, { borderBottomColor: theme.colors.border, borderBottomWidth: 1 }]}>
                                            <Text style={[styles.tableHeadText, { color: theme.colors.textSecondary }]}>
                                                {key.toUpperCase()}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Scrollable Data Rows */}
                                {data.map((row, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.scrollableDataRow,
                                            {
                                                borderBottomColor: theme.colors.border,
                                                borderBottomWidth: index === data.length - 1 ? 0 : 1
                                            }
                                        ]}
                                    >
                                        {columns.map((key, i) => (
                                            <View key={i} style={styles.dataCell}>
                                                <Text style={[styles.valueText, { color: theme.colors.text }]}>
                                                    {row[key] || row[key] === 0 ? row[key] : '-'}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </LinearGradient>
            </View>
        );
    };

    // Helper to render peer comparison table without sticky column
    const renderPeerTable = (data: any[], title: string) => {
        if (!data || data.length === 0) return null;

        // All columns including Company
        const allColumns = Object.keys(data[0]);

        return (
            <View style={{ marginBottom: 24 }}>
                <View style={styles.subHeaderContainer}>
                    <Text style={[styles.subHeader, { color: theme.colors.textSecondary }]}>{title}</Text>
                    <View style={styles.viewToggleContainer}>
                        <TouchableOpacity
                            onPress={() => setPeerViewMode('table')}
                            style={[
                                styles.toggleButton,
                                peerViewMode === 'table' && styles.toggleButtonActive,
                                {
                                    backgroundColor: peerViewMode === 'table' ? theme.colors.primary : 'transparent',
                                    borderColor: theme.colors.border
                                }
                            ]}
                        >
                            <MaterialCommunityIcons
                                name="view-list"
                                size={16}
                                color={peerViewMode === 'table' ? '#fff' : theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setPeerViewMode('card')}
                            style={[
                                styles.toggleButton,
                                peerViewMode === 'card' && styles.toggleButtonActive,
                                {
                                    backgroundColor: peerViewMode === 'card' ? theme.colors.primary : 'transparent',
                                    borderColor: theme.colors.border
                                }
                            ]}
                        >
                            <MaterialCommunityIcons
                                name="view-grid"
                                size={16}
                                color={peerViewMode === 'card' ? '#fff' : theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <LinearGradient
                    colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.tableCard, { borderColor: theme.colors.border }]}
                >
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <View>
                            {/* Headers */}
                            <View style={styles.scrollableHeaderRow}>
                                {allColumns.map((key, i) => (
                                    <View key={i} style={[styles.peerHeaderCell, { borderBottomColor: theme.colors.border, borderBottomWidth: 1 }]}>
                                        <Text style={[styles.tableHeadText, { color: theme.colors.textSecondary }]}>
                                            {key.toUpperCase()}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            {/* Data Rows */}
                            {data.map((row, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.scrollableDataRow,
                                        {
                                            borderBottomColor: theme.colors.border,
                                            borderBottomWidth: index === data.length - 1 ? 0 : 1
                                        }
                                    ]}
                                >
                                    {allColumns.map((key, i) => (
                                        <View key={i} style={styles.peerDataCell}>
                                            <Text
                                                style={[
                                                    i === 0 ? styles.peerCompanyText : styles.valueText,
                                                    { color: theme.colors.text }
                                                ]}
                                                numberOfLines={i === 0 ? 2 : 1}
                                            >
                                                {row[key] || row[key] === 0 ? row[key] : '-'}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </LinearGradient>
            </View>
        );
    };

    // Helper to render peer comparison as cards
    const renderPeerCards = (data: any[], title: string, keyPropName: string = 'Company') => {
        if (!data || data.length === 0) return null;

        // Dynamic keys excluding the Company name
        const metrics = Object.keys(data[0]).filter(k => k !== keyPropName);

        return (
            <View style={{ marginBottom: 24 }}>
                <View style={styles.subHeaderContainer}>
                    <Text style={[styles.subHeader, { color: theme.colors.textSecondary }]}>{title}</Text>
                    <View style={styles.viewToggleContainer}>
                        <TouchableOpacity
                            onPress={() => setPeerViewMode('table')}
                            style={[
                                styles.toggleButton,
                                peerViewMode === 'table' && styles.toggleButtonActive,
                                {
                                    backgroundColor: peerViewMode === 'table' ? theme.colors.primary : 'transparent',
                                    borderColor: theme.colors.border
                                }
                            ]}
                        >
                            <MaterialCommunityIcons
                                name="view-list"
                                size={16}
                                color={peerViewMode === 'table' ? '#fff' : theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setPeerViewMode('card')}
                            style={[
                                styles.toggleButton,
                                peerViewMode === 'card' && styles.toggleButtonActive,
                                {
                                    backgroundColor: peerViewMode === 'card' ? theme.colors.primary : 'transparent',
                                    borderColor: theme.colors.border
                                }
                            ]}
                        >
                            <MaterialCommunityIcons
                                name="view-grid"
                                size={16}
                                color={peerViewMode === 'card' ? '#fff' : theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.cardsContainer}
                >
                    {data.map((company, index) => (
                        <LinearGradient
                            key={index}
                            colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.peerCard, { borderColor: theme.colors.border }]}
                        >


                            {/* Metrics */}
                            <View style={styles.metricsContainer}>
                                {metrics.map((metric, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.metricRow,
                                            {
                                                borderBottomColor: theme.colors.border,
                                                borderBottomWidth: i === metrics.length - 1 ? 0 : 1
                                            }
                                        ]}
                                    >
                                        <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                                            {metric}
                                        </Text>
                                        <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                                            {company[metric] || company[metric] === 0 ? company[metric] : '-'}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </LinearGradient>
                    ))}
                </ScrollView>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    <MaterialCommunityIcons name="google-analytics" size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Financials & Valuation</Text>
            </View>

            {renderTable(kpi, "Key Performance Indicators", "kpi")}
            {peerViewMode === 'card'
                ? renderPeerCards(peerValuation, "Peer Comparison", "Company")
                : renderPeerTable(peerValuation, "Peer Comparison")
            }
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
    subHeader: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    subHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        marginLeft: 4,
    },
    viewToggleContainer: {
        flexDirection: 'row',
        gap: 8,
        marginRight: 4,
    },
    toggleButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    toggleButtonActive: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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
        width: 140,
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
        width: 100,
        paddingBottom: 12,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dataCell: {
        width: 100,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    valueText: {
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
    },
    // Peer table specific styles
    peerHeaderCell: {
        width: 120,
        paddingBottom: 12,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    peerDataCell: {
        width: 120,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    peerCompanyText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'left',
    },
    // Card-based peer comparison styles
    cardsContainer: {
        paddingRight: 16,
        gap: 12,
    },
    peerCard: {
        width: 220,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        marginRight: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 12,
        marginBottom: 12,
        borderBottomWidth: 1,
        gap: 8,
    },
    companyName: {
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
    },
    metricsContainer: {
        gap: 2,
    },
    metricRow: {
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    metricLabel: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 15,
        fontWeight: '700',
    },
});

export default IPOKPIs;
