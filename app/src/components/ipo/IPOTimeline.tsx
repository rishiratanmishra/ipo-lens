import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOTimelineProps {
    timeline: any[];
}

const IPOTimeline: React.FC<IPOTimelineProps> = ({ timeline }) => {
    const { theme } = useTheme();

    return (
        <View>
            <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.colors.text }]}>Timeline</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[styles.timelineContainer, { backgroundColor: theme.colors.surfaceHighlight }]}
                contentContainerStyle={styles.timelineContentContainer}
            >
                {timeline.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === timeline.length - 1;

                    return (
                        <View key={index} style={styles.timelineItem}>
                            <View style={styles.timelineTop}>
                                {/* Connection Line */}
                                <View style={[
                                    styles.connectionLine,
                                    { backgroundColor: theme.colors.textSecondary },
                                    isFirst && styles.connectionLineFirst,
                                    isLast && styles.connectionLineLast
                                ]} />

                                {/* Icon Bubble */}
                                <View style={[
                                    styles.timelineIconBox,
                                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.textSecondary },
                                    item.active && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                                ]}>
                                    <Ionicons name={item.icon as any} size={18} color={item.active ? theme.colors.background : theme.colors.textSecondary} />
                                </View>
                            </View>

                            <View style={styles.timelineTextContent}>
                                <Text style={[styles.timelineTitle, { color: theme.colors.text }]} numberOfLines={1}>{item.title}</Text>
                                <Text style={[styles.timelineDate, { color: theme.colors.textSecondary }]}>{item.date}</Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
        marginBottom: 12,
    },
    timelineContainer: {
        borderRadius: 12,
        height: 130, // Fixed height to contain content
    },
    timelineContentContainer: {
        padding: 16,
        paddingRight: 32, // Extra padding at the end for scroll
        alignItems: 'center', // Center vertically within container? No, items are columns.
    },
    timelineItem: {
        width: 110, // Slightly wider
        alignItems: 'center',
    },
    timelineTop: {
        height: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    connectionLine: {
        position: 'absolute',
        height: 2,
        width: '100%',
        top: '50%',
        marginTop: -1,
        zIndex: 0,
    },
    connectionLineFirst: {
        width: '50%',
        left: '50%',
    },
    connectionLineLast: {
        width: '50%',
        left: 0,
    },
    timelineIconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        zIndex: 1,
    },
    timelineTextContent: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 4,
    },
    timelineTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
    },
    timelineDate: {
        fontSize: 10,
        textAlign: 'center',
    },
});

export default IPOTimeline;
