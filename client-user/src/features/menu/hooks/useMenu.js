// c:/neww/Restaurante_ICE/client-user/src/features/menu/hooks/useMenu.js
import { useState, useCallback } from "react";
import { userClient } from "../../../shared/api/userClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";

export const useMenu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);

  const isAdmin =
    user?.role?.toUpperCase() === "ADMIN" ||
    user?.role?.toUpperCase() === "ADMIN_ROLE" ||
    user?.email?.toLowerCase() === "admin@restaurante.com" ||
    user?.email?.toLowerCase().includes("admin");

  const fetchCategories = useCallback(async () => {
    try {
      const response = await userClient.get("/category");
      const data = response.data?.data || response.data || [];
      // Filter only active categories
      const active = data.filter((c) => c.isActive !== false);
      setCategories(active);
      return active;
    } catch (err) {
      console.error("Error al obtener categorías:", err);
      return [];
    }
  }, []);

  const fetchProducts = useCallback(async (selectedCategoryId = null) => {
    setLoading(true);
    setError("");
    try {
      const response = await userClient.get("/product");
      const data = response.data?.data || response.data || [];
      
      // Filter active products
      let active = data.filter((p) => p.isActive !== false);
      
      if (selectedCategoryId) {
        active = active.filter((p) => p.category === selectedCategoryId || p.category?._id === selectedCategoryId);
      }
      
      setProducts(active);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al cargar productos"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (productData, imageFile = null) => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("saucer", productData.saucer);
      formData.append("description", productData.description);
      formData.append("price", String(productData.price));
      formData.append("category", productData.category);

      if (imageFile) {
        formData.append("image", {
          uri: imageFile.uri,
          name: imageFile.name || "product-image.jpg",
          type: imageFile.type || "image/jpeg",
        });
      }

      const response = await userClient.post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchProducts();
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error al crear platillo";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData, imageFile = null) => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      if (productData.saucer) formData.append("saucer", productData.saucer);
      if (productData.description) formData.append("description", productData.description);
      if (productData.price) formData.append("price", String(productData.price));
      if (productData.category) formData.append("category", productData.category);

      if (imageFile) {
        formData.append("image", {
          uri: imageFile.uri,
          name: imageFile.name || "product-image.jpg",
          type: imageFile.type || "image/jpeg",
        });
      }

      const response = await userClient.put(`/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchProducts();
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error al actualizar platillo";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError("");
    try {
      await userClient.patch(`/product/delete/${id}`);
      await fetchProducts();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error al eliminar platillo";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    setLoading(true);
    setError("");
    try {
      const response = await userClient.post("/category", {
        categoryName: categoryData.categoryName,
        type: categoryData.type || "Platillos",
        description: categoryData.description,
      });
      await fetchCategories();
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error al crear categoría";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    categories,
    loading,
    error,
    fetchCategories,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    isAdmin,
  };
};
