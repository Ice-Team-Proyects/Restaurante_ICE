// c:/neww/Restaurante_ICE/client-user/src/features/menu/screens/MenuDetailScreen.jsx
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useMenu } from "../hooks/useMenu.js";
import { useCartStore } from "../../../shared/store/cartStore.js";
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from "../../../shared/constants/theme.js";
import { Button } from "../../../shared/components/common/Button.jsx";
<<<<<<< HEAD
import { Card } from "../../../shared/components/common/Common.jsx";
=======
import { Card, GlassBackground } from "../../../shared/components/common/Common.jsx";
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
import { Input } from "../../../shared/components/common/Input.jsx";
import { MaterialIcons } from "@expo/vector-icons";
import { getImageUrl } from "../../../shared/utils/cloudinary.js";

export default function MenuDetailScreen({ route, navigation }) {
  const { product, isNew } = route.params || {};
  const { createProduct, updateProduct, deleteProduct, categories, fetchCategories, isAdmin, loading } = useMenu();
  const addItemToCart = useCartStore((state) => state.addItem);

  // Customer State
  const [quantity, setQuantity] = useState(1);

  // Admin States
  const [editMode, setEditMode] = useState(isNew || false);
  const [saucer, setSaucer] = useState(product?.saucer || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price ? String(product.price) : "");
  const [category, setCategory] = useState(product?.category?._id || product?.category || "");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchCategories().then((cats) => {
      if (cats.length > 0 && !category) {
        setCategory(cats[0]._id);
      }
    });
  }, [fetchCategories]);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permiso Denegado", "Se requieren permisos para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    if (!saucer || !description || !price || !category) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    const data = { saucer, description, price: parseFloat(price), category };
    let res;

    if (isNew) {
      res = await createProduct(data, selectedImage);
    } else {
      res = await updateProduct(product._id, data, selectedImage);
    }

    if (res.success) {
      Alert.alert("Éxito", isNew ? "Platillo creado exitosamente." : "Platillo actualizado exitosamente.");
      navigation.goBack();
    } else {
      Alert.alert("Error", res.error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Platillo",
      `¿Estás seguro de que deseas eliminar ${product.saucer}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const res = await deleteProduct(product._id);
            if (res.success) {
              Alert.alert("Eliminado", "El platillo se ha desactivado de la carta.");
              navigation.goBack();
            } else {
              Alert.alert("Error", res.error);
            }
          }
        }
      ]
    );
  };

  const handleAddToCart = () => {
    addItemToCart(product, quantity);
    Alert.alert(
      "Agregado al pedido",
      `${quantity}x ${product.saucer} agregado a tu orden.`,
      [
        { text: "Seguir viendo", style: "cancel" },
        { text: "Ver mi pedido", onPress: () => navigation.navigate("CreateOrder") }
      ]
    );
  };

  if (isAdmin) {
    // VISTA DE ADMINISTRADOR: Detalle, edición y creación de platillo
    return (
<<<<<<< HEAD
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.detailCard}>
          <Text style={styles.modalTitle}>{isNew ? "Nuevo Platillo" : editMode ? "Editar Platillo" : saucer}</Text>

          {editMode ? (
            <View style={styles.editForm}>
              {/* Image Picker */}
              <TouchableOpacity style={styles.imageSelector} onPress={handlePickImage}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage.uri }} style={styles.selectedImg} />
                ) : product?.photo ? (
                  <Image source={{ uri: getImageUrl(product.photo) }} style={styles.selectedImg} />
                ) : (
                  <View style={styles.imageSelectorPlaceholder}>
                    <MaterialIcons name="add-a-photo" size={36} color={COLORS.primary} />
                    <Text style={styles.imageSelectorText}>Subir Foto del Platillo</Text>
                  </View>
                )}
              </TouchableOpacity>

              <Input
                label="Nombre del Platillo"
                placeholder="Ej. Tacos al Pastor"
                value={saucer}
                onChangeText={setSaucer}
              />

              <Input
                label="Descripción"
                placeholder="Ej. Tres tacos de maíz con carne al pastor..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />

              <Input
                label="Precio ($)"
                placeholder="Ej. 12.50"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />

              <Text style={styles.selectLabel}>Categoría</Text>
              <View style={styles.categoryDropdown}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat._id}
                      style={[
                        styles.catSelectBtn,
                        category === cat._id ? styles.catSelectBtnActive : null
                      ]}
                      onPress={() => setCategory(cat._id)}
                    >
                      <Text style={[
                        styles.catSelectText,
                        category === cat._id ? styles.catSelectTextActive : null
                      ]}>
                        {cat.categoryName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.btnRow}>
                <Button
                  title="Cancelar"
                  type="secondary"
                  onPress={() => {
                    if (isNew) {
                      navigation.goBack();
                    } else {
                      setEditMode(false);
                      setSaucer(product.saucer);
                      setDescription(product.description);
                      setPrice(String(product.price));
                      setCategory(product.category?._id || product.category);
                    }
                  }}
                  style={styles.formBtn}
                />
                <Button
                  title="Guardar"
                  type="primary"
                  loading={loading}
                  onPress={handleSave}
                  style={styles.formBtn}
                />
              </View>
            </View>
          ) : (
            <View style={styles.readOnlyView}>
              <Image
                source={{ uri: getImageUrl(product.photo) }}
                style={styles.previewImage}
              />
              <View style={styles.infoBlock}>
                <Text style={styles.priceTag}>${product.price}</Text>
                <Text style={styles.descriptionText}>{product.description}</Text>
              </View>

              <View style={styles.actionRowAdmin}>
                <Button
                  title="Editar"
                  type="primary"
                  onPress={() => setEditMode(true)}
                  style={styles.actionBtnAdmin}
                />
                <Button
                  title="Eliminar"
                  type="secondary"
                  onPress={handleDelete}
                  style={[styles.actionBtnAdmin, { borderColor: COLORS.error }]}
                />
              </View>
            </View>
          )}
        </Card>
      </ScrollView>
=======
      <GlassBackground style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.detailCard}>
            <Text style={styles.modalTitle}>{isNew ? "Nuevo Platillo" : editMode ? "Editar Platillo" : saucer}</Text>

            {editMode ? (
              <View style={styles.editForm}>
                {/* Image Picker */}
                <TouchableOpacity style={styles.imageSelector} onPress={handlePickImage}>
                  {selectedImage ? (
                    <Image source={{ uri: selectedImage.uri }} style={styles.selectedImg} />
                  ) : product?.photo ? (
                    <Image source={{ uri: getImageUrl(product.photo) }} style={styles.selectedImg} />
                  ) : (
                    <View style={styles.imageSelectorPlaceholder}>
                      <MaterialIcons name="add-a-photo" size={36} color={COLORS.primary} />
                      <Text style={styles.imageSelectorText}>Subir Foto del Platillo</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <Input
                  label="Nombre del Platillo"
                  placeholder="Ej. Tacos al Pastor"
                  value={saucer}
                  onChangeText={setSaucer}
                />

                <Input
                  label="Descripción"
                  placeholder="Ej. Tres tacos de maíz con carne al pastor..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />

                <Input
                  label="Precio (Q)"
                  placeholder="Ej. 12.50"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />

                <Text style={styles.selectLabel}>Categoría</Text>
                <View style={styles.categoryDropdown}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat._id}
                        style={[
                          styles.catSelectBtn,
                          category === cat._id ? styles.catSelectBtnActive : null
                        ]}
                        onPress={() => setCategory(cat._id)}
                      >
                        <Text style={[
                          styles.catSelectText,
                          category === cat._id ? styles.catSelectTextActive : null
                        ]}>
                          {cat.categoryName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.btnRow}>
                  <Button
                    title="Cancelar"
                    type="secondary"
                    onPress={() => {
                      if (isNew) {
                        navigation.goBack();
                      } else {
                        setEditMode(false);
                        setSaucer(product.saucer);
                        setDescription(product.description);
                        setPrice(String(product.price));
                        setCategory(product.category?._id || product.category);
                      }
                    }}
                    style={styles.formBtn}
                  />
                  <Button
                    title="Guardar"
                    type="primary"
                    loading={loading}
                    onPress={handleSave}
                    style={styles.formBtn}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.readOnlyView}>
                <Image
                  source={{ uri: getImageUrl(product.photo) }}
                  style={styles.previewImage}
                />
                <View style={styles.infoBlock}>
                  <Text style={styles.priceTag}>Q{product.price}</Text>
                  <Text style={styles.descriptionText}>{product.description}</Text>
                </View>

                <View style={styles.actionRowAdmin}>
                  <Button
                    title="Editar"
                    type="primary"
                    onPress={() => setEditMode(true)}
                    style={styles.actionBtnAdmin}
                  />
                  <Button
                    title="Eliminar"
                    type="secondary"
                    onPress={handleDelete}
                    style={[styles.actionBtnAdmin, { borderColor: COLORS.error }]}
                  />
                </View>
              </View>
            )}
          </Card>
        </ScrollView>
      </GlassBackground>
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
    );
  }

  // VISTA DE CLIENTE: Detalles del Platillo
  return (
<<<<<<< HEAD
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Image
        source={{ uri: getImageUrl(product.photo) }}
        style={styles.heroImage}
      />

      <View style={styles.detailsCardContainer}>
        <Text style={styles.name}>{product.saucer}</Text>
        <Text style={styles.priceTagHero}>${product.price}</Text>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Ingredientes e Info</Text>
          <Text style={styles.description}>{product.description}</Text>
        </Card>

        {/* Stepper Count Selector */}
        <View style={styles.stepperCard}>
          <Text style={styles.stepperLabel}>Cantidad</Text>
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <MaterialIcons name="remove" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.stepperVal}>{quantity}</Text>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setQuantity(quantity + 1)}
            >
              <MaterialIcons name="add" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Añadir a mi Pedido"
          type="primary"
          onPress={handleAddToCart}
          style={styles.addBtn}
        />
      </View>
    </ScrollView>
=======
    <GlassBackground style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: getImageUrl(product.photo) }}
          style={styles.heroImage}
        />

        <View style={styles.detailsCardContainer}>
          <Text style={styles.name}>{product.saucer}</Text>
          <Text style={styles.priceTagHero}>Q{product.price}</Text>

          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Ingredientes e Info</Text>
            <Text style={styles.description}>{product.description}</Text>
          </Card>

          {/* Stepper Count Selector */}
          <View style={styles.stepperCard}>
            <Text style={styles.stepperLabel}>Cantidad</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <MaterialIcons name="remove" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.stepperVal}>{quantity}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <MaterialIcons name="add" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Añadir a mi Pedido"
            type="primary"
            onPress={handleAddToCart}
            style={styles.addBtn}
          />
        </View>
      </ScrollView>
    </GlassBackground>
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: COLORS.background,
=======
    backgroundColor: "transparent",
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  detailCard: {
    margin: SPACING.md,
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
  editForm: {
    marginTop: SPACING.xs,
  },
  imageSelector: {
    width: "100%",
    height: 180,
    borderRadius: 14,
<<<<<<< HEAD
    borderWidth: 1.5,
    borderColor: COLORS.border,
=======
    borderWidth: 1,
    borderColor: "#FCE8D9",
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: SPACING.md,
<<<<<<< HEAD
    backgroundColor: COLORS.background,
=======
    backgroundColor: "#FFFFFF",
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
  },
  imageSelectorPlaceholder: {
    alignItems: "center",
  },
  imageSelectorText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    fontWeight: "700",
    marginTop: 6,
  },
  selectedImg: {
    width: "100%",
    height: "100%",
  },
  selectLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 6,
  },
  categoryDropdown: {
    flexDirection: "row",
    marginBottom: SPACING.md,
  },
  catSelectBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: 12,
<<<<<<< HEAD
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.surface,
=======
    borderWidth: 1,
    borderColor: "#FCE8D9",
    marginRight: SPACING.sm,
    backgroundColor: "#FFFFFF",
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
  },
  catSelectBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(226, 92, 0, 0.08)",
  },
  catSelectText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  catSelectTextActive: {
    color: COLORS.primary,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  formBtn: {
    flex: 0.48,
    height: 45,
  },
  readOnlyView: {
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginBottom: SPACING.md,
  },
  infoBlock: {
    width: "100%",
    marginBottom: SPACING.lg,
  },
  priceTag: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  descriptionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  actionRowAdmin: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionBtnAdmin: {
    flex: 0.48,
    height: 45,
  },
  // CUSTOMER STYLES
  heroImage: {
    width: "100%",
    height: 250,
    backgroundColor: COLORS.secondary,
  },
  detailsCardContainer: {
    padding: SPACING.lg,
    marginTop: -SPACING.lg,
<<<<<<< HEAD
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
=======
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: "#FCE8D9",
    borderBottomWidth: 0,
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
  },
  name: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    color: COLORS.text,
  },
  priceTagHero: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    color: COLORS.primary,
    marginVertical: SPACING.sm,
  },
  card: {
    marginBottom: SPACING.md,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  stepperCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
<<<<<<< HEAD
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
=======
    backgroundColor: "#FFFFFF",
    padding: SPACING.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FCE8D9",
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
    marginBottom: SPACING.lg,
  },
  stepperLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.text,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
<<<<<<< HEAD
    backgroundColor: COLORS.surface,
=======
    backgroundColor: "#FFFFFF",
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
  },
  stepperVal: {
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
    color: COLORS.text,
    marginHorizontal: SPACING.md,
  },
  addBtn: {
    height: 50,
    borderRadius: 14,
  },
});
