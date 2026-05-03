import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Card from "../../components/Card";
import { colors, spacing } from "../../constants/theme";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const value = await AsyncStorage.getItem("notifications");

    if (value !== null) {
      setNotificationsEnabled(JSON.parse(value));
    }
  };

  const toggleSwitch = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await AsyncStorage.setItem("notifications", JSON.stringify(newValue));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage app preferences</Text>

        <Card style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingSubtitle}>Save preference locally</Text>
          </View>

          <Switch
            value={notificationsEnabled}
            onValueChange={toggleSwitch}
            trackColor={{ false: colors.border, true: "#D1FAE5" }}
            thumbColor={notificationsEnabled ? colors.green : colors.white}
          />
        </Card>

        <Card>
          <Text style={styles.label}>Theme</Text>
          <Text style={styles.value}>Minimal Light UI</Text>
        </Card>

        <Card>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>Campus Companion v1.0</Text>
        </Card>
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

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  settingTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },

  settingSubtitle: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing.xs,
  },

  label: {
    color: colors.subtext,
    fontSize: 12,
  },

  value: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
});