// c:/neww/Restaurante_ICE/client-user/src/features/profile/screens/ProfileScreen.jsx
import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Image, ScrollView, Alert, ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAuthStore } from "../../../shared/store/authStore.js";
import { userClient } from "../../../shared/api/userClient.js";
import { Card, GlassBackground } from "../../../shared/components/common/Common.jsx";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Input } from "../../../shared/components/common/Input.jsx";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: "",
      phone: "",
      preferences: "",
    },
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setProfileError("");
    try {
      let profileData = {};
      try {
        // GET /users/profile (con fallback a datos del store/mock)
        const response = await userClient.get("/users/profile");
        profileData = response.data.data || response.data || {};
      } catch (axiosError) {
        console.warn("Backend de perfil inaccesible. Cargando datos locales del store...");
        profileData = {
          displayName: user?.name || user?.username || "Carlos López",
          phone: user?.phone || "55512345",
          preferences: user?.preferences || ["Café", "Pizzas", "Pastas"],
        };
      }

      // Convertir el array de preferencias a una cadena separada por comas para el formulario
      const prefsArray = profileData.preferences || [];
      const prefsString = Array.isArray(prefsArray)
        ? prefsArray.join(", ")
        : String(prefsArray);

      reset({
        displayName: profileData.displayName || profileData.name || user?.name || "",
        phone: profileData.phone || "",
        preferences: prefsString,
      });
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || "Error al obtener perfil");
    } finally {
      setLoading(false);
    }
  }, [user, reset]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSubmit = async (data) => {
    setLoading(true);
    setProfileError("");
    try {
      // Convertir la cadena de texto de preferencias separadas por comas de vuelta a un array
      const prefsArray = data.preferences
        ? data.preferences.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        displayName: data.displayName,
        phone: data.phone,
        preferences: prefsArray,
      };

      try {
        // PUT /users/profile
        await userClient.put("/users/profile", payload);
      } catch (axiosError) {
        console.warn("Backend inaccesible. Guardando perfil localmente en la sesión...");
      }

      // Actualizar el usuario en el store global
      const updatedUser = {
        ...user,
        name: payload.displayName,
        phone: payload.phone,
        preferences: payload.preferences,
      };
      updateUser(updatedUser);

      setIsEditing(false);
      Alert.alert("Perfil Actualizado", "Tus datos se han guardado correctamente.");
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutPress = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar tu sesión en Restaurante ICE?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  // Lógica de avatar: http URL o imagen local por defecto
  const avatarSource =
    user?.profilePicture && user.profilePicture.startsWith("http")
      ? { uri: user.profilePicture }
      : require("../../../../assets/avatarDefault.png");

  return (
    <GlassBackground style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

      {/* Avatar and name header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={avatarSource} style={styles.avatar} />
        </View>
        <Text style={styles.userName}>{user?.name || user?.username || "Usuario"}</Text>
        <Text style={styles.userRole}>Rol: {user?.role || "Cliente"}</Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Datos Personales</Text>
          <TouchableOpacity
            style={styles.editToggleBtn}
            onPress={() => {
              if (isEditing) {
                // Cancelar edición, restaurar campos
                fetchProfile();
              }
              setIsEditing(!isEditing);
            }}
          >
            <MaterialIcons
              name={isEditing ? "close" : "edit"}
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {profileError ? <Text style={styles.errorText}>{profileError}</Text> : null}

        {loading && !isEditing ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: SPACING.md }} />
        ) : isEditing ? (
          // MODO EDICIÓN
          <View>
            <Controller
              control={control}
              name="displayName"
              rules={{ required: "El nombre a mostrar es obligatorio" }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  label="Nombre Completo"
                  placeholder="Ej. Juan Pérez"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              rules={{
                required: "El número telefónico es obligatorio",
                pattern: { value: /^\d{8}$/, message: "El teléfono debe tener 8 dígitos" },
              }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  label="Teléfono"
                  placeholder="55512345"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                  keyboardType="phone-pad"
                />
              )}
            />

            <Controller
              control={control}
              name="preferences"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Preferencias de Comida (separados por comas)"
                  placeholder="Pizzas, Café, Postres"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            <Button
              title="Guardar Cambios"
              type="primary"
              loading={loading}
              onPress={handleSubmit(onSubmit)}
              style={styles.saveBtn}
            />
          </View>
        ) : (
          // MODO VISTA (READ-ONLY)
          <View style={styles.readOnlyContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre Completo:</Text>
              <Text style={styles.infoValue}>{control._defaultValues.displayName || user?.name || "Sin registrar"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Teléfono:</Text>
              <Text style={styles.infoValue}>{control._defaultValues.phone || "Sin registrar"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Preferencias Culinarias:</Text>
              <Text style={styles.infoValue}>
                {control._defaultValues.preferences || "Ninguna"}
              </Text>
            </View>
          </View>
        )}
      </Card>

      <Button
        title="Cerrar Sesión"
        type="secondary"
        onPress={handleLogoutPress}
        style={styles.logoutBtn}
      />
      </ScrollView>
    </GlassBackground>
  );
}

// Estilos del perfil
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.primary,
    overflow: "hidden",
    backgroundColor: COLORS.secondary,
    marginBottom: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  userName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
  },
  userRole: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontWeight: "600",
    marginTop: 2,
  },
  card: {
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  editToggleBtn: {
    padding: 4,
  },
  saveBtn: {
    marginTop: SPACING.md,
  },
  logoutBtn: {
    marginTop: SPACING.md,
    borderColor: COLORS.error,
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
  readOnlyContainer: {
    paddingVertical: SPACING.xs,
  },
  infoRow: {
    marginBottom: SPACING.md,
  },
  infoLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: "500",
  },
});
