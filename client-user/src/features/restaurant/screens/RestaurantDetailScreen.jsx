// c:/neww/Restaurante_ICE/client-user/src/features/restaurant/screens/RestaurantDetailScreen.jsx
import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRestaurant } from "../hooks/useRestaurant.js";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Card } from "../../../shared/components/common/Common.jsx";
import { Input } from "../../../shared/components/common/Input.jsx";
import { MaterialIcons } from "@expo/vector-icons";
import { getImageUrl } from "../../../shared/utils/cloudinary.js";

export default function RestaurantDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  const { updateTable, deleteTable, isAdmin, loading } = useRestaurant();

  // State variables for Admin table editing
  const [editMode, setEditMode] = useState(false);
  const [capacity, setCapacity] = useState(item?.capacity ? String(item.capacity) : "");
  const [status, setStatus] = useState(item?.status || "disponible");

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la información.</Text>
        <Button title="Volver" type="primary" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleUpdate = async () => {
    if (!capacity) {
      Alert.alert("Error", "La capacidad es requerida");
      return;
    }
    const res = await updateTable(item._id, {
      capacity: parseInt(capacity),
      status: status
    });
    if (res.success) {
      setEditMode(false);
      Alert.alert("Actualizado", "Mesa actualizada exitosamente.");
      navigation.goBack();
    } else {
      Alert.alert("Error", res.error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Mesa",
      `¿Estás seguro de que deseas eliminar la Mesa #${item.number}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const res = await deleteTable(item._id);
            if (res.success) {
              Alert.alert("Eliminada", "La mesa se eliminó de la base de datos.");
              navigation.goBack();
            } else {
              Alert.alert("Error", res.error);
            }
          }
        }
      ]
    );
  };

  if (isAdmin) {
    // VISTA DE ADMINISTRADOR: Detalle y edición de Mesa
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.detailCard}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>Mesa #{item.number}</Text>
            {!editMode && (
              <TouchableOpacity onPress={() => setEditMode(true)}>
                <MaterialIcons name="edit" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>

          {editMode ? (
            <View style={styles.editForm}>
              <Input
                label="Capacidad (Personas)"
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="numeric"
              />
              <Text style={styles.selectLabel}>Estado de la Mesa</Text>
              <View style={styles.statusSelectRow}>
                {["disponible", "ocupada", "mantenimiento"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.statusSelectBtn,
                      status === s ? styles.statusSelectBtnActive : null
                    ]}
                    onPress={() => setStatus(s)}
                  >
                    <Text style={[
                      styles.statusSelectText,
                      status === s ? styles.statusSelectTextActive : null
                    ]}>
                      {s.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.btnRow}>
                <Button
                  title="Cancelar"
                  type="secondary"
                  onPress={() => {
                    setEditMode(false);
                    setCapacity(String(item.capacity));
                    setStatus(item.status);
                  }}
                  style={styles.formBtn}
                />
                <Button
                  title="Guardar"
                  type="primary"
                  loading={loading}
                  onPress={handleUpdate}
                  style={styles.formBtn}
                />
              </View>
            </View>
          ) : (
            <View style={styles.readOnlyView}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Capacidad:</Text>
                <Text style={styles.infoValue}>{item.capacity} personas</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estado:</Text>
                <Text style={[styles.infoValue, { color: status === "disponible" ? COLORS.success : COLORS.error }]}>
                  {status.toUpperCase()}
                </Text>
              </View>

              <Button
                title="Eliminar Mesa"
                type="secondary"
                onPress={handleDelete}
                style={styles.deleteBtn}
              />
            </View>
          )}
        </Card>
      </ScrollView>
    );
  }

  // VISTA DE CLIENTE: Detalles de Sucursal
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
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

        <Button
          title="Reservar Mesa en esta Sucursal"
          type="primary"
          onPress={() => navigation.navigate("CreateReservation", { fieldId: item._id, fieldName: `Mesa en ${item.name}` })}
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
    height: 220,
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
  // ADMIN Styles
  detailCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.md,
  },
  editForm: {
    marginTop: SPACING.sm,
  },
  selectLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  statusSelectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  statusSelectBtn: {
    flex: 0.31,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  statusSelectBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(226, 92, 0, 0.08)",
  },
  statusSelectText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  statusSelectTextActive: {
    color: COLORS.primary,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  formBtn: {
    flex: 0.48,
    height: 45,
  },
  readOnlyView: {
    marginTop: SPACING.sm,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  deleteBtn: {
    marginTop: SPACING.xl,
    borderColor: COLORS.error,
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
});
