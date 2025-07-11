"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaBars } from "react-icons/fa";

interface LinkItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  submenu?: LinkItem[];
}

// Links para usuários não autenticados
const unauthenticatedLinks: LinkItem[] = [
  { href: "/", label: "Início" },
  { href: "/login", label: "Entrar" },
  { href: "/registrar", label: "Registrar" },
];

// Componente para header público (sem contexto)
function PublicHeader() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  if (!isMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <nav className="w-full px-4 sm:px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-[120px] sm:w-[150px] md:w-[200px] h-8 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-20 h-6 bg-gray-100 rounded animate-pulse hidden sm:block"></div>
              <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="w-full px-4 sm:px-6">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="ABEC Med"
                width={200}
                height={40}
                priority
                className="w-[120px] sm:w-[150px] md:w-[200px]"
              />
            </Link>
          </div>

          {/* Menu de navegação */}
          <div className="hidden sm:flex items-center space-x-8">
            {unauthenticatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-[#16829E]"
                    : "text-gray-600 hover:text-[#16829E]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Menu mobile */}
          <div className="sm:hidden">
            <button className="p-2 text-gray-500 hover:text-[#16829E]">
              <FaBars className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

// Componente principal do Header
export default function Header() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { data: session, status } = useSession();

  // Função para verificar se é rota pública
  const isPublicRoute = () => {
    const publicRoutes = ["/", "/login", "/registrar", "/register"];
    return publicRoutes.includes(pathname);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shouldShowAuthenticatedHeader =
    isMounted &&
    status === "authenticated" &&
    session?.user &&
    !isPublicRoute();

  // Se não estiver montado ou ainda carregando, renderizar header skeleton
  if (!isMounted || status === "loading") {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <nav className="w-full px-4 sm:px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-[120px] sm:w-[150px] md:w-[200px] h-8 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-20 h-6 bg-gray-100 rounded animate-pulse hidden sm:block"></div>
              <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  // Header para usuários autenticados com sidebar
  if (shouldShowAuthenticatedHeader && isMounted) {
    // Renderizar um placeholder simples para rotas autenticadas
    // O LayoutWrapper irá renderizar o header correto
    return null;
  }

  // Header público para usuários não autenticados
  return <PublicHeader />;
}
