// c:/neww/Restaurante_ICE/client-user/src/features/menu/screens/MenuListScreen.jsx
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, RefreshControl, ScrollView, Modal, Alert } from "react-native";
import { useMenu } from "../hooks/useMenu.js";
import { useCartStore } from "../../../shared/store/cartStore.js";
import { Card, LoadingSpinner, EmptyState, GlassBackground } from "../../../shared/components/common/Common.jsx";
import { Button } from "../../../shared/components/common/Button.jsx";
import { Input } from "../../../shared/components/common/Input.jsx";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import { MaterialIcons } from "@expo/vector-icons";
import { getImageUrl } from "../../../shared/utils/cloudinary.js";

export default function MenuListScreen({ navigation }) {
  const { products, categories, loading, error, fetchCategories, fetchProducts, createCategory, isAdmin } = useMenu();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const cartCount = useCartStore((state) => state.getItemCount());
  
  // States for adding category
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState("");
  const [catType, setCatType] = useState("Platillos");
  const [catDesc, setCatDesc] = useState("");

  useEffect(() => {
    const load = async () => {
      await fetchCategories();
      await fetchProducts();
    };
    load();
  }, [fetchCategories, fetchProducts]);

  const handleCategorySelect = (id) => {
    setSelectedCategoryId(id);
    fetchProducts(id);
  };

  const handleCreateCategory = async () => {
    if (!catName || !catDesc) {
      Alert.alert("Campos requeridos", "Por favor ingresa nombre y descripción.");
      return;
    }
    const res = await createCategory({
      categoryName: catName,
      type: catType,
      description: catDesc
    });
    if (res.success) {
      setCatName("");
      setCatDesc("");
      setShowCatModal(false);
      Alert.alert("Éxito", "Categoría creada correctamente.");
    } else {
      Alert.alert("Error", res.error);
    }
  };

  const renderProductItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("MenuDetail", { product: item })}
      >
        <Card style={styles.productCard}>
          <Image
            source={{ uri: getImageUrl(item.photo) }}
            style={styles.productImage}
          />
          <View style={styles.productContent}>
            <Text style={styles.productName}>{item.saucer}</Text>
            <Text style={styles.productPrice}>Q{item.price}</Text>
            <Text style={styles.productDesc} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <GlassBackground style={styles.container}>

      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.barTitle}>{isAdmin ? "Administración Menú" : "Menú Gourmet"}</Text>
        
        {!isAdmin ? (
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => navigation.navigate("CreateOrder")}
          >
            <MaterialIcons name="shopping-cart" size={24} color={COLORS.primary} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.adminActionRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowCatModal(true)}>
              <MaterialIcons name="create-new-folder" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("MenuDetail", { isNew: true })}>
              <MaterialIcons name="add-circle" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Categories Filter Bar */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          <TouchableOpacity
            style={[styles.categoryPill, selectedCategoryId === null ? styles.categoryPillActive : null]}
            onPress={() => handleCategorySelect(null)}
          >
            <Text style={[styles.categoryText, selectedCategoryId === null ? styles.categoryTextActive : null]}>
              Todos
            </Text>
          </TouchableOpacity>
          
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat._id}
              style={[
                styles.categoryPill,
                selectedCategoryId === cat._id ? styles.categoryPillActive : null
              ]}
              onPress={() => handleCategorySelect(cat._id)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategoryId === cat._id ? styles.categoryTextActive : null
              ]}>
                {cat.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products list */}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              fetchCategories();
              fetchProducts(selectedCategoryId);
            }}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="menu-book"
            title="Menú Vacío"
            description="No se encontraron platillos en esta categoría."
            actionTitle="Ver Todo"
            onActionPress={() => handleCategorySelect(null)}
          />
        }
      />

      {/* CREATE CATEGORY MODAL */}
      <Modal visible={showCatModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <Text style={styles.modalTitle}>Crear Categoría</Text>
            
            <Input
              label="Nombre de Categoría"
              placeholder="Ej. Postres"
              value={catName}
              onChangeText={setCatName}
            />

            <Text style={styles.selectLabel}>Tipo de Categoría</Text>
            <View style={styles.typeSelector}>
              {["Platillos", "Bebidas Frias", "Bebidas Calientes", "Sopas"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeBtn,
                    catType === type ? styles.typeBtnActive : null
                  ]}
                  onPress={() => setCatType(type)}
                >
                  <Text style={[
                    styles.typeText,
                    catType === type ? styles.typeTextActive : null
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Descripción"
              placeholder="Ej. Deliciosos acompañamientos dulces"
              value={catDesc}
              onChangeText={setCatDesc}
            />

            <View style={styles.modalBtnRow}>
              <Button
                title="Cancelar"
                type="secondary"
                onPress={() => setShowCatModal(false)}
                style={styles.modalBtn}
              />
              <Button
                title="Crear"
                type="primary"
                onPress={handleCreateCategory}
                style={styles.modalBtn}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F5E2D0", // Soft pastel peach border
    backgroundColor: "#FFFFFF", // Clean solid white header
    ...SHADOWS.sm,
  },
  barTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
    color: COLORS.text,
  },
  cartBtn: {
    position: "relative",
    padding: SPACING.xs,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: COLORS.error,
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
  },
  adminActionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  categoriesContainer: {
    backgroundColor: "#FFF2E8", // Soft warm pastel orange/cream container background
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F5E2D0",
  },
  categoriesScroll: {
    paddingHorizontal: SPACING.md,
    alignItems: "center",
  },
  categoryPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FCE8D9",
    marginRight: SPACING.sm,
    backgroundColor: "#FFFFFF",
  },
  categoryPillActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  categoryTextActive: {
    color: "#FFF",
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 90,
  },
  productCard: {
    flexDirection: "row",
    padding: 0,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: SPACING.md,
    height: 110,
  },
  productImage: {
    width: 110,
    height: "100%",
    backgroundColor: COLORS.secondary,
  },
  productContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: "center",
  },
  productName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.text,
  },
  productPrice: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.primary,
    marginVertical: 2,
  },
  productDesc: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  selectLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  typeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  typeBtn: {
    width: "48%",
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  typeBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(226, 92, 0, 0.08)",
  },
  typeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  typeTextActive: {
    color: COLORS.primary,
  },
  modalBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  modalBtn: {
    flex: 0.48,
    height: 45,
  },
});
