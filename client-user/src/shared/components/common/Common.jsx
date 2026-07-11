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
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
    marginBottom: SPACING.md,
  },
});

export const GlassBackground = ({ children, style }) => {
  return (
    <View style={[bgStyles.bgContainer, style]}>
      <View style={[bgStyles.sphere, bgStyles.sphereOrange]} />
      <View style={[bgStyles.sphere, bgStyles.sphereDeep]} />
      <View style={[bgStyles.sphere, bgStyles.sphereGold]} />
      <View style={[bgStyles.sphere, bgStyles.sphereRed]} />
      {children}
    </View>
  );
};

const bgStyles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sphere: {
    position: "absolute",
    borderRadius: 999,
  },
  sphereOrange: {
    top: -60,
    left: -40,
    width: 240,
    height: 240,
    backgroundColor: "#FF6D00",
    opacity: 0.08,
  },
  sphereDeep: {
    bottom: -60,
    right: -60,
    width: 280,
    height: 280,
    backgroundColor: "#E65100",
    opacity: 0.06,
  },
  sphereGold: {
    top: "32%",
    right: -80,
    width: 180,
    height: 180,
    backgroundColor: "#FFD54F",
    opacity: 0.1,
  },
  sphereRed: {
    bottom: "35%",
    left: -90,
    width: 200,
    height: 200,
    backgroundColor: "#FF3D00",
    opacity: 0.04,
  },
});

