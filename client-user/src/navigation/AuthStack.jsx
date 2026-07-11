// c:/neww/Restaurante_ICE/client-user/src/navigation/AuthStack.jsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../features/auth/screens/LoginScreen.jsx";
import RegisterScreen from "../features/auth/screens/RegisterScreen.jsx";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
