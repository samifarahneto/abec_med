"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import PrivateHeader from "@/components/PrivateHeader";

interface LayoutContextType {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (expanded: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout deve ser usado dentro de um LayoutProvider");
  }
  return context;
};

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Controle de hidratação
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Função para verificar se é rota pública
  const isPublicRoute = () => {
    const publicRoutes = ["/", "/login", "/registrar", "/register"];
    return publicRoutes.includes(pathname);
  };

  // Definir estado inicial da sidebar baseado no tamanho da tela
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      // Em mobile (< 640px), sidebar sempre fechada
      // Em desktop (>= 640px), sidebar expandida por padrão
      if (window.innerWidth < 640) {
        setIsSidebarExpanded(false);
      } else {
        setIsSidebarExpanded(true);
      }
    };

    // Definir estado inicial
    handleResize();

    // Adicionar listener para mudanças de tamanho
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMounted]);

  // Para rotas públicas, renderizar com contexto fake mas com header
  if (isPublicRoute()) {
    return (
      <LayoutContext.Provider
        value={{ isSidebarExpanded: false, setIsSidebarExpanded: () => {} }}
      >
        <Header />
        <main className="pt-16 min-h-screen bg-gray-50">{children}</main>
      </LayoutContext.Provider>
    );
  }

  // Para rotas autenticadas, renderizar com contexto real e PrivateHeader
  return (
    <LayoutContext.Provider value={{ isSidebarExpanded, setIsSidebarExpanded }}>
      {session && <PrivateHeader session={session} />}
      <main
        className={`pt-16 min-h-screen bg-gray-50 transition-all duration-300 ${
          isSidebarExpanded ? "ml-64 lg:ml-72" : "ml-12 lg:ml-16"
        }`}
      >
        {children}
      </main>
    </LayoutContext.Provider>
  );
}
