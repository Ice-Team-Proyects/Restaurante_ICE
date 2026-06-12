// c:/neww/Restaurante_ICE/client-user/src/features/fields/screens/FieldDetailScreen.jsx
import React from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme.js";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Card } from "../../../shared/components/common/Common.jsx";
import { MaterialIcons } from "@expo/vector-icons";

export default function FieldDetailScreen({ route, navigation }) {
  const { field } = route.params || {};

  if (!field) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la información del área.</Text>
        <Button title="Volver" type="primary" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Image source={{ uri: field.image }} style={styles.image} />

      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{field.name}</Text>
        <Text style={styles.location}>{field.location}</Text>

        <View style={styles.statusRow}>
          <MaterialIcons
            name={field.isAvailable ? "check-circle" : "cancel"}
            size={24}
            color={field.isAvailable ? COLORS.success : COLORS.error}
          />
          <Text style={[styles.statusText, { color: field.isAvailable ? COLORS.success : COLORS.error }]}>
            {field.isAvailable ? "Disponible ahora" : "Ocupado / En mantenimiento"}
          </Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>
            Disfruta de nuestras instalaciones exclusivas. Reservando esta área podrás gozar de una excelente experiencia recreativa en Restaurante ICE, combinando la mejor cocina con actividades recreativas ideales para compartir en familia y amigos.
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Normas de Uso</Text>
          <View style={styles.bulletRow}>
            <MaterialIcons name="chevron-right" size={18} color={COLORS.primary} />
            <Text style={styles.bulletText}>Uso exclusivo para comensales del restaurante.</Text>
          </View>
          <View style={styles.bulletRow}>
            <MaterialIcons name="chevron-right" size={18} color={COLORS.primary} />
            <Text style={styles.bulletText}>Reservación obligatoria con anticipación.</Text>
          </View>
          <View style={styles.bulletRow}>
            <MaterialIcons name="chevron-right" size={18} color={COLORS.primary} />
            <Text style={styles.bulletText}>Se solicita puntualidad para respetar los bloques horarios.</Text>
          </View>
        </Card>

        <Button
          title="Reservar Esta Instalación"
          type="primary"
          onPress={() => navigation.navigate("CreateReservation", { fieldId: field.id, fieldName: field.name })}
          disabled={!field.isAvailable}
          style={styles.reserveBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  image: {
    width: "100%",
    height: 250,
    backgroundColor: COLORS.secondary,
  },
  detailsContainer: {
    padding: SPACING.lg,
    marginTop: -SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  name: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  location: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  statusText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    marginLeft: SPACING.xs,
  },
  card: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  bulletText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginLeft: 4,
    flex: 1,
  },
  reserveBtn: {
    marginTop: SPACING.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
});
