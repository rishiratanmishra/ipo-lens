import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api'; 

export interface User {
    id: string | number;
    username: string;
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
            // Updated Endpoint
            const response = await api.post('/auth.php?action=login', { username, password });
            
            if (response.data.user_id) {
                const userData: User = { id: response.data.user_id, username: response.data.username };
                setUser(userData);
                await AsyncStorage.setItem('user', JSON.stringify(userData));
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
            const response = await api.post('/auth.php?action=register', { username, password });
            setIsLoading(false);
            return { success: true, message: response.data.message };
        } catch (error: any) {
            setIsLoading(false);
            console.error("Register Error:", error);
            const msg = error.response?.data?.message || error.message || 'Registration failed';
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
