// c:/neww/Restaurante_ICE/client-user/src/features/events/screens/CreateEventScreen.jsx
import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useEvents } from "../hooks/useEvents.js";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme.js";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Input } from "../../../shared/components/common/Input.jsx";
import { Card, GlassBackground } from "../../../shared/components/common/Common.jsx";

export default function CreateEventScreen({ navigation }) {
  const { createEvent, createPromotion, loading, error: serverError } = useEvents();
  const [formType, setFormType] = useState("event"); // "event" or "promotion"

  // Event Form
  const {
    control: eventControl,
    handleSubmit: handleEventSubmit,
    reset: resetEvent,
    formState: { errors: eventErrors },
  } = useForm({
    defaultValues: {
      name_event: "",
      description: "",
      date_event: "2026-06-20",
      capacity: "50",
      location: "Salón Principal",
      price: "15.00",
    },
  });

  // Promotion Form
  const {
    control: promoControl,
    handleSubmit: handlePromoSubmit,
    reset: resetPromo,
    formState: { errors: promoErrors },
  } = useForm({
    defaultValues: {
      name_promotion: "",
      description: "",
      discount_percentage: "15",
      date_start: "2026-06-12",
      date_end: "2026-06-30",
      min_people: "4",
    },
  });

  const onEventSubmit = async (data) => {
    const res = await createEvent(data);
    if (res.success) {
      Alert.alert("Evento Creado", `El evento "${data.name_event}" se ha creado con éxito.`, [
        { text: "Aceptar", onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert("Error", res.error);
    }
  };

  const onPromoSubmit = async (data) => {
    const res = await createPromotion(data);
    if (res.success) {
      Alert.alert("Promoción Creada", `La promoción "${data.name_promotion}" se ha creado con éxito.`, [
        { text: "Aceptar", onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert("Error", res.error);
    }
  };

  return (
    <GlassBackground style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Toggle Form Selector */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, formType === "event" ? styles.toggleBtnActive : null]}
              onPress={() => setFormType("event")}
            >
              <Text style={[styles.toggleText, formType === "event" ? styles.toggleTextActive : null]}>
                Nuevo Evento
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, formType === "promotion" ? styles.toggleBtnActive : null]}
              onPress={() => setFormType("promotion")}
            >
              <Text style={[styles.toggleText, formType === "promotion" ? styles.toggleTextActive : null]}>
                Nueva Promoción
              </Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.formCard}>
            {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

            {formType === "event" ? (
              // EVENT FORM
              <View>
                <Controller
                  control={eventControl}
                  name="name_event"
                  rules={{ required: "El nombre del evento es obligatorio" }}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      label="Nombre del Evento"
                      placeholder="Ej. Noche de Pizza e Jazz"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  control={eventControl}
                  name="description"
                  rules={{ required: "La descripción es obligatoria" }}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      label="Descripción"
                      placeholder="Describe la experiencia gastronomica..."
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                      multiline
                      numberOfLines={3}
                    />
                  )}
                />

                <Controller
                  control={eventControl}
                  name="date_event"
                  rules={{ required: "La fecha es obligatoria" }}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      label="Fecha del Evento"
                      placeholder="AAAA-MM-DD"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  control={eventControl}
                  name="capacity"
                  rules={{ required: "La capacidad máxima es obligatoria" }}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      label="Capacidad (Personas)"
                      placeholder="Ej. 50"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                      keyboardType="numeric"
                    />
                  )}
                />

                <Controller
                  control={eventControl}
                  name="location"
                  rules={{ required: "La ubicación es obligatoria" }}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      label="Ubicación"
                      placeholder="Ej. Salón Jardín o Terraza"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  control={eventControl}
                  name="price"
                  rules={{ required: "El precio de entrada es obligatorio" }}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      label="Precio (Q)"
                      placeholder="Ej. 15.00"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                      keyboardType="numeric"
                    />
                  )}
                />

                <Button
                  title="Crear Evento"
                  type="primary"
                  loading={loading}
                  onPress={handleEventSubmit(onEventSubmit)}
                  style={styles.submitBtn}
                />
              </View>
            ) : (
              // PROMOTION FORM
              <View>
                <Controller
                  control={promoControl}
                  name="name_promotion"
                  rules={{ required: "El nombre de la promoción es obligatorio" }}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      label="Nombre de la Promoción"
                      placeholder="Ej. Promo Grupos de Amigos"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  control={promoControl}
                  name="description"
                  rules={{ required: "La descripción es obligatoria" }}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      label="Descripción"
                      placeholder="Detalles del descuento..."
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                      multiline
                      numberOfLines={3}
                    />
                  )}
                />

                <Controller
                  control={promoControl}
                  name="discount_percentage"
                  rules={{ required: "El porcentaje es obligatorio" }}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      label="Porcentaje de Descuento (%)"
                      placeholder="Ej. 15"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                      keyboardType="numeric"
                    />
                  )}
                />

                <Controller
                  control={promoControl}
                  name="date_start"
                  rules={{ required: "La fecha de inicio es obligatoria" }}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      label="Fecha de Inicio"
                      placeholder="AAAA-MM-DD"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  control={promoControl}
                  name="date_end"
                  rules={{ required: "La fecha de fin es obligatoria" }}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      label="Fecha de Fin"
                      placeholder="AAAA-MM-DD"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  control={promoControl}
                  name="min_people"
                  rules={{ required: "El mínimo de comensales es obligatorio" }}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      label="Mínimo de Personas para Aplicar"
                      placeholder="Ej. 4"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={error?.message}
                      keyboardType="numeric"
                    />
                  )}
                />

                <Button
                  title="Crear Promoción"
                  type="primary"
                  loading={loading}
                  onPress={handlePromoSubmit(onPromoSubmit)}
                  style={styles.submitBtn}
                />
              </View>
            )}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  toggleBtn: {
    flex: 0.48,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  toggleBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(226, 92, 0, 0.08)",
  },
  toggleText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  toggleTextActive: {
    color: COLORS.primary,
  },
  formCard: {
    borderRadius: 16,
    padding: SPACING.md,
  },
  submitBtn: {
    marginTop: SPACING.md,
    height: 48,
    borderRadius: 12,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    backgroundColor: "#FEE2E2",
    padding: SPACING.sm,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
});
