import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../theme';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register, isLoading } = useContext(AuthContext);

    const handleRegister = async () => {
        if (!username || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        const result = await register(username, password);
        if (result.success) {
            Alert.alert('Success', 'Account created! Please login.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert('Registration Failed', result.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoBox}>
                         <Ionicons name="filter-circle-outline" size={32} color={theme.colors.primary} />
                    </View>
                </View>
                <Text style={styles.logoTitle}>IPO Lens</Text>
                <Text style={styles.tagline}>Join the Winners Club</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.inactiveTabText}>Log In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                        <Text style={styles.activeTabText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="investor@example.com"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </View>

                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Create a password"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm password"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                    />
                </View>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleRegister} 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={theme.colors.background} />
                    ) : (
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>Create Account</Text>
                            <Ionicons name="arrow-forward" size={20} color={theme.colors.background} />
                        </View>
                    )}
                </TouchableOpacity>
                
                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>OR SIGN UP WITH</Text>
                    <View style={styles.divider} />
                </View>

                <View style={styles.socialButtons}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Ionicons name="logo-apple" size={20} color="#fff" />
                        <Text style={styles.socialButtonText}>Apple</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Ionicons name="logo-google" size={20} color="#fff" />
                        <Text style={styles.socialButtonText}>Google</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>
                    By creating an account, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.lg,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    logoBox: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: theme.colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    logoTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    tagline: {
        fontSize: 16,
        color: theme.colors.primary,
        marginTop: 4,
    },
    formContainer: {
        width: '100%',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: theme.spacing.xl,
        backgroundColor: theme.colors.surfaceLight,
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
        backgroundColor: theme.colors.primary,
    },
    activeTabText: {
        color: theme.colors.background,
        fontWeight: 'bold',
        fontSize: 16,
    },
    inactiveTabText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
    },
    label: {
        color: theme.colors.text,
        marginBottom: 8,
        fontSize: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
        paddingHorizontal: theme.spacing.md,
        height: 50,
        marginBottom: theme.spacing.lg,
    },
    inputIcon: {
        marginRight: theme.spacing.sm,
    },
    input: {
        flex: 1,
        color: theme.colors.text,
        height: '100%',
    },
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        ...theme.shadows.button,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        color: theme.colors.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    dividerText: {
        color: theme.colors.textSecondary,
        paddingHorizontal: theme.spacing.md,
        fontSize: 12,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: theme.spacing.xl,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceLight,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        gap: 8,
    },
    socialButtonText: {
        color: theme.colors.text,
        fontWeight: '600',
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        fontSize: 12,
        lineHeight: 18,
    },
    link: {
        color: theme.colors.textSecondary,
        textDecorationLine: 'underline',
    }
});
