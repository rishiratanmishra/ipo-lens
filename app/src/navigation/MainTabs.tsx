import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

import HomeScreen from "../screens/HomeScreen";
import GMPListScreen from "../screens/GMPListScreen";
import BuybackListScreen from "../screens/BuybackListScreen";
import PortfolioScreen from "../screens/PortfolioScreen";
import GuestPortfolioScreen from "../screens/GuestPortfolioScreen";

export type MainTabParamList = {
  Dashboard: undefined;
  Portfolio: undefined;
  GMP: undefined;
  Buyback: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcon = (route: string, focused: boolean) => {
  const icons: Record<string, { active: string; inactive: string }> = {
    Dashboard: { active: "home", inactive: "home-outline" },
    Portfolio: { active: "briefcase", inactive: "briefcase-outline" },
    GMP: { active: "trending-up", inactive: "trending-up" },
    Buyback: { active: "repeat", inactive: "repeat" },
  };

  return focused
    ? icons[route]?.active ?? "ellipse"
    : icons[route]?.inactive ?? "ellipse-outline";
};

export default function MainTabs() {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);

  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={TabIcon(route.name, focused) as any}
            size={24}
            color={color}
          />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 0, // Remove Android shadow for cleaner look
          shadowOpacity: 0, // Remove iOS shadow
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 10,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="GMP" component={GMPListScreen} />
      <Tab.Screen name="Buyback" component={BuybackListScreen} />
      <Tab.Screen
        name="Portfolio"
        component={user ? PortfolioScreen : GuestPortfolioScreen}
      />
    </Tab.Navigator>
  );
}
