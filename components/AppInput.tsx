import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

function AppInput(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.subtext}
      style={[styles.input, props.style]}
      {...props}
    />
  );
}

export default React.memo(AppInput);

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.sm,
  },
});