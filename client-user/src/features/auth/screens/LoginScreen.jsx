// c:/neww/Restaurante_ICE/client-user/src/features/auth/screens/LoginScreen.jsx
import React from "react";
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../hooks/useAuth.js";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Input } from "../../../shared/components/common/Input.jsx";
import { Card } from "../../../shared/components/common/Common.jsx";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";

export default function LoginScreen({ navigation }) {
  const { handleLogin, loading, error: loginError } = useAuth();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const result = await handleLogin(data.emailOrUsername, data.password);
    if (result.success) {
      console.log("Inicio de sesión exitoso");
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
        {/* Brand Header */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../../../assets/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandName}>Restaurante ICE</Text>
          <Text style={styles.brandTagline}>Sabores auténticos en tu mesa</Text>

        </View>

        {/* GLASSMORPHIC CARD */}
        <Card style={styles.glassCard}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>Ingresa tus credenciales para ordenar</Text>

          {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

          {/* Email/Username Field */}
          <Controller
            control={control}
            name="emailOrUsername"
            rules={{
              required: "El correo electrónico o usuario es obligatorio",
              minLength: {
                value: 3,
                message: "Debe tener al menos 3 caracteres",
              },
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Usuario o Correo"
                placeholder="ejemplo@correo.com"
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

          {/* Password Field */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Contraseña"
                placeholder="••••••••"
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

          {/* Login Button */}
          <Button
            title="Ingresar al Menú"
            type="primary"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            style={styles.loginBtn}
          />
        </Card>

        {/* Register Navigation Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Regístrate aquí</Text>
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
    opacity: 0.16,
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
    top: "32%",
    right: -80,
    width: 180,
    height: 180,
    backgroundColor: "#FFD54F",
    opacity: 0.22,
  },
  sphereRed: {
    bottom: "35%",
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
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.md,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },
  brandName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
  brandTagline: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: 2,
    fontWeight: "500",
  },
  // GLASSMORPHIC CARD STYLING
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderColor: "rgba(255, 255, 255, 0.65)",
    borderWidth: 1.5,
    borderRadius: 24,
    padding: SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 6,
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
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderColor: "rgba(226, 92, 0, 0.2)",
    borderRadius: 14,
    height: 50,
  },
  loginBtn: {
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
    marginTop: SPACING.xl,
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  registerLink: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
