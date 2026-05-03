import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import Card from "../../components/Card";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { colors, spacing } from "../../constants/theme";

export default function AddHabit() {
  const { user } = useAuth();

  const [name, setName] = useState("");

  const handleAddHabit = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Enter habit name");
      return;
    }

    try {
      await addDoc(collection(db, "habits"), {
        name: name.trim(),
        userId: user?.uid,
        createdAt: serverTimestamp(),
      });

      setName("");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }, [name, user]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add Habit</Text>

        <Card>
          <AppInput
            placeholder="e.g. Drink Water"
            value={name}
            onChangeText={setName}
          />

          <AppButton title="Add Habit" onPress={handleAddHabit} />
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

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.md,
    color: colors.text,
  },
});