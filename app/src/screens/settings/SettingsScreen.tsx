import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { theme as defaultTheme } from '../../theme'; // Static theme for StyleSheet

type ThemeOption = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
    const navigation = useNavigation();
    const { theme, mode, setMode } = useTheme();

    // Mock states for other toggles
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [isThemeModalVisible, setThemeModalVisible] = useState(false);

    const handleToggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
    const handleToggleBiometric = () => setBiometricEnabled(!biometricEnabled);

    const getThemeLabel = (value: ThemeOption) => {
        switch (value) {
            case 'light': return 'Light Mode';
            case 'dark': return 'Dark Mode';
            case 'system': return 'System Default';
        }
    };

    const handleThemeSelect = (selectedTheme: ThemeOption) => {
        setMode(selectedTheme);
        setThemeModalVisible(false);
    };

    const renderSectionHeader = (title: string) => (
        <Text style={[styles.sectionHeader, { color: theme.colors.primary }]}>{title}</Text>
    );

    const renderSettingItem = (
        icon: any,
        label: string,
        value?: string | boolean,
        onPress?: () => void,
        isToggle: boolean = false
    ) => (
        <TouchableOpacity
            style={[styles.itemContainer, { backgroundColor: theme.colors.surfaceHighlight }]}
            onPress={isToggle ? onPress : onPress}
            disabled={isToggle}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.colors.surface }]}>
                    <Ionicons name={icon} size={20} color={theme.colors.text} />
                </View>
                <Text style={[styles.itemLabel, { color: theme.colors.text }]}>{label}</Text>
            </View>

            {isToggle ? (
                <Switch
                    trackColor={{ false: theme.colors.surface, true: theme.colors.primary }}
                    thumbColor={value ? '#fff' : '#f4f3f4'}
                    onValueChange={onPress}
                    value={value as boolean}
                />
            ) : (
                <View style={styles.itemRight}>
                    {value && <Text style={[styles.itemValue, { color: theme.colors.textSecondary }]}>{value}</Text>}
                    <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {renderSectionHeader("Preferences")}
                {renderSettingItem(
                    "notifications-outline",
                    "Push Notifications",
                    notificationsEnabled,
                    handleToggleNotifications,
                    true
                )}
                {renderSettingItem(
                    "color-palette-outline",
                    "App Theme",
                    getThemeLabel(mode),
                    () => setThemeModalVisible(true)
                )}

                {renderSectionHeader("Security")}
                {renderSettingItem(
                    "finger-print-outline", // Corrected icon name from "finger_print" to "finger-print-outline"
                    "Biometric Login",
                    biometricEnabled,
                    handleToggleBiometric,
                    true
                )}
                {renderSettingItem(
                    "lock-closed-outline",
                    "Change Password",
                    "",
                    () => Alert.alert("Coming Soon", "Password change flow not implemented yet.")
                )}



                <View style={styles.footer}>
                    <Text style={styles.footerText}>IPO Lens v1.0.0</Text>
                    <Text style={styles.footerText}>Made with ❤️ for Investors</Text>
                </View>

            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isThemeModalVisible}
                onRequestClose={() => setThemeModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setThemeModalVisible(false)}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Choose Theme</Text>

                        <TouchableOpacity style={[styles.modalOption, { borderBottomColor: theme.colors.border }]} onPress={() => handleThemeSelect('light')}>
                            <View style={styles.modalOptionLeft}>
                                <Ionicons name="sunny-outline" size={24} color={theme.colors.text} />
                                <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>Light Mode</Text>
                            </View>
                            {mode === 'light' && <Ionicons name="checkmark" size={24} color={theme.colors.primary} />}
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalOption, { borderBottomColor: theme.colors.border }]} onPress={() => handleThemeSelect('dark')}>
                            <View style={styles.modalOptionLeft}>
                                <Ionicons name="moon-outline" size={24} color={theme.colors.text} />
                                <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>Dark Mode</Text>
                            </View>
                            {mode === 'dark' && <Ionicons name="checkmark" size={24} color={theme.colors.primary} />}
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalOption, { borderBottomColor: theme.colors.border }]} onPress={() => handleThemeSelect('system')}>
                            <View style={styles.modalOptionLeft}>
                                <Ionicons name="hardware-chip-outline" size={24} color={theme.colors.text} />
                                <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>System Default</Text>
                            </View>
                            {mode === 'system' && <Ionicons name="checkmark" size={24} color={theme.colors.primary} />}
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

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
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    content: {
        padding: defaultTheme.spacing.md,
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: defaultTheme.colors.primary,
        marginTop: defaultTheme.spacing.lg,
        marginBottom: defaultTheme.spacing.sm,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: defaultTheme.colors.surfaceHighlight,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemLabel: {
        fontSize: 16,
        color: defaultTheme.colors.text,
        fontWeight: '500',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemValue: {
        fontSize: 14,
        color: defaultTheme.colors.textSecondary,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
        gap: 4,
    },
    footerText: {
        fontSize: 12,
        color: defaultTheme.colors.textSecondary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: defaultTheme.colors.surfaceHighlight,
        borderRadius: 24,
        padding: 24,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
        marginBottom: 20,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: defaultTheme.colors.border,
    },
    modalOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    modalOptionText: {
        fontSize: 16,
        color: defaultTheme.colors.text,
        fontWeight: '500',
    }
});
