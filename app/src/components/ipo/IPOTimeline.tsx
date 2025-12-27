import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
            <View style={[styles.timelineContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                {timeline.map((item, index) => (
                    <View key={index} style={styles.timelineItem}>
                        <View style={styles.timelineLeft}>
                            <View style={[
                                styles.timelineIconBox,
                                { backgroundColor: theme.colors.surface, borderColor: theme.colors.textSecondary },
                                item.active && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                            ]}>
                                <Ionicons name={item.icon as any} size={20} color={item.active ? theme.colors.background : theme.colors.textSecondary} />
                            </View>
                            {index < timeline.length - 1 && <View style={[styles.timelineLine, { backgroundColor: theme.colors.textSecondary }]} />}
                        </View>
                        <View style={styles.timelineContent}>
                            <Text style={[styles.timelineTitle, { color: theme.colors.text }]}>{item.title}</Text>
                            <Text style={[styles.timelineDate, { color: theme.colors.textSecondary }]}>{item.date}</Text>
                        </View>
                    </View>
                ))}
            </View>
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
        backgroundColor: defaultTheme.colors.surfaceHighlight,
        borderRadius: 12,
        padding: 16,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 0,
        height: 70, // Fixed height for alignment
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: 16,
        width: 40,
    },
    timelineIconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: defaultTheme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: defaultTheme.colors.textSecondary,
        zIndex: 1,
    },
    timelineLine: {
        flex: 1,
        width: 1,
        backgroundColor: defaultTheme.colors.textSecondary,
    },
    timelineContent: {
        paddingTop: 8,
    },
    timelineTitle: {
        color: defaultTheme.colors.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    timelineDate: {
        color: defaultTheme.colors.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
});

export default IPOTimeline;
