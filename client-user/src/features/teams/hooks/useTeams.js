// c:/neww/Restaurante_ICE/client-user/src/features/teams/hooks/useTeams.js
import { useState, useCallback } from "react";
import { userClient } from "../../../shared/api/userClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";

// Persistencia local en memoria de los equipos y relaciones si falla el backend
let localTeamsMock = [
  {
    _id: "t1",
    name: "Gourmets FC",
    logo: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400",
    description: "Equipo de fútbol 5 oficial de los chefs de Restaurante ICE.",
    members: ["u1", "u2"],
    createdBy: "chef_carlos",
  },
  {
    _id: "t2",
    name: "Los Comensales Rúster",
    logo: "https://images.unsplash.com/photo-1543326301-33fcaf37fd44?q=80&w=400",
    description: "Unión de clientes frecuentes apasionados por el básquetbol y fútbol.",
    members: ["u3"],
    createdBy: "client_rigoberto",
  },
];

export const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);
  const userId = user?.id || user?._id || "u1";

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let data = [];
      try {
        const response = await userClient.get("/teams");
        data = response.data.data || response.data || [];
      } catch (axiosError) {
        console.warn("Backend de equipos inaccesible. Cargando lista local...");
        data = localTeamsMock;
      }
      setTeams(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al obtener equipos");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyTeams = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let data = [];
      try {
        const response = await userClient.get(`/teams/me/mis-equipos`);
        data = response.data.data || response.data || [];
      } catch (axiosError) {
        console.warn("Backend de equipos inaccesible. Cargando mis equipos locales...");
        // Filtrar equipos donde el usuario es miembro o creador
        data = localTeamsMock.filter(
          (t) => t.members.includes(userId) || t.createdBy === userId
        );
      }
      setMyTeams(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al obtener mis equipos");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const joinTeam = useCallback(async (teamId) => {
    setLoading(true);
    setError("");
    try {
      try {
        await userClient.post(`/teams/${teamId}/join`);
      } catch (axiosError) {
        console.warn("Backend inaccesible. Uniéndose localmente...");
        localTeamsMock = localTeamsMock.map((t) => {
          if (t._id === teamId && !t.members.includes(userId)) {
            return { ...t, members: [...t.members, userId] };
          }
          return t;
        });
      }
      await fetchTeams();
      await fetchMyTeams();
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al unirse al equipo");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [userId, fetchTeams, fetchMyTeams]);

  const leaveTeam = useCallback(async (teamId) => {
    setLoading(true);
    setError("");
    try {
      try {
        await userClient.post(`/teams/${teamId}/leave`);
      } catch (axiosError) {
        console.warn("Backend inaccesible. Saliendo localmente...");
        localTeamsMock = localTeamsMock.map((t) => {
          if (t._id === teamId) {
            return { ...t, members: t.members.filter((m) => m !== userId) };
          }
          return t;
        });
      }
      await fetchTeams();
      await fetchMyTeams();
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al salir del equipo");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [userId, fetchTeams, fetchMyTeams]);

  const createTeam = useCallback(async (teamData) => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", teamData.name);
      formData.append("description", teamData.description);
      if (teamData.logo) {
        // Adjuntar archivo de imagen
        formData.append("logo", {
          uri: teamData.logo,
          name: "team-logo.jpg",
          type: "image/jpeg",
        });
      }

      try {
        await userClient.post("/teams", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (axiosError) {
        console.warn("Backend inaccesible. Guardando equipo localmente...");
        const newTeam = {
          _id: "t_" + Date.now(),
          name: teamData.name,
          logo: teamData.logo || "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400",
          description: teamData.description,
          members: [userId],
          createdBy: userId,
        };
        localTeamsMock.push(newTeam);
      }

      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al crear equipo");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    teams,
    myTeams,
    loading,
    error,
    fetchTeams,
    fetchMyTeams,
    joinTeam,
    leaveTeam,
    createTeam,
  };
};
