// c:/neww/Restaurante_ICE/client-user/src/shared/components/common/Input.jsx
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE } from "../../constants/theme.js";

export const Input = ({
  label,
  error,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const containerStyles = [styles.container, style];
  
  const textInputStyles = [
    styles.input,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    inputStyle,
  ];

  return (
    <View style={containerStyles}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        style={textInputStyles}
        placeholderTextColor={COLORS.secondary}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    width: "100%",
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#FCE8D9", // Soft pastel peach border
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    backgroundColor: "#FFFFFF", // Clean solid white background
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontWeight: "500",
  },
});
