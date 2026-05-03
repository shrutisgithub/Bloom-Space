import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { colors, spacing } from "../constants/theme";

export default function Signup() {
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = useCallback(async () => {
    try {
      await signup(email, password);
      router.replace("/drawer/home");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    }
  }, [email, password, signup]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Bloom Space</Text>

        <Card style={styles.card}>
          <AppInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <AppInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AppButton title="Sign Up" onPress={handleSignup} />

          <Text style={styles.link} onPress={() => router.push("/login")}>
            Already have an account?
          </Text>
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
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: colors.subtext,
    textAlign: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },

  card: {
    padding: spacing.lg,
  },

  link: {
    textAlign: "center",
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 13,
    fontWeight: "500",
  },
});