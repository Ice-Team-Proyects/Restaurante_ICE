// c:/neww/Restaurante_ICE/client-user/src/features/restaurant/screens/RestaurantListScreen.jsx
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, RefreshControl, Modal, Alert } from "react-native";
import { useRestaurant } from "../hooks/useRestaurant.js";
import { Card, LoadingSpinner, EmptyState, GlassBackground } from "../../../shared/components/common/Common.jsx";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Input } from "../../../shared/components/common/Input.jsx";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";
import { getImageUrl } from "../../../shared/utils/cloudinary.js";

export default function RestaurantListScreen({ navigation }) {
  const { restaurants, loading, error, fetchRestaurants, createTable, isAdmin } = useRestaurant();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newCapacity, setNewCapacity] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleAddTable = async () => {
    if (!newNumber || !newCapacity) {
      Alert.alert("Campos requeridos", "Por favor ingresa número de mesa y capacidad.");
      return;
    }
    const res = await createTable({ number: newNumber, capacity: newCapacity });
    if (res.success) {
      setNewNumber("");
      setNewCapacity("");
      setShowAddForm(false);
      Alert.alert("Mesa Creada", `Mesa #${newNumber} creada exitosamente.`);
    } else {
      Alert.alert("Error", res.error);
    }
  };

  const renderItem = ({ item }) => {
    if (isAdmin) {
      // ADMIN: Muestra mesa
      const isAvailable = String(item.status).toLowerCase() === "disponible";
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("RestaurantDetail", { item })}
        >
          <Card style={styles.tableCard}>
            <View style={styles.tableInfo}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableName}>Mesa #{item.number}</Text>
                <View style={[styles.badge, isAvailable ? styles.badgeAvailable : styles.badgeUnavailable]}>
                  <Text style={styles.badgeText}>
                    {item.status ? item.status.toUpperCase() : "DISPONIBLE"}
                  </Text>
                </View>
              </View>
              <Text style={styles.tableDetails}>Capacidad: {item.capacity} personas</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.primary} />
          </Card>
        </TouchableOpacity>
      );
    } else {
      // CUSTOMER: Muestra sucursal
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("RestaurantDetail", { item })}
        >
          <Card style={styles.branchCard}>
            <Image
              source={{ uri: getImageUrl(item.photo) }}
              style={styles.branchImage}
            />
            <View style={styles.branchContent}>
              <Text style={styles.branchName}>{item.name}</Text>
              <Text style={styles.branchHours}>🕒 {item.openingHours || "8:00 - 22:00"}</Text>
              <Text style={styles.branchAddress} numberOfLines={1}>📍 {item.address}</Text>
            </View>
          </Card>
        </TouchableOpacity>
      );
    }
  };

  if (loading && restaurants.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <GlassBackground style={styles.container}>

      {isAdmin && (
        <View style={styles.headerBar}>
          <Text style={styles.barTitle}>Panel de Mesas</Text>
          <Button
            title="Nueva Mesa"
            type="primary"
            onPress={() => setShowAddForm(true)}
            style={styles.addBtn}
          />
        </View>
      )}

      {/* FORMULARIO CREAR MESA (MODAL) */}
      <Modal visible={showAddForm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <Text style={styles.modalTitle}>Agregar Nueva Mesa</Text>
            <Input
              label="Número de Mesa"
              placeholder="Ej. 12"
              value={newNumber}
              onChangeText={setNewNumber}
              keyboardType="numeric"
            />
            <Input
              label="Capacidad (Personas)"
              placeholder="Ej. 4"
              value={newCapacity}
              onChangeText={setNewCapacity}
              keyboardType="numeric"
            />
            <View style={styles.modalBtnRow}>
              <Button
                title="Cancelar"
                type="secondary"
                onPress={() => setShowAddForm(false)}
                style={styles.modalBtn}
              />
              <Button
                title="Crear"
                type="primary"
                onPress={handleAddTable}
                style={styles.modalBtn}
              />
            </View>
          </Card>
        </View>
      </Modal>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id || item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchRestaurants}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="restaurant"
            title={isAdmin ? "No hay mesas registradas" : "No hay sucursales disponibles"}
            description={isAdmin ? "Crea una nueva mesa con el botón superior." : "Intenta recargar más tarde."}
            actionTitle="Actualizar"
            onActionPress={fetchRestaurants}
          />
        }
      />
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
    ...SHADOWS.sm,
  },
  barTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.text,
  },
  addBtn: {
    height: 38,
    paddingHorizontal: SPACING.md,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  tableCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  tableInfo: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  tableName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  tableDetails: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeAvailable: {
    backgroundColor: "#D1FAE5",
  },
  badgeUnavailable: {
    backgroundColor: "#FEE2E2",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.text,
  },
  branchCard: {
    padding: 0,
    overflow: "hidden",
    borderRadius: 16,
    marginBottom: SPACING.md,
  },
  branchImage: {
    width: "100%",
    height: 160,
  },
  branchContent: {
    padding: SPACING.md,
  },
  branchName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  branchHours: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 2,
  },
  branchAddress: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  modalBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  modalBtn: {
    flex: 0.48,
    height: 45,
  },
});
