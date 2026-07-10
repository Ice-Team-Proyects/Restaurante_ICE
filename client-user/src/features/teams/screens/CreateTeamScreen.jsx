// c:/neww/Restaurante_ICE/client-user/src/features/teams/screens/CreateTeamScreen.jsx
import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { useTeams } from "../hooks/useTeams.js";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Input } from "../../../shared/components/common/Input.jsx";
import { Card } from "../../../shared/components/common/Common.jsx";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";

export default function CreateTeamScreen({ navigation }) {
  const { createTeam, loading, error: createError } = useTeams();
  const [logoUri, setLogoUri] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso Requerido", "Necesitamos permisos de galería para seleccionar el logotipo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const onSubmit = async (data) => {
    const result = await createTeam({
      name: data.name,
      description: data.description,
      logo: logoUri,
    });

    if (result.success) {
      Alert.alert(
        "Equipo Registrado",
        "El equipo deportivo se ha creado con éxito.",
        [
          {
            text: "Aceptar",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "TeamsList" }],
              });
            },
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Card style={styles.formCard}>
          <Text style={styles.title}>Registrar Nuevo Equipo</Text>
          <Text style={styles.subtitle}>Crea una escuadra para competir en los torneos</Text>

          {createError ? <Text style={styles.errorText}>{createError}</Text> : null}

          {/* Logo Picker Area */}
          <Text style={styles.pickerLabel}>Logotipo del Equipo</Text>
          <View style={styles.logoPickerContainer}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.logoPicker}>
              {logoUri ? (
                <Image source={{ uri: logoUri }} style={styles.logoPreview} />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <MaterialIcons name="photo-camera" size={36} color={COLORS.secondary} />
                  <Text style={styles.placeholderText}>Seleccionar Foto</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Name Field */}
          <Controller
            control={control}
            name="name"
            rules={{
              required: "El nombre del equipo es obligatorio",
              minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Nombre del Equipo"
                placeholder="Ej. Real Comensales"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
              />
            )}
          />

          {/* Description Field */}
          <Controller
            control={control}
            name="description"
            rules={{
              required: "La descripción es obligatoria",
              minLength: { value: 10, message: "La descripción debe tener al menos 10 caracteres" },
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Descripción del Equipo"
                placeholder="Describa el objetivo del equipo, horarios, etc."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                multiline
                numberOfLines={3}
                style={styles.textArea}
              />
            )}
          />

          {/* Submit Button */}
          <Button
            title="Crear Equipo"
            type="primary"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SPACING.lg,
  },
  formCard: {
    paddingVertical: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  pickerLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  logoPickerContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  logoPicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: COLORS.background,
  },
  logoPreview: {
    width: "100%",
    height: "100%",
  },
  logoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "600",
    marginTop: 4,
  },
  button: {
    marginTop: SPACING.md,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
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
