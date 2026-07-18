// c:/neww/Restaurante_ICE/client-user/src/shared/components/common/Button.jsx
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../constants/theme.js";

export const Button = ({
  title,
  onPress,
  type = "primary",
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const isPrimary = type === "primary";
  const buttonStyles = [
    styles.button,
    isPrimary ? styles.primaryButton : styles.secondaryButton,
    (disabled || loading) && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    isPrimary ? styles.primaryText : styles.secondaryText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={buttonStyles}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? COLORS.surface : COLORS.primary}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
    ...SHADOWS.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.primary, // Solid Tasty Orange (#E25C00)
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: "#FFEBE0", // Soft pastel peach button background
    borderWidth: 1,
    borderColor: "#FADCC8",
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: "rgba(124, 139, 161, 0.3)",
    borderColor: "rgba(124, 139, 161, 0.2)",
  },
  text: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    textAlign: "center",
  },
  primaryText: {
    color: COLORS.surface,
  },
  secondaryText: {
    color: COLORS.primary,
  },
});
