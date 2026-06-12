// c:/neww/Restaurante_ICE/client-user/src/features/orders/screens/OrdersListScreen.jsx
import React from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useOrders } from "../hooks/useOrders.js";
import { Card, LoadingSpinner, EmptyState, GlassBackground } from "../../../shared/components/common/Common.jsx";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";

export default function OrdersListScreen({ navigation }) {
  const { orders, loading, error, fetchOrders, updateOrderStatus, isAdmin } = useOrders();

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  const handleStatusChange = async (orderId, newStatus) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      Alert.alert("Pedido Actualizado", `El pedido ahora está en estado: ${newStatus}`);
    } else {
      Alert.alert("Error", res.error);
    }
  };

  const getStatusColor = (status) => {
    switch (String(status).toUpperCase()) {
      case "PENDING":
        return COLORS.warning;
      case "PREPARING":
        return COLORS.primary;
      case "READY":
        return COLORS.success;
      case "DELIVERED":
        return COLORS.secondary;
      case "CANCELLED":
        return COLORS.error;
      default:
        return COLORS.textLight;
    }
  };

  const renderOrderItem = ({ item }) => {
    const totalAmount = item.totalAmount || 0;
    const itemsCount = item.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0;
    const statusColor = getStatusColor(item.status);

    return (
      <Card style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderIdText}>Pedido #{String(item._id).substring(18)}</Text>
            <Text style={styles.tableLabel}>Mesa: {item.tableId?.number ? `Mesa #${item.tableId.number}` : "General"}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: statusColor + "15" }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>
              {item.status || "PENDIENTE"}
            </Text>
          </View>
        </View>

        <View style={styles.orderDivider} />

        <View style={styles.orderFooter}>
          <Text style={styles.footerDetails}>{itemsCount} {itemsCount === 1 ? "platillo" : "platillos"}</Text>
          <Text style={styles.orderTotal}>Total: Q{totalAmount}</Text>
        </View>

        {/* ADMIN Preparation Workflow Actions */}
        {isAdmin && (
          <View style={styles.adminActionRow}>
            {item.status === "PENDING" && (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}
                onPress={() => handleStatusChange(item._id, "PREPARING")}
              >
                <MaterialIcons name="restaurant" size={16} color="#FFF" />
                <Text style={styles.actionBtnText}>Preparar</Text>
              </TouchableOpacity>
            )}

            {item.status === "PREPARING" && (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: COLORS.success }]}
                onPress={() => handleStatusChange(item._id, "READY")}
              >
                <MaterialIcons name="check-circle" size={16} color="#FFF" />
                <Text style={styles.actionBtnText}>Listo</Text>
              </TouchableOpacity>
            )}

            {item.status === "READY" && (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: COLORS.secondary }]}
                onPress={() => handleStatusChange(item._id, "DELIVERED")}
              >
                <MaterialIcons name="done-all" size={16} color="#FFF" />
                <Text style={styles.actionBtnText}>Entregar</Text>
              </TouchableOpacity>
            )}

            {item.status !== "DELIVERED" && item.status !== "CANCELLED" && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => {
                  Alert.alert(
                    "Cancelar Pedido",
                    "¿Estás seguro de que deseas cancelar este pedido?",
                    [
                      { text: "No", style: "cancel" },
                      {
                        text: "Sí, Cancelar",
                        style: "destructive",
                        onPress: () => handleStatusChange(item._id, "CANCELLED")
                      }
                    ]
                  );
                }}
              >
                <MaterialIcons name="cancel" size={16} color={COLORS.error} />
                <Text style={[styles.actionBtnText, { color: COLORS.error }]}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Card>
    );
  };

  if (loading && orders.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <GlassBackground style={styles.container}>

      {isAdmin && (
        <View style={styles.bar}>
          <Text style={styles.barText}>Monitor de Pedidos de Mesa</Text>
        </View>
      )}

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchOrders}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="shopping-bag"
            title="Sin pedidos"
            description={isAdmin ? "No hay pedidos de mesa activos." : "Aún no has realizado ningún pedido en Restaurante ICE."}
            actionTitle="Actualizar"
            onActionPress={fetchOrders}
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
  bar: {
    backgroundColor: "#FFFFFF", // Clean solid white header
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F5E2D0", // Soft pastel peach border
    alignItems: "center",
    ...SHADOWS.sm,
  },
  barText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.text,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 90,
  },
  orderCard: {
    marginBottom: SPACING.md,
    borderRadius: 16,
    padding: SPACING.md,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderIdText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.text,
  },
  tableLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: 2,
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  orderDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerDetails: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  orderTotal: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.text,
  },
  adminActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  cancelBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.error,
  },
});
