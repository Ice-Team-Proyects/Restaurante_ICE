// c:/neww/Restaurante_ICE/client-user/src/features/events/screens/EventsListScreen.jsx
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl, SegmentedControlIOS, Platform } from "react-native";
import { useEvents } from "../hooks/useEvents.js";
import { Card, LoadingSpinner, EmptyState, GlassBackground } from "../../../shared/components/common/Common.jsx";
import { Button } from "../../../shared/components/common/Button.jsx";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";

export default function EventsListScreen({ navigation }) {
  const { events, inscriptions, loading, fetchEvents, fetchInscriptions, isAdmin } = useEvents();
  const [activeTab, setActiveTab] = useState("available"); // "available" or "registered"

  useEffect(() => {
    fetchEvents();
    fetchInscriptions();
  }, [fetchEvents, fetchInscriptions]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderEventItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("EventDetail", { event: item })}
      >
        <Card style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventName}>{item.name_event}</Text>
            <Text style={styles.eventPrice}>${item.price}</Text>
          </View>

          <Text style={styles.eventDesc} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.eventDetailsRow}>
            <View style={styles.detailItem}>
              <MaterialIcons name="event" size={16} color={COLORS.primary} />
              <Text style={styles.detailText}>{formatDate(item.date_event)}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="people" size={16} color={COLORS.primary} />
              <Text style={styles.detailText}>Cupo: {item.capacity} personas</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="place" size={16} color={COLORS.primary} />
              <Text style={styles.detailText}>{item.location}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderInscriptionItem = ({ item }) => {
    const eventName = item.id_event?.name_event || "Evento Especial";
    const eventLocation = item.id_event?.location || "Restaurante ICE";
    const date = item.id_event?.date_event ? formatDate(item.id_event.date_event) : "Fecha programada";

    return (
      <Card style={styles.inscriptionCard}>
        <View style={styles.eventHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eventName}>{eventName}</Text>
            <Text style={styles.detailText}>📍 {eventLocation}</Text>
            <Text style={styles.detailText}>📅 {date}</Text>
          </View>
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityBadgeText}>{item.number_people} Asistentes</Text>
          </View>
        </View>
        
        <View style={styles.orderDivider} />

        <View style={styles.inscriptionFooter}>
          <Text style={styles.customerName}>Registrado a: {item.name_customer}</Text>
          <Text style={styles.statusLabel}>Confirmada</Text>
        </View>
      </Card>
    );
  };

  if (loading && events.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <GlassBackground style={styles.container}>

      {/* HEADER BAR */}
      <View style={styles.headerBar}>
        <Text style={styles.barTitle}>Eventos y Experiencias</Text>
        {isAdmin && (
          <Button
            title="Crear Evento"
            type="primary"
            onPress={() => navigation.navigate("CreateEvent")}
            style={styles.addBtn}
          />
        )}
      </View>

      {/* TABS (For customers) */}
      {!isAdmin && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "available" ? styles.tabBtnActive : null]}
            onPress={() => setActiveTab("available")}
          >
            <Text style={[styles.tabText, activeTab === "available" ? styles.tabTextActive : null]}>
              Disponibles
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "registered" ? styles.tabBtnActive : null]}
            onPress={() => setActiveTab("registered")}
          >
            <Text style={[styles.tabText, activeTab === "registered" ? styles.tabTextActive : null]}>
              Mis Eventos
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CONTENT LIST */}
      {isAdmin || activeTab === "available" ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderEventItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchEvents}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="event-note"
              title="Sin Eventos"
              description="No hay eventos especiales programados en este momento."
              actionTitle="Actualizar"
              onActionPress={fetchEvents}
            />
          }
        />
      ) : (
        <FlatList
          data={inscriptions}
          keyExtractor={(item) => item._id}
          renderItem={renderInscriptionItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchInscriptions}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="bookmark-border"
              title="Sin Registros"
              description="Aún no te has inscrito en ningún evento gastronómico."
              actionTitle="Ver Disponibles"
              onActionPress={() => setActiveTab("available")}
            />
          }
        />
      )}
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    justifyContent: "space-between",
  },
  tabBtn: {
    flex: 0.48,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  tabBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(226, 92, 0, 0.08)",
  },
  tabText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  eventCard: {
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  eventName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  eventPrice: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.primary,
  },
  eventDesc: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  eventDetailsRow: {
    gap: 6,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  inscriptionCard: {
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  quantityBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quantityBadgeText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: "800",
  },
  orderDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  inscriptionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerName: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.text,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.success,
    textTransform: "uppercase",
  },
});
