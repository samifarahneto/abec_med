"use client";

import { useEffect, useState } from "react";

/**
 * Hook para controlar quando um componente foi montado no cliente
 * Útil para evitar problemas de hidratação em componentes que dependem
 * do estado do browser ou APIs específicas do cliente
 */
export function useClientMount() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Garantir que estamos realmente no cliente
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  // Fallback adicional: verificar se estamos no cliente
  return isMounted && typeof window !== "undefined";
}

/**
 * Hook mais avançado que também verifica se o DOM está completamente carregado
 */
export function useClientReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Verificar se estamos no cliente primeiro
    if (typeof window === "undefined") return;

    // Verifica se o documento já está carregado
    if (document.readyState === "complete") {
      setIsReady(true);
    } else {
      // Aguarda o carregamento completo
      const handleLoad = () => setIsReady(true);
      window.addEventListener("load", handleLoad);

      // Fallback: se não carregar em 2 segundos, assume como pronto
      const timeout = setTimeout(() => setIsReady(true), 2000);

      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(timeout);
      };
    }
  }, []);

  return isReady && typeof window !== "undefined";
}
