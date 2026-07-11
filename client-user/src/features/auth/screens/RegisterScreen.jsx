// c:/neww/Restaurante_ICE/client-user/src/features/auth/screens/RegisterScreen.jsx
import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../hooks/useAuth.js";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Input } from "../../../shared/components/common/Input.jsx";
import { Card } from "../../../shared/components/common/Common.jsx";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";

export default function RegisterScreen({ navigation }) {
  const { handleRegister, loading, error: registerError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      surname: "",
      username: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    const result = await handleRegister(data);
    if (result.success) {
      Alert.alert(
        "Registro Exitoso",
        "Tu cuenta de cliente ha sido registrada. Por favor verifica tu correo electrónico para activar la cuenta.",
        [{ text: "Iniciar Sesión", onPress: () => navigation.navigate("Login") }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* BACKGROUND GLASSMORPHIC GLOWING SPHERES */}
      <View style={[styles.sphere, styles.sphereOrange]} />
      <View style={[styles.sphere, styles.sphereDeep]} />
      <View style={[styles.sphere, styles.sphereGold]} />
      <View style={[styles.sphere, styles.sphereRed]} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* GLASSMORPHIC CARD */}
        <Card style={styles.glassCard}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para realizar tus pedidos y reservar mesas</Text>

          {registerError ? <Text style={styles.errorText}>{registerError}</Text> : null}

          {/* Name Field */}
          <Controller
            control={control}
            name="name"
            rules={{ required: "El nombre es obligatorio" }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Nombre"
                placeholder="Juan"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                labelStyle={styles.inputLabel}
                inputStyle={styles.glassInput}
              />
            )}
          />

          {/* Surname Field */}
          <Controller
            control={control}
            name="surname"
            rules={{ required: "El apellido es obligatorio" }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Apellido"
                placeholder="Pérez"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                labelStyle={styles.inputLabel}
                inputStyle={styles.glassInput}
              />
            )}
          />

          {/* Username Field */}
          <Controller
            control={control}
            name="username"
            rules={{ required: "El nombre de usuario es obligatorio" }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Nombre de Usuario"
                placeholder="juanperez"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                autoCapitalize="none"
                labelStyle={styles.inputLabel}
                inputStyle={styles.glassInput}
              />
            )}
          />

          {/* Email Field */}
          <Controller
            control={control}
            name="email"
            rules={{
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Formato de correo electrónico inválido",
              },
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Correo Electrónico"
                placeholder="juan@email.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                labelStyle={styles.inputLabel}
                inputStyle={styles.glassInput}
              />
            )}
          />

          {/* Phone Field */}
          <Controller
            control={control}
            name="phone"
            rules={{
              required: "El número telefónico es obligatorio",
              pattern: {
                value: /^\d{8}$/,
                message: "El teléfono debe tener exactamente 8 dígitos",
              },
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
                labelStyle={styles.inputLabel}
                inputStyle={styles.glassInput}
              />
            )}
          />

          {/* Password Field */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: "La contraseña es obligatoria",
              minLength: {
                value: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Contraseña"
                placeholder="Mínimo 8 caracteres"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                error={error?.message}
                autoCapitalize="none"
                labelStyle={styles.inputLabel}
                inputStyle={styles.glassInput}
              />
            )}
          />

          {/* Register Button */}
          <Button
            title="Registrarse"
            type="primary"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            style={styles.registerBtn}
          />
        </Card>

        {/* Login Navigation Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Inicia Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // ABSTRACT GLOWING BACKGROUND SPHERES
  sphere: {
    position: "absolute",
    borderRadius: 999,
  },
  sphereOrange: {
    top: -60,
    left: -40,
    width: 240,
    height: 240,
    backgroundColor: "#FF6D00",
    opacity: 0.14,
  },
  sphereDeep: {
    bottom: -60,
    right: -60,
    width: 280,
    height: 280,
    backgroundColor: "#E65100",
    opacity: 0.12,
  },
  sphereGold: {
    top: "40%",
    right: -80,
    width: 180,
    height: 180,
    backgroundColor: "#FFD54F",
    opacity: 0.2,
  },
  sphereRed: {
    bottom: "45%",
    left: -90,
    width: 200,
    height: 200,
    backgroundColor: "#FF3D00",
    opacity: 0.08,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  glassCard: {
<<<<<<< HEAD
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderColor: "rgba(255, 255, 255, 0.65)",
    borderWidth: 1.5,
=======
    backgroundColor: "#FFFFFF",
    borderColor: "#FCE8D9", // Beautiful soft peach border
    borderWidth: 1,
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
    borderRadius: 24,
    padding: SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
<<<<<<< HEAD
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 6,
=======
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
      },
      android: {
        elevation: 3,
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
      },
    }),
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: FONT_SIZE.sm,
  },
  glassInput: {
<<<<<<< HEAD
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderColor: "rgba(226, 92, 0, 0.2)",
=======
    backgroundColor: "#FFFFFF",
    borderColor: "#FCE8D9",
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
    borderRadius: 14,
    height: 50,
  },
  registerBtn: {
    marginTop: SPACING.md,
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    ...SHADOWS.md,
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  loginLink: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
