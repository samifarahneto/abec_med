import { useState, useMemo, useCallback } from "react";
import { normalizeForSearch } from "@/utils/stringUtils";

export interface City {
  id: number;
  name: string;
  stateId: number;
}

export interface UseCitiesReturn {
  cities: City[];
  loading: boolean;
  error: string | null;
  searchCities: (query: string) => City[];
  fetchCitiesByState: (stateId: number) => Promise<void>;
  clearCities: () => void;
}

export function useCities(): UseCitiesReturn {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStateId, setCurrentStateId] = useState<number | null>(null);

  // Função para buscar cidades por estado
  const fetchCitiesByState = useCallback(
    async (stateId: number) => {
      if (currentStateId === stateId && cities.length > 0) {
        // Se já temos as cidades deste estado, não buscar novamente
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/proxy/cities?stateId=${stateId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar cidades: ${response.status}`);
        }

        const data = await response.json();
        setCities(data);
        setCurrentStateId(stateId);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao buscar cidades";
        setError(errorMessage);
        console.error("Erro ao buscar cidades:", err);
        setCities([]);
      } finally {
        setLoading(false);
      }
    },
    [currentStateId, cities.length]
  );

  // Função para filtrar cidades baseado na query
  const searchCities = useMemo(() => {
    return (query: string): City[] => {
      if (!query || query.length === 0) {
        return [];
      }

      const normalizedQuery = normalizeForSearch(query);

      // Filtrar apenas cidades do estado atual
      return cities.filter((city) =>
        normalizeForSearch(city.name).includes(normalizedQuery)
      );
    };
  }, [cities]);

  // Função para limpar cidades (quando estado é alterado)
  const clearCities = useCallback(() => {
    setCities([]);
    setCurrentStateId(null);
    setError(null);
  }, []);

  return {
    cities,
    loading,
    error,
    searchCities,
    fetchCitiesByState,
    clearCities,
  };
}
