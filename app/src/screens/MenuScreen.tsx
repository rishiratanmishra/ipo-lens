import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
                        navigation.navigate('Main'); // Reset or go back
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.closeButton, { backgroundColor: theme.colors.surfaceLight }]}>
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Menu</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={[styles.content, { padding: theme.spacing.md }]}>
                {user ? (
                    <View style={[styles.profileSection, { borderBottomColor: theme.colors.border }]}>
                        <View style={[styles.avatarLarge, { backgroundColor: theme.colors.primary }]}>
                            <Text style={[styles.avatarText, { color: theme.colors.background }]}>{user.username.charAt(0).toUpperCase()}</Text>
                        </View>
                        <Text style={[styles.userName, { color: theme.colors.text }]}>{user.username}</Text>
                        <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>User ID: {user.id}</Text>

                        <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: theme.colors.surfaceLight, borderColor: theme.colors.border }]}>
                            <Text style={[styles.editProfileText, { color: theme.colors.text }]}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.guestSection}>
                        <Ionicons name="person-circle-outline" size={80} color={theme.colors.textSecondary} />
                        <Text style={[styles.guestTitle, { color: theme.colors.text }]}>Welcome Guest</Text>
                        <Text style={[styles.guestSubtitle, { color: theme.colors.textSecondary }]}>Log in to manage your profile</Text>
                        <TouchableOpacity style={[styles.loginButton, { backgroundColor: theme.colors.primary }]} onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.loginButtonText, { color: theme.colors.background }]}>Log In / Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.menuItems}>
                    <MenuItem icon="settings-outline" label="Settings" onPress={() => navigation.navigate('Settings')} theme={theme} />
                    <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => { }} theme={theme} />
                    <MenuItem icon="document-text-outline" label="Terms & Conditions" onPress={() => { }} theme={theme} />
                    <MenuItem icon="shield-checkmark-outline" label="Privacy Policy" onPress={() => { }} theme={theme} />
                </View>

                {user && (
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const MenuItem = ({ icon, label, onPress, theme }: { icon: any, label: string, onPress: () => void, theme: any }) => (
    <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.colors.surfaceLight }]} onPress={onPress}>
        <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name={icon} size={20} color={theme.colors.text} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.colors.text }]}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: defaultTheme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: defaultTheme.spacing.md,
        paddingBottom: defaultTheme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: defaultTheme.colors.border,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: defaultTheme.colors.surfaceLight,
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    content: {
        padding: defaultTheme.spacing.md,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: defaultTheme.spacing.xl,
        paddingVertical: defaultTheme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: defaultTheme.colors.border,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: defaultTheme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: defaultTheme.spacing.md,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: defaultTheme.colors.background,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: defaultTheme.colors.textSecondary,
        marginBottom: defaultTheme.spacing.md,
    },
    editProfileButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: defaultTheme.colors.surfaceLight,
        borderWidth: 1,
        borderColor: defaultTheme.colors.border,
    },
    editProfileText: {
        color: defaultTheme.colors.text,
        fontWeight: '600',
        fontSize: 14,
    },
    guestSection: {
        alignItems: 'center',
        marginBottom: defaultTheme.spacing.xl,
        paddingVertical: defaultTheme.spacing.lg,
    },
    guestTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
        marginTop: defaultTheme.spacing.md,
    },
    guestSubtitle: {
        color: defaultTheme.colors.textSecondary,
        marginBottom: defaultTheme.spacing.lg,
    },
    loginButton: {
        backgroundColor: defaultTheme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    loginButtonText: {
        color: defaultTheme.colors.background,
        fontWeight: 'bold',
    },
    menuItems: {
        gap: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: defaultTheme.colors.surfaceLight,
        borderRadius: 12,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuIconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: defaultTheme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuLabel: {
        fontSize: 16,
        color: defaultTheme.colors.text,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: defaultTheme.spacing.xl * 2,
        gap: 8,
        paddingVertical: 12,
    },
    logoutText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
