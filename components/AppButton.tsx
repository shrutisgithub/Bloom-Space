import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { colors, radius, spacing } from "../constants/theme";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
};

function AppButton({ title, onPress, loading = false }: AppButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

export default React.memo(AppButton);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.black,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  text: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "500",
  },
});