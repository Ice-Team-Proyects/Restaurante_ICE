// c:/neww/Restaurante_ICE/client-user/src/navigation/AppNavigator.jsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useAuthStore } from "../shared/store/authStore.js";
import { LoadingSpinner } from "../shared/components/common/Common.jsx";
import { COLORS } from "../shared/constants/theme.js";
import AuthStack from "./AuthStack.jsx";
import MainTabs from "./MainTabs.jsx";

export default function AppNavigator() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  // Mostrar el spinner de carga si la persistencia de Zustand aún no se ha hidratado
  if (!_hasHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner fullScreen />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});
