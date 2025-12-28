import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme as defaultTheme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function MenuScreen() {
    const { user, logout } = useContext(AuthContext);
    const { theme } = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        // Navigation is handled automatically by AuthContext
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.closeButton, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Menu</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={[styles.content, { padding: theme.spacing.md }]}>
                {user ? (
                    <View style={[styles.profileCard, { backgroundColor: theme.colors.glass, borderColor: theme.colors.glassStroke }]}>
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarWrapper}>
                                <View style={[styles.avatarContainer, { borderColor: theme.colors.primary }]}>
                                    <Text style={[styles.avatarText, { color: theme.colors.primary }]}>{user.username.charAt(0).toUpperCase()}</Text>
                                </View>
                                <TouchableOpacity style={[styles.editBadge, { backgroundColor: theme.colors.primary, borderColor: theme.colors.surface }]}>
                                    <Ionicons name="pencil" size={10} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.profileInfo}>
                                <View style={styles.nameRow}>
                                    <Text style={[styles.userName, { color: theme.colors.text }]}>{user.username}</Text>
                                    <View style={[styles.proBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                                        <Text style={[styles.proBadgeText, { color: theme.colors.primary }]}>PRO</Text>
                                    </View>
                                </View>
                                <Text style={[styles.userHandle, { color: theme.colors.textSecondary }]}>@{user.username.toLowerCase().replace(/\s/g, '')}</Text>
                            </View>
                        </View>

                        <View style={[styles.divider, { backgroundColor: theme.colors.glassStroke }]} />

                        <View style={styles.profileStats}>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.colors.text }]}>12</Text>
                                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Watchlist</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.colors.text }]}>5</Text>
                                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Alerts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.colors.text }]}>2</Text>
                                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Applied</Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.guestCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <View style={styles.guestContent}>
                            <View style={[styles.guestIconBox, { backgroundColor: theme.colors.surfaceHighlight }]}>
                                <Ionicons name="person-outline" size={28} color={theme.colors.text} />
                            </View>
                            <View style={styles.guestInfo}>
                                <Text style={[styles.guestTitle, { color: theme.colors.text }]}>Welcome Investor</Text>
                                <Text style={[styles.guestSubtitle, { color: theme.colors.textSecondary }]}>Log in to manage your portfolio</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[styles.loginButtonDisplay, { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '10' }]}
                            onPress={() => logout()}
                        >
                            <Text style={[styles.loginButtonText, { color: theme.colors.primary }]}>Log In / Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <MenuSection title="PREFERENCES" theme={theme}>
                    <MenuItem
                        icon="settings-outline"
                        label="Settings"
                        onPress={() => navigation.navigate('Settings')}
                        theme={theme}
                        color={theme.colors.textSecondary}
                    />
                    <MenuItem
                        icon="notifications-outline"
                        label="Notifications"
                        onPress={() => { }}
                        theme={theme}
                        color={theme.colors.textSecondary}
                        isLast
                    />
                </MenuSection>

                <MenuSection title="SUPPORT" theme={theme}>
                    <MenuItem
                        icon="help-circle-outline"
                        label="Help & Support"
                        onPress={() => { }}
                        theme={theme}
                        color={theme.colors.textSecondary}
                    />
                    <MenuItem
                        icon="chatbubble-ellipses-outline"
                        label="Send Feedback"
                        onPress={() => { }}
                        theme={theme}
                        color={theme.colors.textSecondary}
                    />
                    <MenuItem
                        icon="star-outline"
                        label="Rate App"
                        onPress={() => Alert.alert("Rate Us", "Opening store page...")}
                        theme={theme}
                        color={theme.colors.textSecondary}
                        isLast
                    />
                </MenuSection>

                <MenuSection title="LEGAL" theme={theme}>
                    <MenuItem
                        icon="document-text-outline"
                        label="Terms & Conditions"
                        onPress={() => { }}
                        theme={theme}
                        color={theme.colors.textSecondary}
                    />
                    <MenuItem
                        icon="shield-checkmark-outline"
                        label="Privacy Policy"
                        onPress={() => { }}
                        theme={theme}
                        color={theme.colors.textSecondary}
                        isLast
                    />
                </MenuSection>

                {user && (
                    <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.colors.error + '10' }]} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
                        <Text style={[styles.logoutText, { color: theme.colors.error }]}>Log Out</Text>
                    </TouchableOpacity>
                )}

                <Text style={[styles.versionText, { color: theme.colors.textTertiary }]}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const MenuSection = ({ title, children, theme }: { title?: string, children: React.ReactNode, theme: any }) => (
    <View style={styles.sectionContainer}>
        {title && <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>{title}</Text>}
        <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            {children}
        </View>
    </View>
);

const MenuItem = ({ icon, label, onPress, theme, isLast, color }: { icon: any, label: string, onPress: () => void, theme: any, isLast?: boolean, color?: string }) => (
    <TouchableOpacity
        style={[styles.menuItem, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconContainer, { backgroundColor: (color || theme.colors.primary) + '15' }]}>
                <Ionicons name={icon} size={20} color={color || theme.colors.text} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.colors.text }]}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: defaultTheme.spacing.md,
        paddingBottom: defaultTheme.spacing.md,
        borderBottomWidth: 1,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        paddingBottom: 40,
    },
    // Profile Card Styles
    profileCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        // borderWidth: 1, // Removed to flatten the design
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarWrapper: {
        marginRight: 16,
        position: 'relative',
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    avatarText: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
    },
    proBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    proBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    userHandle: {
        fontSize: 15,
    },
    divider: {
        height: 1,
        width: '100%',
        marginBottom: 20,
    },
    profileStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        fontWeight: '500',
    },
    // Guest Card Styles
    guestCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        // borderWidth: 1, // Removed to flatten the design
    },
    guestContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    guestIconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    guestInfo: {
        flex: 1,
    },
    guestTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    guestSubtitle: {
        fontSize: 14,
    },
    loginButtonDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    // Section Styles
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 0.5,
    },
    sectionContent: {
        borderRadius: 16,
        // borderWidth: 1, // Removed to flatten the design
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 24,
        gap: 8,
        paddingVertical: 16,
        borderRadius: 16,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 20,
    }
});
