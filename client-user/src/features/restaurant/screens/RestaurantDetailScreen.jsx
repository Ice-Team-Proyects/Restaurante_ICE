// c:/neww/Restaurante_ICE/client-user/src/features/restaurant/screens/RestaurantDetailScreen.jsx
import React from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { useRestaurant } from "../hooks/useRestaurant.js";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme.js";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Card, GlassBackground } from "../../../shared/components/common/Common.jsx";
import { MaterialIcons } from "@expo/vector-icons";
import { getImageUrl } from "../../../shared/utils/cloudinary.js";

export default function RestaurantDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  const { isAdmin } = useRestaurant();

  if (!item) {
    return (
      <GlassBackground style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo cargar la información de la sucursal.</Text>
          <Button title="Volver" type="primary" onPress={() => navigation.goBack()} />
        </View>
      </GlassBackground>
    );
  }

  return (
    <GlassBackground style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: getImageUrl(item.photo) }}
          style={styles.image}
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>📍 {item.address}</Text>

          <View style={styles.statusRow}>
            <MaterialIcons name="check-circle" size={24} color={COLORS.success} />
            <Text style={styles.statusText}>Abierto hoy: {item.openingHours || "8:00 - 22:00"}</Text>
          </View>

          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>
              {item.description || "Nuestra sucursal premium de Restaurante ICE. Disfruta de la mejor comida gourmet y un excelente servicio en un ambiente cálido e ideal para compartir con tus seres queridos."}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Contacto</Text>
            <View style={styles.bulletRow}>
              <MaterialIcons name="phone" size={18} color={COLORS.primary} />
              <Text style={styles.bulletText}>Teléfono: {item.phone || "55567890"}</Text>
            </View>
            <View style={styles.bulletRow}>
              <MaterialIcons name="schedule" size={18} color={COLORS.primary} />
              <Text style={styles.bulletText}>Horario: {item.openingHours || "8:00 - 22:00"}</Text>
            </View>
          </Card>

          {!isAdmin && (
            <Button
              title="Reservar Mesa en esta Sucursal"
              type="primary"
              onPress={() => navigation.navigate("CreateReservation", { fieldId: item._id, fieldName: `Mesa en ${item.name}` })}
              style={styles.reserveBtn}
            />
          )}
        </View>
      </ScrollView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  image: {
    width: "100%",
    height: 220,
    backgroundColor: COLORS.secondary,
  },
  detailsContainer: {
    padding: SPACING.lg,
    marginTop: -SPACING.lg,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: "#FCE8D9",
    borderBottomWidth: 0,
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
    color: COLORS.success,
    marginLeft: SPACING.xs,
  },
  card: {
    marginBottom: SPACING.md,
    borderRadius: 16,
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
    marginBottom: SPACING.sm,
  },
  bulletText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    marginLeft: 8,
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
