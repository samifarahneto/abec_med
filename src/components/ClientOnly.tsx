"use client";

import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente que garante que o conteúdo só seja renderizado no cliente
 * Útil para evitar problemas de hidratação com componentes que dependem
 * de APIs específicas do browser
 */
export default function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Garantir que estamos no cliente
    if (typeof window !== "undefined") {
      setHasMounted(true);
    }
  }, []);

  // Se não estiver montado, retornar fallback ou null
  if (!hasMounted) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
