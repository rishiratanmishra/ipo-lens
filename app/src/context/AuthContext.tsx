import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import api from '../services/api';

export interface User {
    id: string | number;
    username: string;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (e) {
            console.log("Failed to load user", e);
        }
    };

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            // WordPress JWT Endpoint
            // Assuming admin_ipo is the directory for WP
            const response = await axios.post('https://zolaha.com/ipo_app/admin_ipo/wp-json/jwt-auth/v1/token', {
                username,
                password
            });

            if (response.data.token) {
                const userData: User = {
                    id: response.data.user_id || 0, // WP user ID
                    username: response.data.user_display_name || username,
                    token: response.data.token
                };
                setUser(userData);
                await AsyncStorage.setItem('user', JSON.stringify(userData));

                // Set default header for future requests if needed
                // api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                setIsLoading(false);
                return { success: true };
            }
            return { success: false, message: 'Invalid response' };
        } catch (error: any) {
            setIsLoading(false);
            console.error("Login Error:", error);
            const msg = error.response?.data?.message || error.message || 'Login failed';
            return { success: false, message: msg };
        }
    };

    const register = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            // Using custom registration endpoint that wraps wp_create_user
            // User must upload register_user.php to /backend_ipo/api/
            const response = await api.post('/register_user.php', {
                username,
                email: username, // Assuming username is email processing in UI
                password
            });

            setIsLoading(false);
            if (response.data.success) {
                return { success: true };
            } else {
                return { success: false, message: response.data.message || 'Registration failed' };
            }
        } catch (error: any) {
            setIsLoading(false);
            const msg = error.response?.data?.message || error.message || 'Network error';
            return { success: false, message: msg };
        }
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
