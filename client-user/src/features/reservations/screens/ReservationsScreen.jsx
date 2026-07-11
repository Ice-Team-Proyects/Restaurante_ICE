// c:/neww/Restaurante_ICE/client-user/src/features/reservations/screens/ReservationsScreen.jsx
import React from "react";
import { StyleSheet, Text, View, FlatList, Image, RefreshControl, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useReservations } from "../hooks/useReservations.js";
import { Card, LoadingSpinner, EmptyState, GlassBackground } from "../../../shared/components/common/Common.jsx";
import { Button } from "../../../shared/components/common/Button.jsx";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";

export default function ReservationsScreen({ navigation }) {
  const { reservations, loading, error, fetchReservations, cancelReservation } = useReservations();

  useFocusEffect(
    React.useCallback(() => {
      fetchReservations();
    }, [fetchReservations])
  );

  const handleCancel = (id) => {
    Alert.alert(
      "Cancelar Reservación",
      "¿Está seguro de que desea cancelar esta reservación? Esta acción no se puede deshacer.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, Cancelar",
          style: "destructive",
          onPress: async () => {
            const result = await cancelReservation(id);
            if (result.success) {
              Alert.alert("Reservación Cancelada", "La reservación se ha cancelado con éxito.");
            }
          },
        },
      ]
    );
  };

  const renderReservationItem = ({ item }) => {
    const isConfirmed = item.normalizedStatus === "CONFIRMADA";

    return (
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.field.image }} style={styles.fieldImage} />
          <View style={styles.headerInfo}>
            <Text style={styles.tableName} numberOfLines={1}>
              {item.field.name}
            </Text>
            <View style={[styles.badge, isConfirmed ? styles.badgeActive : styles.badgeCanceled]}>
              <Text style={styles.badgeText}>{item.normalizedStatus}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <MaterialIcons name="event" size={16} color={COLORS.secondary} />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="schedule" size={16} color={COLORS.secondary} />
            <Text style={styles.detailText}>{item.time} hrs</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="people" size={16} color={COLORS.secondary} />
            <Text style={styles.detailText}>{item.people} pers</Text>
          </View>
        </View>

        {isConfirmed && (
          <Button
            title="Cancelar Reserva"
            type="secondary"
            onPress={() => handleCancel(item.id)}
            style={styles.cancelBtn}
          />
        )}
      </Card>
    );
  };

  if (loading && reservations.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <GlassBackground style={styles.container}>

      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={renderReservationItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchReservations}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="event-busy"
            title="Sin Reservas"
            description="Aún no tienes reservaciones registradas en tu historial."
            actionTitle="Hacer una Reserva"
            onActionPress={() => navigation.navigate("RestaurantTab")}
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
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  card: {
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  fieldImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
  },
  headerInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: "center",
  },
  tableName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeActive: {
    backgroundColor: "#D1FAE5",
  },
  badgeCanceled: {
    backgroundColor: "#FEE2E2",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginLeft: 4,
    fontWeight: "500",
  },
  cancelBtn: {
    marginTop: SPACING.sm,
    borderColor: COLORS.error,
    height: 40,
  },
});
