import { Tabs } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { ColorValue, StyleSheet, Text, View } from "react-native";

function TabIcon({
  name,
  label,
  color,
  size,
  focused,
  activeColor,
}: {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
  color: ColorValue;
  size: number;
  focused: boolean;
  activeColor: ColorValue;
}) {
  return (
    <View
      style={[
        styles.tabItem,
        focused && { borderTopColor: activeColor },
      ]}
    >
      <Ionicons name={name} size={size} color={color} />
      <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default function NurseTabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.rthPrimary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.rthCardBackground,
          borderTopColor: theme.rthBorder,
        },
        headerStyle: {
          backgroundColor: theme.rthBackground,
        },
        headerTitleStyle: {
          color: theme.text,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="stats-chart"
              label="Dashboard"
              color={color}
              size={size}
              focused={focused}
              activeColor={theme.rthPrimary}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="responses"
        options={{
          title: "Data",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="list"
              label="Responden"
              color={color}
              size={size}
              focused={focused}
              activeColor={theme.rthPrimary}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: "Laporan",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="document-text"
              label="Laporan"
              color={color}
              size={size}
              focused={focused}
              activeColor={theme.rthPrimary}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="person"
              label="Profil"
              color={color}
              size={size}
              focused={focused}
              activeColor={theme.rthPrimary}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: "transparent",
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
});
