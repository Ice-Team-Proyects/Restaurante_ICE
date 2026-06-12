// c:/neww/Restaurante_ICE/client-user/src/shared/components/common/Common.jsx
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../constants/theme.js";
import { Button } from "./Button.jsx";

export const LoadingSpinner = ({ fullScreen = false, color = COLORS.primary, size = "large" }) => {
  return (
    <View style={[styles.spinnerContainer, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export const EmptyState = ({
  icon = "info-outline",
  title = "No hay datos disponibles",
  description = "No pudimos encontrar lo que buscabas.",
  actionTitle,
  onActionPress,
}) => {
  return (
    <View style={styles.emptyContainer}>
      <MaterialIcons name={icon} size={64} color={COLORS.secondary} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
      {actionTitle && onActionPress && (
        <Button
          title={actionTitle}
          onPress={onActionPress}
          type="secondary"
          style={styles.emptyButton}
        />
      )}
    </View>
  );
};

export const Card = ({ children, style, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    padding: SPACING.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreen: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(248, 250, 252, 0.7)",
    zIndex: 999,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptyDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  emptyButton: {
    marginTop: SPACING.sm,
    height: 44,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: "#FCE8D9", // Soft pastel peach border
    shadowColor: "#E25C00", // Soft tasty orange tint shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: SPACING.md,
  },
});

export const GlassBackground = ({ children, style }) => {
  return (
    <View style={[bgStyles.bgContainer, style]}>
      {/* Soft Pastel Orange Background Glows */}
      <View style={[bgStyles.sphere, bgStyles.glow1]} />
      <View style={[bgStyles.sphere, bgStyles.glow2]} />
      {children}
    </View>
  );
};

const bgStyles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    backgroundColor: COLORS.background, // Soft warm apricot cream (#FFF5EC)
  },
  sphere: {
    position: "absolute",
    borderRadius: 999,
  },
  glow1: {
    top: -100,
    right: -100,
    width: 350,
    height: 350,
    backgroundColor: "#FFE5D4", // Soft warm pastel orange
    opacity: 0.6,
  },
  glow2: {
    bottom: -150,
    left: -150,
    width: 450,
    height: 450,
    backgroundColor: "#FFF0E6", // Very soft pastel peach
    opacity: 0.8,
  },
});

