// c:/neww/Restaurante_ICE/client-user/src/shared/constants/endpoints.js
import { Platform } from "react-native";

// Usamos localhost y 'adb reverse' para evitar bloqueos de firewall en Windows
const IP = "localhost";

export const ENDPOINTS = {
  AUTH: process.env.EXPO_PUBLIC_AUTH_URL || `http://${IP}:5227/api/v1/auth`,
  USER: process.env.EXPO_PUBLIC_USER_URL || `http://${IP}:3021/RestauranteICE/v1`,
};
