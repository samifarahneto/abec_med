"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaCog,
} from "react-icons/fa";
import { useLayout } from "@/components/LayoutWrapper";
import { useClientMount } from "@/hooks/useClientMount";

interface LinkItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  submenu?: LinkItem[];
}

// Links específicos por perfil
const profileLinks: Record<string, LinkItem[]> = {
  admin: [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      href: "/admin/pacientes",
      label: "Pacientes",
      icon: <FaUsers className="w-5 h-5" />,
    },
    {
      href: "/admin/medicos",
      label: "Médicos",
      icon: <FaUserCircle className="w-5 h-5" />,
    },
    {
      href: "/admin/acolhimento",
      label: "Acolhimento",
      icon: <FaCalendarAlt className="w-5 h-5" />,
    },
    {
      href: "/admin/administradores",
      label: "Administradores",
      icon: <FaCog className="w-5 h-5" />,
    },
  ],
  doctor: [
    {
      href: "/medic",
      label: "Dashboard",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      href: "/medic/pacientes",
      label: "Pacientes",
      icon: <FaUsers className="w-5 h-5" />,
    },
  ],
  reception: [
    {
      href: "/admin/acolhimento",
      label: "Acolhimento",
      icon: <FaCalendarAlt className="w-5 h-5" />,
    },
  ],
  patient: [
    {
      href: "/paciente/dashboard",
      label: "Dashboard",
      icon: <FaHome className="w-5 h-5" />,
    },
  ],
};

// Links para usuários não autenticados
const unauthenticatedLinks: LinkItem[] = [
  { href: "/", label: "Início" },
  { href: "/registrar", label: "Registrar-se" },
  { href: "/login", label: "Login" },
];

export default function Header() {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mounted = useClientMount();
  const { data: session, status } = useSession();

  // Usar o contexto do layout para o estado do sidebar
  const { isSidebarExpanded, setIsSidebarExpanded } = useLayout();

  const isActive = (path: string) => pathname === path;

  // Verifica se é uma rota pública
  const isPublicRoute = () => {
    const publicRoutes = ["/", "/login", "/registrar", "/register"];
    return publicRoutes.includes(pathname);
  };

  // Determinar se deve mostrar header autenticado ou público
  const shouldShowAuthenticatedHeader =
    mounted && status === "authenticated" && session?.user && !isPublicRoute();

  // Se não estiver montado ou ainda carregando, renderizar header skeleton
  if (!mounted || status === "loading") {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <nav className="w-full px-4 sm:px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Placeholder para logo */}
              <div className="w-[120px] sm:w-[150px] md:w-[200px] h-8 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Placeholder para menu */}
              <div className="w-20 h-6 bg-gray-100 rounded animate-pulse hidden sm:block"></div>
              <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  // Header para usuários autenticados com sidebar
  if (shouldShowAuthenticatedHeader && mounted) {
    const role = session?.user?.role as keyof typeof profileLinks;
    const links = profileLinks[role] || [];

    return (
      <div className="relative">
        {/* Header Fixo */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
          <nav className="w-full px-4 sm:px-6">
            <div className="flex justify-between h-16">
              {/* Menu Button à esquerda */}
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                  className="p-2 rounded-md text-gray-500 hover:text-[#16829E] hover:bg-gray-100 mr-2 sm:mr-4"
                >
                  <FaBars className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Logo */}
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

              {/* Área direita: Saudação + Menu do usuário */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Saudação + Menu do usuário */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-sm text-gray-700 hidden md:inline truncate max-w-[100px] lg:max-w-none">
                    Olá, {session?.user?.name}
                  </span>

                  {/* Menu dropdown do usuário */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                    >
                      <FaCog className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                        <Link
                          href={`/${
                            role === "admin"
                              ? "admin"
                              : role === "doctor"
                              ? "medic"
                              : role === "reception"
                              ? "acolhimento"
                              : "paciente"
                          }/perfil`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaUserCircle className="w-4 h-4 mr-2" />
                          Perfil
                        </Link>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FaSignOutAlt className="w-4 h-4 mr-2" />
                          Sair
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Overlay para fechar o menu quando clicar fora */}
          {isUserMenuOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsUserMenuOpen(false)}
            />
          )}
        </header>

        {/* Sidebar abaixo do Header */}
        <aside
          className={`fixed top-16 left-0 bottom-0 bg-white shadow-lg z-40 transition-all duration-300 overflow-hidden
            ${isSidebarExpanded ? "w-64 sm:w-72" : "w-0 sm:w-12 lg:w-16"}`}
        >
          <div className="flex flex-col h-full">
            {/* Links de Navegação */}
            <nav
              className={`flex-1 py-2 sm:py-4 min-h-0 ${
                isSidebarExpanded ? "overflow-y-auto" : "overflow-hidden"
              }`}
            >
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <div className="relative group">
                      <Link
                        href={link.href}
                        className={`${
                          isActive(link.href)
                            ? "text-[#16829E] bg-blue-50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        } flex items-center px-2 sm:px-4 py-2 sm:py-3 text-sm transition-colors duration-200 ${
                          !isSidebarExpanded ? "justify-center" : ""
                        }`}
                        title={!isSidebarExpanded ? link.label : ""}
                        onClick={() => {
                          // Fechar sidebar em mobile após clicar em um link
                          if (window.innerWidth < 640) {
                            setIsSidebarExpanded(false);
                          }
                        }}
                      >
                        {/* Ícone */}
                        <div className="flex-shrink-0">
                          {link.icon || (
                            <div className="w-5 h-5 bg-gray-300 rounded"></div>
                          )}
                        </div>

                        {/* Texto do Link */}
                        <span
                          className={`ml-2 sm:ml-3 transition-opacity duration-300 ${
                            isSidebarExpanded
                              ? "opacity-100 block"
                              : "opacity-0 hidden sm:hidden"
                          }`}
                        >
                          {link.label}
                        </span>
                      </Link>

                      {/* Tooltip para modo compacto */}
                      {!isSidebarExpanded && (
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden sm:block">
                          {link.label}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    );
  }

  // Header público (sempre renderizado para rotas públicas)
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="w-full md:px-[150px]">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="ABEC Med"
                width={200}
                height={40}
                priority
                className="w-[150px] sm:w-[200px]"
              />
            </Link>
          </div>

          {/* Menu Mobile para rotas públicas */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-[#16829E] hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Menu Desktop para rotas públicas */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {unauthenticatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  isActive(link.href)
                    ? "text-[#16829E] border-b-2 border-[#16829E]"
                    : "text-gray-500 hover:text-[#16829E] hover:border-b-2 hover:border-[#16829E]"
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {unauthenticatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    isActive(link.href)
                      ? "text-[#16829E] bg-blue-50"
                      : "text-gray-500 hover:text-[#16829E] hover:bg-gray-50"
                  } block px-3 py-2 text-base font-medium transition-colors duration-200`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Overlay para fechar o menu mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}
