import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPODocumentsProps {
    documents: any[];
    openLink: (url: string, title: string) => void;
}

const IPODocuments: React.FC<IPODocumentsProps> = ({ documents, openLink }) => {
    const { theme } = useTheme();

    if (!documents || documents.length === 0) return null;

    return (
        <View style={{ marginTop: 24 }}>
            <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Documents</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {documents.map((doc, index) => (
                    <TouchableOpacity key={index} style={[styles.docButton, { borderColor: theme.colors.primary }]} onPress={() => openLink(doc.url, doc.title)}>
                        <Ionicons name="document-text" size={16} color={theme.colors.primary} />
                        <Text style={[styles.docButtonText, { color: theme.colors.primary }]}>{doc.title}</Text>
                    </TouchableOpacity>
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
    docButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
        marginBottom: 8,
    },
    docButtonText: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default IPODocuments;
