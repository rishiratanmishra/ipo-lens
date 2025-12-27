import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "../context/ThemeContext";
import { AuthProvider, AuthContext } from "../context/AuthContext";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MenuScreen from "../screens/MenuScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import IPODetailScreen from "../screens/IPODetailScreen";
import WebViewScreen from "../screens/WebViewScreen";
import { IPO } from "../services/api";
import MainTabs from "./MainTabs";
import { ActivityIndicator, View } from "react-native";

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    Main: undefined;
    Menu: undefined;
    Settings: undefined;
    IPODetail: { ipo: IPO };
    WebView: { url: string; title?: string };
};

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
    const { theme, isDark } = useTheme();
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <>
            <StatusBar style={isDark ? "light" : "dark"} />
            <Stack.Navigator
                id="RootStack"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: theme.colors.background },
                }}
            >
                {user ? (
                    // Screens for logged-in users
                    <>
                        <Stack.Screen name="Main" component={MainTabs} />
                        <Stack.Screen
                            name="Menu"
                            component={MenuScreen}
                            options={{ presentation: "modal" }}
                        />
                        <Stack.Screen name="Settings" component={SettingsScreen} />
                        <Stack.Screen
                            name="IPODetail"
                            component={IPODetailScreen}
                            options={{
                                headerShown: true,
                                title: "IPO Details",
                                headerStyle: {
                                    backgroundColor: theme.colors.surface,
                                    elevation: 0,
                                    shadowOpacity: 0,
                                    borderBottomWidth: 0,
                                },
                                headerTintColor: theme.colors.text,
                                headerTitleStyle: theme.typography.title,
                            }}
                        />
                        <Stack.Screen
                            name="WebView"
                            component={WebViewScreen}
                            options={{ headerShown: true }}
                        />
                    </>
                ) : (
                    // Screens for guests / not logged in
                    <>
                        <Stack.Screen name="Welcome" component={WelcomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <AuthProvider>
                <RootNavigator />
            </AuthProvider>
        </NavigationContainer>
    );
}
