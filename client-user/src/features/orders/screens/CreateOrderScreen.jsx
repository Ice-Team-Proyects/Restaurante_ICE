// c:/neww/Restaurante_ICE/client-user/src/features/orders/screens/CreateOrderScreen.jsx
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useCartStore } from "../../../shared/store/cartStore.js";
import { useOrders } from "../hooks/useOrders.js";
import { userClient } from "../../../shared/api/userClient.js";
import { Card, LoadingSpinner, GlassBackground } from "../../../shared/components/common/Common.jsx";
import { Button } from "../../../shared/components/common/Button.jsx";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";

export default function CreateOrderScreen({ navigation }) {
  const { items, updateQuantity, removeItem, clearCart, getTotalAmount } = useCartStore();
  const { placeOrder, loading } = useOrders();
  
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [tablesLoading, setTablesLoading] = useState(false);

  useEffect(() => {
    const fetchTables = async () => {
      setTablesLoading(true);
      try {
        const response = await userClient.get("/table");
        const data = response.data?.data || response.data || [];
        // Filtrar mesas disponibles
        const available = data.filter((t) => t.isActive !== false);
        setTables(available);
        if (available.length > 0) {
          setSelectedTableId(available[0]._id);
        }
      } catch (err) {
        console.error("Error al obtener mesas:", err);
      } finally {
        setTablesLoading(false);
      }
    };
    fetchTables();
  }, []);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert("Carrito Vacío", "No tienes platillos en tu pedido.");
      return;
    }
    if (!selectedTableId) {
      Alert.alert("Selecciona Mesa", "Por favor selecciona una mesa antes de realizar el pedido.");
      return;
    }

    const res = await placeOrder(selectedTableId, items);
    if (res.success) {
      clearCart();
      Alert.alert(
        "Pedido Realizado",
        "Tu pedido ha sido enviado a la cocina. Puedes seguir su estado desde 'Mis Pedidos'.",
        [
          {
            text: "Aceptar",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "OrdersList" }],
              });
            },
          },
        ]
      );
    } else {
      Alert.alert("Error al Enviar Pedido", res.error);
    }
  };

  const renderCartItem = ({ item }) => {
    return (
      <Card style={styles.cartCard}>
        <View style={styles.cartHeader}>
          <Text style={styles.itemName}>{item.product.saucer}</Text>
          <TouchableOpacity onPress={() => removeItem(item.product._id)}>
            <MaterialIcons name="delete" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cartFooter}>
          <Text style={styles.itemPrice}>Q{item.product.price} c/u</Text>
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => updateQuantity(item.product._id, item.quantity - 1)}
            >
              <MaterialIcons name="remove" size={16} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.stepperVal}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => updateQuantity(item.product._id, item.quantity + 1)}
            >
              <MaterialIcons name="add" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  if (tablesLoading || loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <GlassBackground style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="shopping-basket" size={64} color={COLORS.secondary} />
          <Text style={styles.emptyTitle}>Pedido Vacío</Text>
          <Text style={styles.emptyDesc}>Agrega deliciosos platillos desde la carta del menú para empezar.</Text>
          <Button
            title="Ir al Menú"
            type="primary"
            onPress={() => navigation.navigate("MenuList")}

            style={styles.menuBtn}
          />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product._id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContent}
          />

          {/* Table Selector */}
          <Card style={styles.checkoutCard}>
            <Text style={styles.sectionTitle}>Selecciona tu Mesa</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableScroll}>
              {tables.map((t) => (
                <TouchableOpacity
                  key={t._id}
                  style={[
                    styles.tablePill,
                    selectedTableId === t._id ? styles.tablePillActive : null
                  ]}
                  onPress={() => setSelectedTableId(t._id)}
                >
                  <Text style={[
                    styles.tableText,
                    selectedTableId === t._id ? styles.tableTextActive : null
                  ]}>
                    Mesa {t.number}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalVal}>Q{getTotalAmount().toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Servicio:</Text>
              <Text style={styles.totalVal}>Gratis</Text>
            </View>
            <View style={[styles.row, { marginTop: SPACING.xs }]}>
              <Text style={styles.grandTotalLabel}>Total a Pagar:</Text>
              <Text style={styles.grandTotalVal}>Q{getTotalAmount().toFixed(2)}</Text>
            </View>

            <Button
              title="Realizar Pedido"
              type="primary"
              onPress={handlePlaceOrder}
              style={styles.placeBtn}
            />
          </Card>
        </View>
      )}
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptyDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  menuBtn: {
    width: 200,
    height: 48,
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.md,
  },
  cartCard: {
    marginBottom: SPACING.md,
    borderRadius: 16,
    padding: SPACING.md,
  },
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.text,
  },
  cartFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  itemPrice: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.primary,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  stepperVal: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
    color: COLORS.text,
    marginHorizontal: SPACING.sm,
  },
  checkoutCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderRadius: 0,
    padding: SPACING.lg,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#FCE8D9",
    ...SHADOWS.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  tableScroll: {
    marginBottom: SPACING.md,
  },
  tablePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCE8D9",
    marginRight: SPACING.sm,
    backgroundColor: "#FFFFFF",
  },
  tablePillActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(226, 92, 0, 0.08)",
  },
  tableText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  tableTextActive: {
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
  totalLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  totalVal: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: "600",
  },
  grandTotalLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.text,
  },
  grandTotalVal: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.primary,
  },
  placeBtn: {
    marginTop: SPACING.md,
    height: 48,
    borderRadius: 12,
  },
});
