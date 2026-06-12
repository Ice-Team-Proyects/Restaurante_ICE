// c:/neww/Restaurante_ICE/client-user/src/features/teams/screens/MyTeamsScreen.jsx
import React, { useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, RefreshControl } from "react-native";
import { useTeams } from "../hooks/useTeams.js";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/common/Common.jsx";
import { COLORS, SPACING, FONT_SIZE } from "../../../shared/constants/theme.js";

export default function MyTeamsScreen({ navigation }) {
  const { myTeams, loading, error, fetchMyTeams } = useTeams();

  useEffect(() => {
    fetchMyTeams();
  }, [fetchMyTeams]);

  const renderTeamItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("TeamDetail", { team: item })}
      >
        <Card style={styles.card}>
          <Image source={{ uri: item.logo }} style={styles.logo} />
          <View style={styles.info}>
            <Text style={styles.teamName}>{item.name}</Text>
            <Text style={styles.membersCount}>
              {item.members?.length || 0} {item.members?.length === 1 ? "Miembro" : "Miembros"}
            </Text>
            <Text style={styles.description} numberOfLines={1}>
              {item.description}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading && myTeams.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={myTeams}
        keyExtractor={(item) => item._id}
        renderItem={renderTeamItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchMyTeams}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="group-work"
            title="Aún no perteneces a ningún equipo"
            description="Únete a un equipo deportivo de comensales desde la pestaña principal."
            actionTitle="Explorar Equipos"
            onActionPress={() => navigation.goBack()}
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
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.secondary,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  teamName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  membersCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: "600",
    marginVertical: 2,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
});
