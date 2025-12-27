import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
        <View style={{ marginTop: 24 }}>
            {/* About */}
            <View style={styles.headerContainer}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    <MaterialCommunityIcons name="information" size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>About {companyName}</Text>
            </View>
            <LinearGradient
                colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.aboutCard, { borderColor: theme.colors.border }]}
            >
                <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>
                    {details?.about_company || 'Company information is being updated.'}
                </Text>
            </LinearGradient>

            {/* Lead Managers */}
            {leadManagers.length > 0 && (
                <View style={{ marginTop: 24 }}>
                    <View style={styles.headerContainer}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                            <MaterialCommunityIcons name="account-tie" size={20} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Lead Managers</Text>
                    </View>
                    <LinearGradient
                        colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.infoCard, { borderColor: theme.colors.border }]}
                    >
                        {leadManagers.map((mgr, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.infoRow,
                                    {
                                        borderBottomWidth: index === leadManagers.length - 1 ? 0 : 1,
                                        borderBottomColor: theme.colors.border
                                    }
                                ]}
                            >
                                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{mgr.name}</Text>
                            </View>
                        ))}
                    </LinearGradient>
                </View>
            )}

            {/* Address */}
            {address ? (
                <View style={{ marginTop: 24 }}>
                    <View style={styles.headerContainer}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                            <MaterialCommunityIcons name="map-marker" size={20} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Company Address</Text>
                    </View>
                    <LinearGradient
                        colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.addressCard, { borderColor: theme.colors.border }]}
                    >
                        <Text style={[styles.addressText, { color: theme.colors.text }]}>
                            {address.replace(/\s+(Email:)/gi, '\n\n$1').replace(/\s+(Website:)/gi, '\n\n$1')}
                        </Text>
                    </LinearGradient>
                </View>
            ) : null}

            {/* Registrar */}
            {details?.registrar && (
                <View style={{ marginTop: 24 }}>
                    <View style={styles.headerContainer}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                            <MaterialCommunityIcons name="file-document" size={20} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Registrar</Text>
                    </View>
                    <LinearGradient
                        colors={theme.gradients?.darkCard || [theme.colors.card, theme.colors.surfaceHighlight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.aboutCard, { borderColor: theme.colors.border }]}
                    >
                        <Text style={[styles.aboutText, { color: theme.colors.text, fontWeight: '600' }]}>
                            {details.registrar
                                .replace(/\s+(Email:)/gi, '\n\n$1')
                                .replace(/\s+(Website:)/gi, '\n\n$1')
                                .replace(/\s+(Phone:)/gi, '\n\n$1')
                                .replace(/\s+(Address:)/gi, '\n\n$1')
                            }
                        </Text>
                    </LinearGradient>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
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
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.3,
        marginBottom: 4,
    },
    aboutCard: {
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 8,
    },
    aboutText: {
        fontSize: 15,
        lineHeight: 24,
        letterSpacing: 0.3,
        textAlign: 'justify',
    },
    infoCard: {
        borderRadius: 16,
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    infoRow: {
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    managerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowIcon: {
        marginRight: 10,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    addressCard: {
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    addressContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    addressIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    addressText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 22,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    registrarContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default IPOCompanyInfo;
