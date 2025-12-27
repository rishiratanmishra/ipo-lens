import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOOfferDetailsProps {
    ipoDetailsMap: Record<string, any>;
}

type ViewMode = 'table' | 'card';

const IPOOfferDetails: React.FC<IPOOfferDetailsProps> = ({ ipoDetailsMap }) => {
    const { theme } = useTheme();
    const [viewMode, setViewMode] = useState<ViewMode>('table');

    if (!ipoDetailsMap || Object.keys(ipoDetailsMap).length === 0) return null;

    const detailsArray = Object.entries(ipoDetailsMap);

    const renderTableView = () => (
        <LinearGradient
            colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.tableCard, { borderColor: theme.colors.border }]}
        >
            <View style={styles.tableWrapper}>
                {detailsArray.map(([key, value], index) => (
                    <View
                        key={index}
                        style={[
                            styles.tableRow,
                            {
                                borderBottomColor: theme.colors.border,
                                borderBottomWidth: index === detailsArray.length - 1 ? 0 : 1
                            }
                        ]}
                    >
                        <View style={styles.labelCell}>
                            <Text style={[styles.labelText, { color: theme.colors.textSecondary }]}>
                                {key}
                            </Text>
                        </View>
                        <View style={styles.valueCell}>
                            <Text style={[styles.valueText, { color: theme.colors.text }]}>
                                {String(value)}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </LinearGradient>
    );

    const renderCardView = () => (
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
                            marginBottom: 12,
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
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.leftHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                        <MaterialCommunityIcons name="finance" size={20} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Offer Structure</Text>
                </View>

                <View style={styles.viewToggleContainer}>
                    <TouchableOpacity
                        onPress={() => setViewMode('table')}
                        style={[
                            styles.toggleButton,
                            viewMode === 'table' && styles.toggleButtonActive,
                            {
                                backgroundColor: viewMode === 'table' ? theme.colors.primary : 'transparent',
                                borderColor: theme.colors.border
                            }
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="view-list"
                            size={18}
                            color={viewMode === 'table' ? '#fff' : theme.colors.textSecondary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setViewMode('card')}
                        style={[
                            styles.toggleButton,
                            viewMode === 'card' && styles.toggleButtonActive,
                            {
                                backgroundColor: viewMode === 'card' ? theme.colors.primary : 'transparent',
                                borderColor: theme.colors.border
                            }
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="view-grid"
                            size={18}
                            color={viewMode === 'card' ? '#fff' : theme.colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {viewMode === 'table' ? renderTableView() : renderCardView()}
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
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    leftHeader: {
        flexDirection: 'row',
        alignItems: 'center',
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
    viewToggleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    toggleButton: {
        width: 36,
        height: 36,
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
    // Table View Styles
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
        width: '100%',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 14,
        alignItems: 'center',
    },
    labelCell: {
        flex: 1,
        paddingRight: 12,
    },
    valueCell: {
        flex: 1,
        alignItems: 'flex-end',
    },
    labelText: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    valueText: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'right',
    },
    // Card View Styles
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
    card: {
        width: '48%',
        minHeight: 110,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
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
