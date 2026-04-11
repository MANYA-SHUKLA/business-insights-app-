import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { LoginScreen } from "../screens/LoginScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { BusinessProfileScreen } from "../screens/BusinessProfileScreen";
import { ReviewsScreen } from "../screens/ReviewsScreen";
import { useAuth } from "../auth/AuthContext";
import { colors } from "../theme";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    border: colors.cardBorder,
    primary: colors.accent,
  },
};

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.cardBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: "stats-chart",
            Business: "storefront-outline",
            Reviews: "chatbubbles-outline",
          };
          const name = map[route.name] || "ellipse";
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Insights" }} />
      <Tabs.Screen name="Business" component={BusinessProfileScreen} options={{ title: "Profile" }} />
      <Tabs.Screen name="Reviews" component={ReviewsScreen} />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  const { token, bootstrapping } = useAuth();

  if (bootstrapping) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        {token == null ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
});
