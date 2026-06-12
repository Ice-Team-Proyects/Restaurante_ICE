// c:/neww/Restaurante_ICE/client-user/src/features/restaurant/screens/RestaurantListScreen.jsx
import React, { useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, RefreshControl } from "react-native";
import { useRestaurant } from "../hooks/useRestaurant.js";
import { Card, LoadingSpinner, EmptyState, GlassBackground } from "../../../shared/components/common/Common.jsx";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import { getImageUrl } from "../../../shared/utils/cloudinary.js";

export default function RestaurantListScreen({ navigation }) {
  const { restaurants, loading, fetchRestaurants } = useRestaurant();

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("RestaurantDetail", { item })}
      >
        <Card style={styles.branchCard}>
          <Image
            source={{ uri: getImageUrl(item.photo) }}
            style={styles.branchImage}
          />
          <View style={styles.branchContent}>
            <Text style={styles.branchName}>{item.name}</Text>
            <Text style={styles.branchHours}>🕒 {item.openingHours || "8:00 - 22:00"}</Text>
            <Text style={styles.branchAddress} numberOfLines={1}>📍 {item.address}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading && restaurants.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <GlassBackground style={styles.container}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id || item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchRestaurants}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="restaurant"
            title="No hay sucursales disponibles"
            description="Intenta recargar más tarde."
            actionTitle="Actualizar"
            onActionPress={fetchRestaurants}
          />
        }
      />
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 90,
  },
  branchCard: {
    padding: 0,
    overflow: "hidden",
    borderRadius: 16,
    marginBottom: SPACING.md,
  },
  branchImage: {
    width: "100%",
    height: 160,
  },
  branchContent: {
    padding: SPACING.md,
  },
  branchName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  branchHours: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 2,
  },
  branchAddress: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
});
