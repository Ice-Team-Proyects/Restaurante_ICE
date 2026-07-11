// c:/neww/Restaurante_ICE/client-user/src/features/events/screens/EventDetailScreen.jsx
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Alert, FlatList, TouchableOpacity } from "react-native";
import { useEvents } from "../hooks/useEvents.js";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Card } from "../../../shared/components/common/Common.jsx";
import { Input } from "../../../shared/components/common/Input.jsx";
import { MaterialIcons } from "@expo/vector-icons";

export default function EventDetailScreen({ route, navigation }) {
  const { event } = route.params || {};
  const { registerForEvent, inscriptions, fetchInscriptions, promotions, fetchPromotions, isAdmin, loading } = useEvents();

  // Customer States
  const [numPeople, setNumPeople] = useState("2");
  const [selectedPromo, setSelectedPromo] = useState(null);

  useEffect(() => {
    fetchInscriptions();
    fetchPromotions();
  }, [fetchInscriptions, fetchPromotions]);

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

  const handleRegister = async () => {
    const people = parseInt(numPeople);
    if (isNaN(people) || people < 1 || people > 20) {
      Alert.alert("Error", "La cantidad de personas debe ser entre 1 y 20.");
      return;
    }

    const res = await registerForEvent(event._id, people, selectedPromo?._id || null);
    if (res.success) {
      Alert.alert(
        "Registro Exitoso",
        `Te has registrado exitosamente para: ${event.name_event}`,
        [{ text: "Aceptar", onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert("Error al Registrarse", res.error);
    }
  };

  // Filter attendees for this event (Admin)
  const eventAttendees = inscriptions.filter(
    (ins) => ins.id_event === event._id || ins.id_event?._id === event._id
  );

  const calculateTotalPrice = () => {
    const base = (event.price || 0) * (parseInt(numPeople) || 0);
    if (selectedPromo) {
      const discount = base * (selectedPromo.discount_percentage / 100);
      return Math.max(0, base - discount);
    }
    return base;
  };

  if (isAdmin) {
    // VISTA DE ADMINISTRADOR: Lista de asistentes/inscritos al evento
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Text style={styles.eventName}>{event.name_event}</Text>
          <Text style={styles.detailText}>📅 {formatDate(event.date_event)}</Text>
          <Text style={styles.detailText}>📍 {event.location}</Text>
          <Text style={styles.detailText}>👥 Capacidad Máxima: {event.capacity} personas</Text>
          <Text style={styles.detailText}>💵 Precio Base: ${event.price}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{event.description}</Text>
        </Card>

        <View style={styles.attendeesHeaderRow}>
          <Text style={styles.subTitle}>Lista de Asistentes ({eventAttendees.length})</Text>
        </View>

        {eventAttendees.length === 0 ? (
          <Card style={styles.card}>
            <Text style={styles.noAttendees}>No hay clientes inscritos en este evento todavía.</Text>
          </Card>
        ) : (
          eventAttendees.map((att) => (
            <Card key={att._id} style={styles.attendeeCard}>
              <View style={styles.attendeeHeader}>
                <Text style={styles.attendeeName}>{att.name_customer}</Text>
                <View style={styles.attendeeBadge}>
                  <Text style={styles.attendeeBadgeText}>{att.number_people} pzs</Text>
                </View>
              </View>
              <Text style={styles.attendeeInfo}>✉️ {att.email_customer}</Text>
              <Text style={styles.attendeeInfo}>📞 {att.phone_customer}</Text>
            </Card>
          ))
        )}
      </ScrollView>
    );
  }

  // VISTA DE CLIENTE: Detalles y formulario de registro
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Card style={styles.card}>
        <Text style={styles.eventName}>{event.name_event}</Text>
        <Text style={styles.priceTag}>Precio: ${event.price} por persona</Text>
        
        <View style={styles.infoRow}>
          <MaterialIcons name="event" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>{formatDate(event.date_event)}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="place" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="people" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>Cupo disponible: {event.capacity} personas</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Acerca de la Experiencia</Text>
        <Text style={styles.description}>{event.description}</Text>
      </Card>

      {/* Formulario de registro */}
      <Card style={styles.formCard}>
        <Text style={styles.formTitle}>Reservar Entradas</Text>
        
        <Input
          label="Cantidad de Personas"
          placeholder="Ej. 2"
          value={numPeople}
          onChangeText={setNumPeople}
          keyboardType="numeric"
        />

        {/* Promotions Selector */}
        {promotions.length > 0 && (
          <View style={styles.promoContainer}>
            <Text style={styles.promoLabel}>Aplicar Promoción Especial</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
              <TouchableOpacity
                style={[
                  styles.promoPill,
                  selectedPromo === null ? styles.promoPillActive : null
                ]}
                onPress={() => setSelectedPromo(null)}
              >
                <Text style={[
                  styles.promoText,
                  selectedPromo === null ? styles.promoTextActive : null
                ]}>
                  Ninguna
                </Text>
              </TouchableOpacity>
              
              {promotions.map((p) => (
                <TouchableOpacity
                  key={p._id}
                  style={[
                    styles.promoPill,
                    selectedPromo?._id === p._id ? styles.promoPillActive : null
                  ]}
                  onPress={() => setSelectedPromo(p)}
                >
                  <Text style={[
                    styles.promoText,
                    selectedPromo?._id === p._id ? styles.promoTextActive : null
                  ]}>
                    {p.name_promotion} (-{p.discount_percentage}%)
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Estimado:</Text>
          <Text style={styles.totalValue}>${calculateTotalPrice().toFixed(2)}</Text>
        </View>

        <Button
          title="Confirmar Inscripción"
          type="primary"
          loading={loading}
          onPress={handleRegister}
          style={styles.regBtn}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  card: {
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  formCard: {
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  eventName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  priceTag: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginVertical: 2,
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 4,
  },
  infoText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
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
  formTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  promoContainer: {
    marginVertical: SPACING.sm,
  },
  promoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  promoScroll: {
    flexDirection: "row",
  },
  promoPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.xs,
    backgroundColor: COLORS.surface,
  },
  promoPillActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(226, 92, 0, 0.08)",
  },
  promoText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  promoTextActive: {
    color: COLORS.primary,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  totalLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  totalValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.primary,
  },
  regBtn: {
    height: 48,
    borderRadius: 12,
  },
  // ADMIN STYLES
  subTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  attendeesHeaderRow: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  noAttendees: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: SPACING.md,
  },
  attendeeCard: {
    marginBottom: SPACING.sm,
    borderRadius: 12,
    padding: SPACING.md,
  },
  attendeeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  attendeeName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  attendeeBadge: {
    backgroundColor: "rgba(226, 92, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  attendeeBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "800",
  },
  attendeeInfo: {
    fontSize: 12,
    color: COLORS.textLight,
    marginVertical: 1,
  },
});
