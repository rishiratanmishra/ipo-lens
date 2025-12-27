import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme';

interface IPOCompanyInfoProps {
    details: any;
    leadManagers: any[];
    address: string;
    companyName: string;
}

const IPOCompanyInfo: React.FC<IPOCompanyInfoProps> = ({ details, leadManagers, address, companyName }) => {
    const { theme } = useTheme();

    return (
        <View>
            {/* About */}
            <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.colors.text }]}>About {companyName}</Text>
            <View style={[styles.aboutCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>
                    {details?.about_company || 'Company information is being updated.'}
                </Text>
            </View>

            {/* Lead Managers */}
            {leadManagers.length > 0 && (
                <View style={{ marginTop: 24 }}>
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Lead Managers</Text>
                    <View style={[styles.infoCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                        {leadManagers.map((mgr, index) => (
                            <View key={index} style={[styles.infoRow, { borderBottomWidth: index === leadManagers.length - 1 ? 0 : 1, borderBottomColor: theme.colors.border }]}>
                                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{mgr.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Address */}
            {address ? (
                <View style={{ marginTop: 24 }}>
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Company Address</Text>
                    <View style={[styles.aboutCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                        <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>{address}</Text>
                    </View>
                </View>
            ) : null}

            {/* Registrar */}
            {details?.registrar && (
                <View style={{ marginTop: 24 }}>
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Registrar</Text>
                    <View style={[styles.aboutCard, { backgroundColor: theme.colors.surfaceHighlight }]}>
                        <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>{details.registrar}</Text>
                    </View>
                </View>
            )}
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
    aboutCard: {
        borderRadius: 12,
        padding: 16,
    },
    aboutText: {
        lineHeight: 20,
    },
    infoCard: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: defaultTheme.colors.border,
    },
    infoValue: {
        color: defaultTheme.colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default IPOCompanyInfo;
