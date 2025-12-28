import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOTopCardProps {
    ipo: any;
    details: any;
    companyName: string;
    tag: string;
    statusColor: string;
}

const IPOTopCard: React.FC<IPOTopCardProps> = ({ ipo, details, companyName, tag, statusColor }) => {
    const { theme } = useTheme();
    const logoUrl = details?.image || ipo?.icon_url;

    return (
        <View style={[styles.topCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusText}>{ipo?.status || 'UPCOMING'}</Text>
            </View>

            <View style={styles.topCardContent}>
                <View style={[styles.logoContainer, { backgroundColor: '#fff' }]}>
                    {logoUrl ? (
                        <Image
                            source={{ uri: logoUrl }}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <Text style={[styles.logoText, { color: theme.colors.primary }]}>
                            {companyName.substring(0, 1)}
                        </Text>
                    )}
                </View>
                <View style={styles.headerInfo}>
                    <Text style={[styles.companyTitle, { color: theme.colors.text }]} numberOfLines={2}>
                        {companyName}
                    </Text>

                    <View style={styles.tagsContainer}>
                        <View style={[styles.tagBadge, { borderColor: theme.colors.textSecondary }]}>
                            <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>{tag}</Text>
                        </View>
                        <Text style={[styles.exchangeText, { color: theme.colors.textSecondary }]}> • NSE & BSE</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    topCard: {
        backgroundColor: defaultTheme.colors.surfaceHighlight,
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    topCardContent: {
        flexDirection: 'row',
        padding: 16,
        paddingTop: 24,
        alignItems: 'flex-start',
    },
    statusBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderBottomLeftRadius: 12,
        zIndex: 10,
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginTop: 4,
    },
    logoImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: defaultTheme.colors.primary,
    },
    headerInfo: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 72,
    },
    companyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
        marginBottom: 6,
        lineHeight: 26,
    },
    tagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    tagBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: defaultTheme.colors.border,
        marginRight: 6,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '600',
        color: defaultTheme.colors.textSecondary,
        textTransform: 'uppercase',
    },
    exchangeText: {
        fontSize: 12,
        color: defaultTheme.colors.textSecondary,
    },
});

export default IPOTopCard;
