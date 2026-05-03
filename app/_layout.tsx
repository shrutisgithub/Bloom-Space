import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { SettingsProvider } from "../context/SettingsContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SettingsProvider>
    </AuthProvider>
  );
}