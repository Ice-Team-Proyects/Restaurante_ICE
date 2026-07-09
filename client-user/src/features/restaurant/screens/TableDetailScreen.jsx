// c:/neww/Restaurante_ICE/client-user/src/features/restaurant/screens/TableDetailScreen.jsx
import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRestaurant } from "../hooks/useRestaurant.js";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Card, GlassBackground } from "../../../shared/components/common/Common.jsx";
import { Input } from "../../../shared/components/common/Input.jsx";
import { MaterialIcons } from "@expo/vector-icons";

export default function TableDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  const { updateTable, deleteTable, loading } = useRestaurant();

  // State variables for Admin table editing
  const [editMode, setEditMode] = useState(false);
  const [capacity, setCapacity] = useState(item?.capacity ? String(item.capacity) : "");
  const [status, setStatus] = useState(item?.status || "disponible");

  if (!item) {
    return (
      <GlassBackground style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo cargar la información de la mesa.</Text>
          <Button title="Volver" type="primary" onPress={() => navigation.goBack()} />
        </View>
      </GlassBackground>
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

  return (
    <GlassBackground style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
  name: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
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
    borderWidth: 1,
    borderColor: "#FCE8D9",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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
