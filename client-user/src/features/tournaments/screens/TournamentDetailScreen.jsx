// c:/neww/Restaurante_ICE/client-user/src/features/tournaments/screens/TournamentDetailScreen.jsx
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useTournaments } from "../hooks/useTournaments.js";
import { useTeams } from "../../teams/hooks/useTeams.js";
import { Card } from "../../../shared/components/common/Common.jsx";
import { Button } from "../../../shared/components/common/Button.jsx";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";

export default function TournamentDetailScreen({ route, navigation }) {
  const { tournament } = route.params || {};
  const { registerTeamForTournament, loading } = useTournaments();
  const { myTeams, fetchMyTeams } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  useEffect(() => {
    fetchMyTeams();
  }, [fetchMyTeams]);

  if (!tournament) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la información del torneo.</Text>
        <Button title="Volver" type="primary" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleRegister = async () => {
    if (!selectedTeamId) {
      Alert.alert("Selección Requerida", "Por favor, seleccione un equipo para inscribir.");
      return;
    }

    const selectedTeamName = myTeams.find((t) => t._id === selectedTeamId)?.name || "Equipo";

    Alert.alert(
      "Confirmar Inscripción",
      `¿Desea inscribir a "${selectedTeamName}" en el torneo "${tournament.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Inscribirse",
          onPress: async () => {
            const result = await registerTeamForTournament(tournament._id, selectedTeamId);
            if (result.success) {
              Alert.alert(
                "¡Inscripción Exitosa!",
                `Tu equipo se ha inscrito en el torneo "${tournament.name}".`,
                [{ text: "Aceptar", onPress: () => navigation.goBack() }]
              );
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Tournament Info Card */}
      <Card style={styles.infoCard}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{tournament.name}</Text>
          <MaterialIcons name="emoji-events" size={40} color={COLORS.warning} />
        </View>
        <Text style={styles.dateText}>Inicia: {tournament.startDate}</Text>
        <Text style={styles.description}>{tournament.description}</Text>
      </Card>

      {/* Rewards Card */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Premios y Recompensas</Text>
        <View style={styles.rewardRow}>
          <MaterialIcons name="workspace-premium" size={24} color={COLORS.warning} />
          <Text style={styles.rewardText}>{tournament.reward}</Text>
        </View>
      </Card>

      {/* Team Selection Area */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Inscribir a Mi Equipo</Text>
        {myTeams.length === 0 ? (
          <View style={styles.noTeamsContainer}>
            <Text style={styles.noTeamsText}>Aún no has creado ni perteneces a ningún equipo.</Text>
            <Button
              title="Crear un Equipo"
              type="secondary"
              onPress={() => navigation.navigate("TeamsTab", { screen: "CreateTeam" })}
              style={styles.createTeamBtn}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.selectLabel}>Selecciona el equipo para competir:</Text>
            {myTeams.map((team) => {
              const isSelected = selectedTeamId === team._id;
              return (
                <TouchableOpacity
                  key={team._id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTeamId(team._id)}
                  style={[styles.teamOption, isSelected && styles.teamOptionSelected]}
                >
                  <MaterialIcons
                    name={isSelected ? "radio-button-checked" : "radio-button-unchecked"}
                    size={20}
                    color={isSelected ? COLORS.primary : COLORS.secondary}
                  />
                  <Text style={[styles.teamNameText, isSelected && styles.teamNameSelected]}>
                    {team.name}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <Button
              title="Registrar Equipo en el Torneo"
              type="primary"
              loading={loading}
              onPress={handleRegister}
              style={styles.registerBtn}
            />
          </View>
        )}
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
  infoCard: {
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  dateText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    lineHeight: 20,
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
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  rewardText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: "500",
    marginLeft: SPACING.sm,
    flex: 1,
  },
  noTeamsContainer: {
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  noTeamsText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  createTeamBtn: {
    height: 40,
    width: "100%",
  },
  selectLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  teamOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  teamOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "#EFF6FF",
  },
  teamNameText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    fontWeight: "500",
  },
  teamNameSelected: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  registerBtn: {
    marginTop: SPACING.md,
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
