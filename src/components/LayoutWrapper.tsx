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
  const { data: session, status } = useSession();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Função para verificar se é rota pública
  const isPublicRoute = () => {
    const publicRoutes = ["/", "/login", "/registrar", "/register"];
    return publicRoutes.includes(pathname);
  };

  // Definir estado inicial da sidebar baseado no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      // Em mobile (< 640px), sidebar sempre fechada
      // Em desktop (>= 640px), pode manter aberta
      if (window.innerWidth < 640) {
        setIsSidebarExpanded(false);
      }
    };

    // Verificar tamanho inicial
    handleResize();

    // Adicionar listener para mudanças de tamanho
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determinar se deve aplicar margem da sidebar
  const shouldApplySidebarMargin =
    !isPublicRoute() && status === "authenticated" && session?.user;

  return (
    <LayoutContext.Provider value={{ isSidebarExpanded, setIsSidebarExpanded }}>
      <Header />
      <main
        className={`transition-all duration-300 pt-16 min-h-screen bg-gray-50 ${
          shouldApplySidebarMargin
            ? isSidebarExpanded
              ? "sm:ml-64 lg:ml-72"
              : "sm:ml-12 lg:ml-16"
            : ""
        }`}
      >
        {children}
      </main>
    </LayoutContext.Provider>
  );
}
