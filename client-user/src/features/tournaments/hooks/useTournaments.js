// c:/neww/Restaurante_ICE/client-user/src/features/tournaments/hooks/useTournaments.js
import { useState, useCallback } from "react";
import { userClient } from "../../../shared/api/userClient.js";

// Persistencia local en memoria de los torneos e inscripciones si falla el backend
let localTournamentsMock = [
  {
    _id: "trn1",
    name: "Copa Gastronómica Fútbol 5",
    description: "El torneo más grande del año para nuestros comensales y patrocinadores.",
    reward: "Cena completa gratis para el equipo ganador + Trofeo ICE",
    startDate: "2026-07-01",
    registeredTeams: ["t1"],
  },
  {
    _id: "trn2",
    name: "Torneo Relámpago de Billar",
    description: "Competencia de bola 8 en las mesas de Restaurante ICE.",
    reward: "Botella de vino Premium + Tarjeta de regalo de Q500",
    startDate: "2026-06-28",
    registeredTeams: [],
  },
];

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let data = [];
      try {
        const response = await userClient.get("/tournaments");
        data = response.data.data || response.data || [];
      } catch (axiosError) {
        console.warn("Backend de torneos inaccesible. Cargando lista local...");
        data = localTournamentsMock;
      }
      setTournaments(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al obtener torneos");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyTournaments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let data = [];
      try {
        const response = await userClient.get("/tournaments/my-tournaments");
        data = response.data.data || response.data || [];
      } catch (axiosError) {
        console.warn("Backend de torneos inaccesible. Cargando mis torneos locales...");
        // Consideramos torneos en los que el equipo del usuario ("t1") está registrado
        data = localTournamentsMock.filter((t) => t.registeredTeams.includes("t1"));
      }
      setMyTournaments(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al obtener mis torneos");
    } finally {
      setLoading(false);
    }
  }, []);

  const registerTeamForTournament = useCallback(async (tournamentId, teamId) => {
    setLoading(true);
    setError("");
    try {
      try {
        await userClient.post(`/tournaments/register/${tournamentId}`, { teamId });
      } catch (axiosError) {
        console.warn("Backend inaccesible. Registrando equipo localmente en el torneo...");
        localTournamentsMock = localTournamentsMock.map((t) => {
          if (t._id === tournamentId && !t.registeredTeams.includes(teamId)) {
            return { ...t, registeredTeams: [...t.registeredTeams, teamId] };
          }
          return t;
        });
      }
      await fetchTournaments();
      await fetchMyTournaments();
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al inscribir el equipo");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchTournaments, fetchMyTournaments]);

  return {
    tournaments,
    myTournaments,
    loading,
    error,
    fetchTournaments,
    fetchMyTournaments,
    registerTeamForTournament,
  };
};
