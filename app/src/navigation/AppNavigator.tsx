import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { useTheme } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MenuScreen from "../screens/MenuScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import IPODetailScreen from "../screens/IPODetailScreen";
import { IPO } from "../services/api";
import MainTabs from "./MainTabs";

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    Main: undefined;
    Menu: undefined;
    Settings: undefined;
    IPODetail: { ipo: IPO };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { theme } = useTheme();

    return (
        <NavigationContainer>
            <AuthProvider>
                <Stack.Navigator
                    id="RootStack"
                    initialRouteName="Welcome"
                    screenOptions={{
                        headerShown: false,
                        cardStyle: { backgroundColor: theme.colors.background },
                    }}
                >
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen
                        name="Menu"
                        component={MenuScreen}
                        options={{ presentation: "modal" }}
                    />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                    <Stack.Screen name="Main" component={MainTabs} />

                    <Stack.Screen
                        name="IPODetail"
                        component={IPODetailScreen}
                        options={{
                            headerShown: true,
                            title: "IPO Details",
                            headerStyle: { backgroundColor: theme.colors.surface },
                            headerTintColor: theme.colors.text,
                        }}
                    />
                </Stack.Navigator>
            </AuthProvider>
        </NavigationContainer>
    );
}
