import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "../../constants/theme";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: "500",
          },
          drawerStyle: {
            backgroundColor: colors.background,
          },
          drawerActiveTintColor: colors.text,
          drawerInactiveTintColor: colors.subtext,
          drawerActiveBackgroundColor: colors.card,
          drawerLabelStyle: {
            fontSize: 14,
            fontWeight: "500",
          },
        }}
      >
        <Drawer.Screen name="home" options={{ title: "Habits" }} />
        <Drawer.Screen name="add-habit" options={{ title: "Add Habit" }} />
        <Drawer.Screen name="history" options={{ title: "History" }} />
        <Drawer.Screen name="profile" options={{ title: "Profile" }} />
        <Drawer.Screen name="settings" options={{ title: "Settings" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}