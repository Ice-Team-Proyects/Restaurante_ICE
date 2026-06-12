// c:/neww/Restaurante_ICE/client-user/src/features/fields/screens/FieldsScreen.jsx
import React from "react";
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, RefreshControl } from "react-native";
import { useFields } from "../hooks/useFields.js";
import { Card, LoadingSpinner, EmptyState } from "../../../shared/components/common/Common.jsx";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";

export default function FieldsScreen({ navigation }) {
  const { fields, loading, error, refreshFields } = useFields();

  const renderFieldItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("FieldDetail", { field: item })}
      >
        <Card style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          
          <View style={styles.cardContent}>
            <View style={styles.headerRow}>
              <Text style={styles.fieldName} numberOfLines={1}>
                {item.name}
              </Text>
              <View
                style={[
                  styles.badge,
                  item.isAvailable ? styles.badgeAvailable : styles.badgeUnavailable,
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.isAvailable ? "Disponible" : "Ocupado"}
                </Text>
              </View>
            </View>

            <Text style={styles.fieldLocation}>{item.location}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading && fields.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  if (error && fields.length === 0) {
    return (
      <EmptyState
        icon="error-outline"
        title="Error al cargar"
        description={error}
        actionTitle="Reintentar"
        onActionPress={refreshFields}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={fields}
        keyExtractor={(item) => item.id}
        renderItem={renderFieldItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshFields}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="sports-soccer"
            title="No hay áreas de juego"
            description="Actualmente no hay áreas recreativas ni canchas registradas."
            actionTitle="Actualizar"
            onActionPress={refreshFields}
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
    padding: 0,
    overflow: "hidden",
    borderRadius: 16,
    marginBottom: SPACING.md,
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.secondary,
  },
  cardContent: {
    padding: SPACING.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  fieldName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  fieldLocation: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeAvailable: {
    backgroundColor: "#D1FAE5",
  },
  badgeUnavailable: {
    backgroundColor: "#FEE2E2",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text,
  },
});
