// c:/neww/Restaurante_ICE/client-user/src/navigation/MainTabs.jsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../shared/constants/theme.js";
import { useAuthStore } from "../shared/store/authStore.js";

// Importar pantallas del restaurante
import RestaurantListScreen from "../features/restaurant/screens/RestaurantListScreen.jsx";
import RestaurantDetailScreen from "../features/restaurant/screens/RestaurantDetailScreen.jsx";

import MenuListScreen from "../features/menu/screens/MenuListScreen.jsx";
import MenuDetailScreen from "../features/menu/screens/MenuDetailScreen.jsx";

import OrdersListScreen from "../features/orders/screens/OrdersListScreen.jsx";
import CreateOrderScreen from "../features/orders/screens/CreateOrderScreen.jsx";

import EventsListScreen from "../features/events/screens/EventsListScreen.jsx";
import EventDetailScreen from "../features/events/screens/EventDetailScreen.jsx";
import CreateEventScreen from "../features/events/screens/CreateEventScreen.jsx";

import ReservationsScreen from "../features/reservations/screens/ReservationsScreen.jsx";
import CreateReservationScreen from "../features/reservations/screens/CreateReservationScreen.jsx";

import ProfileScreen from "../features/profile/screens/ProfileScreen.jsx";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Restaurant / Tables Stack
function RestaurantStack() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && (
    user.role?.toUpperCase() === 'ADMIN' ||
    user.role?.toUpperCase() === 'ADMIN_ROLE' ||
    user.email?.toLowerCase() === 'admin@restaurante.com' ||
    user.email?.toLowerCase().includes('admin')
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.surface,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen
        name="RestaurantList"
        options={{ title: isAdmin ? "Mesas de Clientes" : "Sucursales" }}
        component={RestaurantListScreen}
      />
      <Stack.Screen
        name="RestaurantDetail"
        options={{ title: isAdmin ? "Gestión de Mesa" : "Detalle Sucursal" }}
        component={RestaurantDetailScreen}
      />
      <Stack.Screen
        name="CreateReservation"
        options={{ title: "Reservar Mesa" }}
        component={CreateReservationScreen}
      />
    </Stack.Navigator>
  );
}

// 2. Menu Stack
function MenuStack() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && (
    user.role?.toUpperCase() === 'ADMIN' ||
    user.role?.toUpperCase() === 'ADMIN_ROLE' ||
    user.email?.toLowerCase() === 'admin@restaurante.com' ||
    user.email?.toLowerCase().includes('admin')
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.surface,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen
        name="MenuList"
        options={{ title: isAdmin ? "Administrar Menú" : "Carta del Menú" }}
        component={MenuListScreen}
      />
      <Stack.Screen
        name="MenuDetail"
        options={{ title: isAdmin ? "Configurar Platillo" : "Detalle Platillo" }}
        component={MenuDetailScreen}
      />
      <Stack.Screen
        name="CreateOrder"
        options={{ title: "Confirmar Pedido" }}
        component={CreateOrderScreen}
      />
    </Stack.Navigator>
  );
}

// 3. Orders Stack
function OrdersStack() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && (
    user.role?.toUpperCase() === 'ADMIN' ||
    user.role?.toUpperCase() === 'ADMIN_ROLE' ||
    user.email?.toLowerCase() === 'admin@restaurante.com' ||
    user.email?.toLowerCase().includes('admin')
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.surface,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen
        name="OrdersList"
        options={{ title: isAdmin ? "Pedidos de Mesa" : "Mis Pedidos" }}
        component={OrdersListScreen}
      />
    </Stack.Navigator>
  );
}

// 4. Events Stack
function EventsStack() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && (
    user.role?.toUpperCase() === 'ADMIN' ||
    user.role?.toUpperCase() === 'ADMIN_ROLE' ||
    user.email?.toLowerCase() === 'admin@restaurante.com' ||
    user.email?.toLowerCase().includes('admin')
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.surface,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen
        name="EventsList"
        options={{ title: isAdmin ? "Gestor de Actividades" : "Eventos" }}
        component={EventsListScreen}
      />
      <Stack.Screen
        name="EventDetail"
        options={{ title: isAdmin ? "Reporte Asistentes" : "Detalles Evento" }}
        component={EventDetailScreen}
      />
      <Stack.Screen
        name="CreateEvent"
        options={{ title: "Crear Evento / Promo" }}
        component={CreateEventScreen}
      />
    </Stack.Navigator>
  );
}

// 5. Reservations Stack
function ReservationsStack() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && (
    user.role?.toUpperCase() === 'ADMIN' ||
    user.role?.toUpperCase() === 'ADMIN_ROLE' ||
    user.email?.toLowerCase() === 'admin@restaurante.com' ||
    user.email?.toLowerCase().includes('admin')
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.surface,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen
        name="ReservationsList"
        options={{ title: isAdmin ? "Reservaciones Clientes" : "Mis Reservaciones" }}
        component={ReservationsScreen}
      />
    </Stack.Navigator>
  );
}

// --- MAIN BOTTOM TAB NAVIGATOR ---
export default function MainTabs() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && (
    user.role?.toUpperCase() === 'ADMIN' ||
    user.role?.toUpperCase() === 'ADMIN_ROLE' ||
    user.email?.toLowerCase() === 'admin@restaurante.com' ||
    user.email?.toLowerCase().includes('admin')
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "RestaurantTab") {
            iconName = isAdmin ? "table-restaurant" : "storefront";
          } else if (route.name === "MenuTab") {
            iconName = "restaurant-menu";
          } else if (route.name === "OrdersTab") {
            iconName = isAdmin ? "assignment" : "shopping-bag";
          } else if (route.name === "EventsTab") {
            iconName = "event";
          } else if (route.name === "ReservationsTab") {
            iconName = "bookmark";
          } else if (route.name === "ProfileTab") {
            iconName = "person";
          }
 
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          height: 60,
          borderTopWidth: 1.5,
          borderTopColor: COLORS.border,
          paddingBottom: 8,
          paddingTop: 6,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="RestaurantTab"
        component={RestaurantStack}
        options={{ tabBarLabel: isAdmin ? "Mesas" : "Sucursales" }}
      />
      <Tab.Screen
        name="MenuTab"
        component={MenuStack}
        options={{ tabBarLabel: isAdmin ? "Platillos" : "Menú" }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{ tabBarLabel: isAdmin ? "Pedidos Mesa" : "Pedidos" }}
      />
      <Tab.Screen
        name="EventsTab"
        component={EventsStack}
        options={{ tabBarLabel: "Eventos" }}
      />
      <Tab.Screen
        name="ReservationsTab"
        component={ReservationsStack}
        options={{ tabBarLabel: "Reservas" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          headerShown: true,
          title: "Mi Perfil",
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.surface,
          headerTitleStyle: { fontWeight: "700" },
        }}
      />
    </Tab.Navigator>
  );
}
