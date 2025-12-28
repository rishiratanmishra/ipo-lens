import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MenuScreen from "../screens/MenuScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import IPODetailScreen from "../screens/IPODetailScreen";
import WebViewScreen from "../screens/WebViewScreen";
import LegalPageScreen from "../screens/LegalPageScreen";
import { IPO } from "../services/api";
import MainTabs from "./MainTabs";
import { ActivityIndicator, View } from "react-native";

import CustomSplashScreen from "../screens/SplashScreen";

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    Main: undefined;
    Menu: undefined;
    Settings: undefined;
    IPODetail: { ipo: IPO };
    WebView: { url: string; title?: string };
    LegalPage: { content: string; title: string };
};

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
    const { theme, isDark } = useTheme();
    const { user, isGuestMode, isLoading } = useContext(AuthContext);

    return (
        <>
            <StatusBar
                style={isDark ? "light" : "dark"}
                backgroundColor={theme.colors.background}
            />
            <CustomSplashScreen isAppReady={!isLoading} />
            <Stack.Navigator
                id="RootStack"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: theme.colors.background },
                }}
            >
                {user || isGuestMode ? (
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
                                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                                gestureEnabled: true,
                                gestureDirection: 'vertical',
                            }}
                        />
                        <Stack.Screen
                            name="WebView"
                            component={WebViewScreen}
                            options={{ headerShown: true }}
                        />
                        <Stack.Screen
                            name="LegalPage"
                            component={LegalPageScreen}
                            options={({ route }) => ({
                                headerShown: true,
                                title: route.params.title,
                                headerStyle: {
                                    backgroundColor: theme.colors.surface,
                                    elevation: 0,
                                    shadowOpacity: 0,
                                    borderBottomWidth: 0,
                                },
                                headerTintColor: theme.colors.text,
                                headerTitleStyle: theme.typography.title,
                            })}
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
            <RootNavigator />
        </NavigationContainer>
    );
}
