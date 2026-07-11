// c:/neww/Restaurante_ICE/client-user/src/shared/utils/cloudinary.js
const CLOUD_NAME = "dss7fs6pl";
const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

export const getImageUrl = (photo) => {
  const defaultFood = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600";
  const defaultRestaurant = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800";

  if (!photo) return defaultFood;

  const photoStr = String(photo).toLowerCase();

  // If the database has a default image or placeholder string, return a beautiful Unsplash placeholder
  if (
    photoStr.includes("default_product_image") ||
    photoStr.includes("default-product") ||
    photoStr.includes("default_product") ||
    photoStr.includes("placeholder") ||
    photoStr.includes("sin-imagen")
  ) {
    return defaultFood;
  }

  if (
    photoStr.includes("default_restaurant_image") ||
    photoStr.includes("default-restaurant") ||
    photoStr.includes("default_restaurant") ||
    photoStr.includes("ubications/default")
  ) {
    return defaultRestaurant;
  }

  // If it's already a full URL, return it directly
  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  let path = photo;
  // Remove leading slash if any
  if (path.startsWith("/")) {
    path = path.slice(1);
  }

  // Prepend prefix folder if missing
  if (!path.startsWith("Restaurante_ICE/")) {
    path = "Restaurante_ICE/" + path;
  }

  // Ensure file extension is present for Cloudinary dynamic format delivery
  if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(path)) {
    path = path + ".jpg";
  }

  return `${CLOUDINARY_BASE}/${path}`;
};
