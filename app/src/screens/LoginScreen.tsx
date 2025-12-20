import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { theme as defaultTheme } from '../theme';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useContext(AuthContext);
    const { theme } = useTheme();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        const result = await login(username, password);
        if (!result.success) {
            Alert.alert('Login Failed', result.message);
        }
        // Navigation is handled automatically by AuthContext state change
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <View style={[styles.logoBox, { backgroundColor: theme.colors.surfaceLight, borderColor: theme.colors.border }]}>
                        <Ionicons name="filter-circle-outline" size={32} color={theme.colors.primary} />
                    </View>
                </View>
                <Text style={[styles.logoTitle, { color: theme.colors.text }]}>IPO Lens</Text>
                <Text style={[styles.tagline, { color: theme.colors.primary }]}>Track the Next Big Win</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={[styles.tabContainer, { backgroundColor: theme.colors.surfaceLight }]}>
                    <TouchableOpacity style={[styles.tab, styles.activeTab, { backgroundColor: theme.colors.primary }]}>
                        <Text style={[styles.activeTabText, { color: theme.colors.background }]}>Log In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Register')}>
                        <Text style={[styles.inactiveTabText, { color: theme.colors.textSecondary }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.label, { color: theme.colors.text }]}>Email Address</Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, { color: theme.colors.text }]}
                        placeholder="investor@example.com"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.passwordHeader}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>Password</Text>
                    <TouchableOpacity>
                        <Text style={[styles.forgotPassword, { color: theme.colors.primary }]}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, { color: theme.colors.text }]}
                        placeholder="........"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={theme.colors.background} />
                    ) : (
                        <View style={styles.buttonContent}>
                            <Text style={[styles.buttonText, { color: theme.colors.background }]}>Log In</Text>
                            <Ionicons name="arrow-forward" size={20} color={theme.colors.background} />
                        </View>
                    )}
                </TouchableOpacity>

                <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
                    By logging in, you agree to our <Text style={[styles.link, { color: theme.colors.textSecondary }]}>Terms of Service</Text> and <Text style={[styles.link, { color: theme.colors.textSecondary }]}>Privacy Policy</Text>.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: defaultTheme.colors.background,
        padding: defaultTheme.spacing.lg,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: defaultTheme.spacing.xl,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoBox: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: defaultTheme.colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: defaultTheme.spacing.md,
        borderWidth: 1,
        borderColor: defaultTheme.colors.border,
    },
    logoTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: defaultTheme.colors.text,
    },
    tagline: {
        fontSize: 16,
        color: defaultTheme.colors.primary,
        marginTop: 4,
    },
    formContainer: {
        width: '100%',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: defaultTheme.spacing.xl,
        backgroundColor: defaultTheme.colors.surfaceLight,
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: defaultTheme.colors.primary,
    },
    activeTabText: {
        color: defaultTheme.colors.background,
        fontWeight: 'bold',
        fontSize: 16,
    },
    inactiveTabText: {
        color: defaultTheme.colors.textSecondary,
        fontSize: 16,
    },
    label: {
        color: defaultTheme.colors.text,
        marginBottom: 8,
        fontSize: 14,
    },
    passwordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    forgotPassword: {
        color: defaultTheme.colors.primary,
        fontSize: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: defaultTheme.colors.surface,
        borderWidth: 1,
        borderColor: defaultTheme.colors.border,
        borderRadius: 12,
        paddingHorizontal: defaultTheme.spacing.md,
        height: 50,
        marginBottom: defaultTheme.spacing.lg,
    },
    inputIcon: {
        marginRight: defaultTheme.spacing.sm,
    },
    input: {
        flex: 1,
        color: defaultTheme.colors.text,
        height: '100%',
    },
    button: {
        backgroundColor: defaultTheme.colors.primary,
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: defaultTheme.spacing.lg,
        ...defaultTheme.shadows.button,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        color: defaultTheme.colors.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    faceIdButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: defaultTheme.colors.surfaceLight,
        padding: 12,
        borderRadius: 24,
        alignSelf: 'center',
        marginBottom: defaultTheme.spacing.xl,
        paddingHorizontal: 24,
    },
    faceIdText: {
        color: defaultTheme.colors.textSecondary,
        fontSize: 14,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: defaultTheme.spacing.lg,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: defaultTheme.colors.border,
    },
    dividerText: {
        color: defaultTheme.colors.textSecondary,
        paddingHorizontal: defaultTheme.spacing.md,
        fontSize: 12,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: defaultTheme.spacing.xl,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: defaultTheme.colors.surfaceLight,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: defaultTheme.colors.border,
        gap: 8,
    },
    socialButtonText: {
        color: defaultTheme.colors.text,
        fontWeight: '600',
    },
    footerText: {
        textAlign: 'center',
        color: defaultTheme.colors.textSecondary,
        fontSize: 12,
        lineHeight: 18,
    },
    link: {
        color: defaultTheme.colors.textSecondary,
        textDecorationLine: 'underline',
    }
});
