// c:/neww/Restaurante_ICE/client-user/src/features/tournaments/screens/TournamentsScreen.jsx
import React, { useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { useTournaments } from "../hooks/useTournaments.js";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/common/Common.jsx";
import { Button } from "../../../shared/components/common/Button.jsx";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";

export default function TournamentsScreen({ navigation }) {
  const { tournaments, loading, error, fetchTournaments } = useTournaments();

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const renderTournamentItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("TournamentDetail", { tournament: item })}
      >
        <Card style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.trnName}>{item.name}</Text>
            <MaterialIcons name="emoji-events" size={24} color={COLORS.warning} />
          </View>

          <Text style={styles.dateText}>
            Comienza el: {item.startDate}
          </Text>
          <Text style={styles.descText} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.divider} />
          
          <Text style={styles.rewardText}>
            Premio: <Text style={styles.rewardVal}>{item.reward}</Text>
          </Text>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading && tournaments.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Top Action Bar */}
      <View style={styles.actionBar}>
        <Button
          title="Mis Torneos Inscritos"
          type="secondary"
          onPress={() => navigation.navigate("MyTournaments")}
          style={styles.actionBtn}
        />
      </View>

      <FlatList
        data={tournaments}
        keyExtractor={(item) => item._id}
        renderItem={renderTournamentItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchTournaments}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="event-busy"
            title="Sin Torneos"
            description="Actualmente no hay torneos ni copas deportivas activas."
            actionTitle="Actualizar"
            onActionPress={fetchTournaments}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  actionBar: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  actionBtn: {
    width: "100%",
    height: 44,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  card: {
    marginBottom: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  trnName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  dateText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  descText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  rewardText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: "600",
  },
  rewardVal: {
    fontWeight: "400",
    color: COLORS.textLight,
  },
});
