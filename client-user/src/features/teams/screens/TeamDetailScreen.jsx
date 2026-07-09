// c:/neww/Restaurante_ICE/client-user/src/features/teams/screens/TeamDetailScreen.jsx
import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, Alert } from "react-native";
import { useTeams } from "../hooks/useTeams.js";
import { useAuthStore } from "../../../shared/store/authStore.js";
import { Card } from "../../../shared/components/common/Common.jsx";
import { Button } from "../../../shared/components/common/Button.jsx";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";

export default function TeamDetailScreen({ route, navigation }) {
  const { team: routeTeam } = route.params || {};
  const [team, setTeam] = useState(routeTeam);
  const { joinTeam, leaveTeam, loading } = useTeams();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id || user?._id || "u1";

  if (!team) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la información del equipo.</Text>
        <Button title="Volver" type="primary" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const isMember = team.members?.includes(userId);

  const handleAction = async () => {
    if (isMember) {
      // Salir del equipo
      const result = await leaveTeam(team._id);
      if (result.success) {
        Alert.alert("Éxito", "Has salido del equipo correctamente.");
        setTeam({
          ...team,
          members: team.members.filter((m) => m !== userId),
        });
      }
    } else {
      // Unirse al equipo
      const result = await joinTeam(team._id);
      if (result.success) {
        Alert.alert("Éxito", "¡Te has unido al equipo!");
        setTeam({
          ...team,
          members: [...team.members, userId],
        });
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Team Header Card */}
      <Card style={styles.headerCard}>
        <Image source={{ uri: team.logo }} style={styles.logo} />
        <Text style={styles.name}>{team.name}</Text>
        <Text style={styles.membersText}>
          {team.members?.length || 0} {team.members?.length === 1 ? "Miembro Activo" : "Miembros Activos"}
        </Text>
      </Card>

      {/* Description */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Acerca del Equipo</Text>
        <Text style={styles.descriptionText}>
          {team.description || "Este equipo aún no ha configurado una descripción de su escuadra."}
        </Text>
      </Card>

      {/* Roster / Member Info */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Plantilla</Text>
        <View style={styles.memberRow}>
          <MaterialIcons name="person" size={20} color={COLORS.primary} />
          <Text style={styles.memberName}>Líder / Creador del Equipo</Text>
        </View>
        {team.members?.map((memberId, idx) => (
          <View key={memberId + idx} style={styles.memberRow}>
            <MaterialIcons name="sports-soccer" size={20} color={COLORS.secondary} />
            <Text style={styles.memberName}>Jugador #{idx + 1} ({memberId === userId ? "Tú" : memberId})</Text>
          </View>
        ))}
      </Card>

      {/* Action Button */}
      <Button
        title={isMember ? "Salir del Equipo" : "Unirse a este Equipo"}
        type={isMember ? "secondary" : "primary"}
        loading={loading}
        onPress={handleAction}
        style={[styles.actionBtn, isMember && styles.leaveBtn]}
      />
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
  headerCard: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.md,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.secondary,
  },
  name: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  membersText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  card: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 4,
  },
  descriptionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  memberName: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: "500",
  },
  actionBtn: {
    marginTop: SPACING.md,
  },
  leaveBtn: {
    borderColor: COLORS.error,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
});
