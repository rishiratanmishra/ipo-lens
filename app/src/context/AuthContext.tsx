import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin, useRegister } from '../services/queries';

export interface User {
    id: string | number;
    username: string;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    isGuestMode: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    skipLogin: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isGuestMode, setIsGuestMode] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Mutations
    const loginMutation = useLogin();
    const registerMutation = useRegister();

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        setIsLoading(true); // Initial load
        try {
            /* const guest = await AsyncStorage.getItem('isGuest');
            if (guest === 'true') {
                setIsGuestMode(true);
            } */

            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (e) {
            console.log("Failed to load user", e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await loginMutation.mutateAsync({ username, password });

            if (response.success && response.token) {
                const userData: User = {
                    id: response.user_id || 0,
                    username: response.user_display_name || username,
                    token: response.token
                };
                setUser(userData);
                setIsGuestMode(false);
                await AsyncStorage.setItem('user', JSON.stringify(userData));
                await AsyncStorage.removeItem('isGuest');
                return { success: true };
            }
            return { success: false, message: response.message || 'Login failed' };
        } catch (error: any) {
            console.error("Login Error:", error);
            return { success: false, message: 'Login failed' };
        }
    };

    const register = async (username: string, password: string) => {
        try {
            const response = await registerMutation.mutateAsync({ username, password });

            if (response.success) {
                return { success: true };
            } else {
                return { success: false, message: response.message || 'Registration failed' };
            }
        } catch (error: any) {
            return { success: false, message: 'Network error' };
        }
    };

    const logout = async () => {
        setUser(null);
        setIsGuestMode(false);
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('isGuest');
    };

    const skipLogin = async () => {
        setIsGuestMode(true);
        await AsyncStorage.setItem('isGuest', 'true');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isGuestMode,
            isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
            login,
            register,
            logout,
            skipLogin
        }}>
            {children}
        </AuthContext.Provider>
    );
};
