// c:/neww/Restaurante_ICE/client-user/src/features/restaurant/screens/TableListScreen.jsx
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl, Modal, Alert } from "react-native";
import { useRestaurant } from "../hooks/useRestaurant.js";
import { Card, LoadingSpinner, EmptyState, GlassBackground } from "../../../shared/components/common/Common.jsx";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Input } from "../../../shared/components/common/Input.jsx";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";

export default function TableListScreen({ navigation }) {
  const { tables, loading, error, fetchTables, createTable } = useRestaurant();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newCapacity, setNewCapacity] = useState("");

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

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
    const isAvailable = String(item.status).toLowerCase() === "disponible";
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("TableDetail", { item })}
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
  };

  if (loading && tables.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <GlassBackground style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.barTitle}>Panel de Mesas</Text>
        <Button
          title="Nueva Mesa"
          type="primary"
          onPress={() => setShowAddForm(true)}
          style={styles.addBtn}
        />
      </View>

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
        data={tables}
        keyExtractor={(item) => item._id || item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchTables}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="restaurant"
            title="No hay mesas registradas"
            description="Crea una nueva mesa con el botón superior."
            actionTitle="Actualizar"
            onActionPress={fetchTables}
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
    borderBottomColor: "#F5E2D0", // Soft pastel peach border
    backgroundColor: "#FFFFFF", // Clean solid white header
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
    paddingBottom: 90,
  },
  tableCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FCE8D9",
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
