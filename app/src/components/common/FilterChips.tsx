import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface FilterChipsProps {
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
    containerStyle?: object;
    label?: string;
}

export default function FilterChips({ options, selectedValue, onSelect, containerStyle, label }: FilterChipsProps) {
    const { theme } = useTheme();

    return (
        <View style={containerStyle}>
            {label && (
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
            )}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => onSelect(option)}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: selectedValue === option
                                    ? '#34D39920'
                                    : theme.colors.surfaceHighlight,
                                borderColor: selectedValue === option
                                    ? '#34D399'
                                    : theme.colors.border,
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styles.chipText,
                                {
                                    color: selectedValue === option
                                        ? '#059669'
                                        : theme.colors.textSecondary
                                }
                            ]}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    scrollContent: {
        paddingRight: 15,
        gap: 8,
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 100,
        borderWidth: 1,
        marginRight: 10,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
