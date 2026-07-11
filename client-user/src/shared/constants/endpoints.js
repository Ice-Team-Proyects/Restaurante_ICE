// c:/neww/Restaurante_ICE/client-user/src/shared/constants/endpoints.js
import { Platform } from "react-native";

// En emuladores Android, 10.0.2.2 apunta al localhost de la máquina anfitriona
const IP = Platform.OS === "android" ? "10.0.2.2" : "localhost";

export const ENDPOINTS = {
  AUTH: process.env.EXPO_PUBLIC_AUTH_URL || `http://${IP}:5227/api/v1/auth`,
  USER: process.env.EXPO_PUBLIC_USER_URL || `http://${IP}:3021/RestauranteICE/v1`,
};
