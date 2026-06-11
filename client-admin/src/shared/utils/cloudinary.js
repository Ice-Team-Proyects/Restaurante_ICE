const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dss7fs6pl';
const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

export const getImageUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  
  let path = photo;
  if (!path.startsWith("Restaurante_ICE/")) {
    path = "Restaurante_ICE/" + path;
  }
  
  if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(path)) {
    path = path + ".jpg";
  }
  
  return `${CLOUDINARY_BASE}/${path}`;
};
