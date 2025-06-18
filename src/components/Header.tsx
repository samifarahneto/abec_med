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
  FaFileMedical,
  FaShoppingCart,
  FaPills,
  FaOilCan,
  FaFlask,
  FaLeaf,
  FaCookie,
  FaSignOutAlt,
  FaUserCircle,
  FaBox,
  FaBars,
  FaCog,
} from "react-icons/fa";
import { useCarrinho } from "@/contexts/CarrinhoContext";
import { useLayout } from "@/components/LayoutWrapper";

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
    {
      href: "/admin/receitas",
      label: "Receitas",
      icon: <FaFileMedical className="w-5 h-5" />,
    },
    {
      href: "/admin/produto",
      label: "Produto",
      icon: <FaPills className="w-5 h-5" />,
    },
    {
      href: "/admin/tipo-produto",
      label: "Tipo de produto",
      icon: <FaBox className="w-5 h-5" />,
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
    {
      href: "/medic/pedidos",
      label: "Pedidos",
      icon: <FaShoppingCart className="w-5 h-5" />,
    },
    {
      href: "/medic/medicamentos",
      label: "Medicamentos",
      icon: <FaPills className="w-5 h-5" />,
    },
  ],
  reception: [
    {
      href: "/acolhimento/agendamentos",
      label: "Agendamentos",
      icon: <FaCalendarAlt className="w-5 h-5" />,
    },
    {
      href: "/acolhimento/pacientes",
      label: "Pacientes",
      icon: <FaUsers className="w-5 h-5" />,
    },
    {
      href: "/acolhimento/relatorios",
      label: "Relatórios",
      icon: <FaFileMedical className="w-5 h-5" />,
    },
  ],
  patient: [
    {
      href: "/paciente/dashboard",
      label: "Dashboard",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      href: "/paciente/receitas",
      label: "Receitas",
      icon: <FaFileMedical className="w-5 h-5" />,
    },
    {
      href: "/paciente/pedidos",
      label: "Pedidos",
      icon: <FaShoppingCart className="w-5 h-5" />,
    },
    {
      href: "/paciente/medicamentos",
      label: "Medicamentos",
      icon: <FaPills className="w-5 h-5" />,
      submenu: [
        {
          href: "/paciente/medicamentos/flowers",
          label: "Flores",
          icon: <FaLeaf className="w-4 h-4" />,
        },
        {
          href: "/paciente/medicamentos/oils",
          label: "Óleos",
          icon: <FaOilCan className="w-4 h-4" />,
        },
        {
          href: "/paciente/medicamentos/extracts",
          label: "Concentrados",
          icon: <FaFlask className="w-4 h-4" />,
        },
        {
          href: "/paciente/medicamentos/eatables",
          label: "Comestíveis",
          icon: <FaCookie className="w-4 h-4" />,
        },
      ],
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
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      // O usuário não está autenticado
    },
  });
  const { quantidadeProdutos } = useCarrinho();

  // Usar o contexto do layout para o estado do sidebar
  const { isSidebarExpanded, setIsSidebarExpanded } = useLayout();

  const isActive = (path: string) => pathname === path;

  // Verifica se é uma rota pública
  const isPublicRoute = () => {
    const publicRoutes = ["/", "/login", "/registrar", "/register"];
    return publicRoutes.includes(pathname) || !session?.user;
  };

  // Se estiver carregando, mostra um header neutro
  if (status === "loading") {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <nav className="w-full md:px-[150px]">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-6" />
            </div>
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="ABEC Med"
                  width={200}
                  height={40}
                  priority
                  className="w-[150px] md:w-[200px]"
                />
              </Link>
            </div>
            <div className="w-6" />
          </div>
        </nav>
      </header>
    );
  }

  // Se for rota pública ou usuário não autenticado, mostra o header padrão
  if (isPublicRoute()) {
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

  // Para usuários autenticados - Layout com Header fixo e Sidebar abaixo
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

            {/* Área direita: Carrinho + Saudação + Menu do usuário */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Carrinho de Compras (apenas para pacientes) */}
              {role === "patient" && (
                <Link
                  href="/paciente/checkout"
                  className="relative text-gray-600 hover:text-[#16829E] p-2"
                >
                  <FaShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  {quantidadeProdutos > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#16829E] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {quantidadeProdutos}
                    </span>
                  )}
                </Link>
              )}

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
                      {link.icon && (
                        <span
                          className={`${
                            isSidebarExpanded ? "mr-2 sm:mr-3" : ""
                          } flex-shrink-0`}
                        >
                          {link.icon}
                        </span>
                      )}
                      {isSidebarExpanded && (
                        <>
                          <span className="truncate text-xs sm:text-sm">
                            {link.label}
                          </span>
                          {link.submenu && (
                            <svg
                              className="ml-auto h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}
                        </>
                      )}
                    </Link>

                    {/* Tooltip para modo mini (apenas desktop) */}
                    {!isSidebarExpanded && (
                      <div className="hidden sm:block absolute left-full top-0 ml-2 px-2 py-1 bg-gray-800 text-white text-xs sm:text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {link.label}
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-gray-800"></div>
                      </div>
                    )}

                    {/* Submenu */}
                    {link.submenu && isSidebarExpanded && (
                      <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4">
                        {link.submenu.map((subitem) => (
                          <li key={subitem.href}>
                            <Link
                              href={subitem.href}
                              className={`${
                                isActive(subitem.href)
                                  ? "text-[#16829E] bg-blue-50"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                              } flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm transition-colors duration-200`}
                              onClick={() => {
                                // Fechar sidebar em mobile após clicar em um submenu
                                if (window.innerWidth < 640) {
                                  setIsSidebarExpanded(false);
                                }
                              }}
                            >
                              {subitem.icon && (
                                <span className="mr-2 flex-shrink-0">
                                  {subitem.icon}
                                </span>
                              )}
                              <span className="truncate">{subitem.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Overlay para mobile quando sidebar está aberta */}
      {isSidebarExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={() => setIsSidebarExpanded(false)}
        />
      )}
    </div>
  );
}
