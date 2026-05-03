import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { useAuth } from "../../context/AuthContext";
import AppButton from "../../components/AppButton";
import Card from "../../components/Card";
import { colors, spacing } from "../../constants/theme";

export default function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Your wellness account</Text>

        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || "S"}
            </Text>
          </View>

          <Text style={styles.name}>{user?.email?.split("@")[0]}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </Card>

        <AppButton title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
  },

  headerTitle: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "600",
  },

  headerSubtitle: {
    fontSize: 13,
    color: colors.subtext,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },

  profileCard: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  avatarText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "400",
  },

  name: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
  },

  email: {
    marginTop: spacing.xs,
    color: colors.subtext,
    fontSize: 13,
  },
});