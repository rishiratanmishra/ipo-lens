import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, lightTheme, darkTheme } from '../theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>('system');

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedMode = await AsyncStorage.getItem('themeMode');
                if (savedMode) {
                    setMode(savedMode as ThemeMode);
                }
            } catch (error) {
                console.log('Error loading theme:', error);
            }
        };
        loadTheme();
    }, []);

    const updateMode = async (newMode: ThemeMode) => {
        setMode(newMode);
        try {
            await AsyncStorage.setItem('themeMode', newMode);
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    // Derived state for actual theme usage
    const isDark =
        mode === 'dark' ? true :
            mode === 'light' ? false :
                systemScheme === 'dark';

    const theme = isDark ? darkTheme : lightTheme;

    const value = {
        theme,
        mode,
        setMode: updateMode,
        isDark
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
