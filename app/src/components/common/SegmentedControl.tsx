import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface SegmentedControlProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    containerStyle?: object;
}

export default function SegmentedControl({ tabs, activeTab, onTabChange, containerStyle }: SegmentedControlProps) {
    const { theme } = useTheme();

    // If there are many tabs (more than 4), use a scrollable version
    const isScrollable = tabs.length > 4;

    if (isScrollable) {
        return (
            <View style={[styles.scrollableWrapper, containerStyle]}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => onTabChange(tab)}
                            style={[
                                styles.scrollableSegment,
                                {
                                    backgroundColor: activeTab === tab
                                        ? '#34D39920'
                                        : 'transparent',
                                    borderColor: activeTab === tab
                                        ? '#34D399'
                                        : 'transparent',
                                    borderWidth: 1,
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.segmentText,
                                    {
                                        color: activeTab === tab
                                            ? '#059669'
                                            : theme.colors.textSecondary
                                    }
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={[styles.segmentContainer, { backgroundColor: theme.colors.surface }, containerStyle]}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    onPress={() => onTabChange(tab)}
                    style={[
                        styles.segmentButton,
                        {
                            backgroundColor: activeTab === tab
                                ? '#34D39920'
                                : 'transparent',
                            borderColor: activeTab === tab
                                ? '#34D399'
                                : 'transparent',
                            borderWidth: 1,
                        }
                    ]}
                >
                    <Text
                        style={[
                            styles.segmentText,
                            {
                                color: activeTab === tab
                                    ? '#059669'
                                    : theme.colors.textSecondary
                            }
                        ]}
                    >
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    segmentContainer: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical: 15,
        borderRadius: 12,
        padding: 4,
        height: 48,
    },
    segmentButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    segmentText: {
        fontSize: 13,
        fontWeight: '600',
    },
    scrollableWrapper: {
        marginHorizontal: 15,
        marginVertical: 15,
    },
    scrollContent: {
        paddingRight: 15,
        gap: 8,
    },
    scrollableSegment: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
    },
});
