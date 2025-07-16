import { useState, useEffect, useMemo } from "react";
import { normalizeForSearch } from "@/utils/stringUtils";

export interface State {
  id: number;
  name: string;
  uf: string;
}

export interface UseStatesReturn {
  states: State[];
  loading: boolean;
  error: string | null;
  searchStates: (query: string) => State[];
}

export function useStates(): UseStatesReturn {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar todos os estados na primeira renderização
  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/proxy/states", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar estados: ${response.status}`);
        }

        const data = await response.json();
        setStates(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao buscar estados";
        setError(errorMessage);
        console.error("Erro ao buscar estados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  // Função para filtrar estados baseado na query
  const searchStates = useMemo(() => {
    return (query: string): State[] => {
      if (!query || query.length === 0) {
        return [];
      }

      const normalizedQuery = normalizeForSearch(query);

      return states.filter(
        (state) =>
          normalizeForSearch(state.name).includes(normalizedQuery) ||
          normalizeForSearch(state.uf).includes(normalizedQuery)
      );
    };
  }, [states]);

  return {
    states,
    loading,
    error,
    searchStates,
  };
}
