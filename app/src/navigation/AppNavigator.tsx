import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, AuthContext } from '../context/AuthContext';
import { theme } from '../theme';
import { IPO } from '../services/api';

import HomeScreen from '../screens/HomeScreen';
import IPOListScreen from '../screens/IPOListScreen';
import GMPListScreen from '../screens/GMPListScreen';
import BuybackListScreen from '../screens/BuybackListScreen';
import BrokerListScreen from '../screens/BrokerListScreen';
import IPODetailScreen from '../screens/IPODetailScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    Main: undefined;
    IPODetail: { ipo: IPO };
};

export type PortfolioStackParamList = {
    MyPortfolio: undefined;
    Login: undefined;
    Register: undefined;
};

export type MainTabParamList = {
    Dashboard: undefined;
    IPO: undefined;
    GMP: undefined;
    Portfolio: undefined;
    Buyback: undefined;
    Brokers: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const PortfolioStack = createStackNavigator<PortfolioStackParamList>();

function PortfolioNavigator() {
    const { user } = useContext(AuthContext);

    return (
        <PortfolioStack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <PortfolioStack.Screen name="MyPortfolio" component={PortfolioScreen} />
            ) : (
                <>
                    <PortfolioStack.Screen name="Login" component={LoginScreen} />
                    <PortfolioStack.Screen name="Register" component={RegisterScreen} />
                </>
            )}
        </PortfolioStack.Navigator>
    );
}

function MainTabs() {
    return (
        <Tab.Navigator 
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'IPO') iconName = focused ? 'calendar' : 'calendar-outline';
                    else if (route.name === 'GMP') iconName = focused ? 'trending-up' : 'trending-up-outline';
                    else if (route.name === 'Buyback') iconName = focused ? 'cash' : 'cash-outline';
                    else if (route.name === 'Portfolio') iconName = focused ? 'pie-chart' : 'pie-chart-outline';

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 60,
                    backgroundColor: '#fff',
                    borderTopColor: theme.colors.border,
                }
            })}
        >
            <Tab.Screen name="Dashboard" component={HomeScreen} />
            <Tab.Screen name="IPO" component={IPOListScreen} />
            <Tab.Screen name="GMP" component={GMPListScreen} />
            <Tab.Screen name="Portfolio" component={PortfolioNavigator} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome">
                    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                    <Stack.Screen 
                        name="IPODetail" 
                        component={IPODetailScreen} 
                        options={{ 
                            title: 'IPO Details',
                            headerStyle: { backgroundColor: theme.colors.background }, // Updated to dark theme
                            headerTintColor: theme.colors.text,
                            headerTitleStyle: { color: theme.colors.text },
                        }} 
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
}
