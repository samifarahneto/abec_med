"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  FaHome,
  FaUsers,
  FaCog,
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
} from "react-icons/fa";
import { useCarrinho } from "@/contexts/CarrinhoContext";

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
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      href: "/admin/usuarios",
      label: "Usuários",
      icon: <FaUsers className="w-5 h-5" />,
    },
    {
      href: "/admin/estoque",
      label: "Estoque",
      icon: <FaBox className="w-5 h-5" />,
    },
    {
      href: "/admin/pedidos",
      label: "Pedidos",
      icon: <FaShoppingCart className="w-5 h-5" />,
    },
    {
      href: "/admin/configuracoes",
      label: "Configurações",
      icon: <FaCog className="w-5 h-5" />,
    },
    {
      href: "/admin/perfil",
      label: "Perfil",
      icon: <FaUserCircle className="w-5 h-5" />,
    },
  ],
  doctor: [
    {
      href: "/medico/consultas",
      label: "Consultas",
      icon: <FaCalendarAlt className="w-5 h-5" />,
    },
    {
      href: "/medico/pacientes",
      label: "Pacientes",
      icon: <FaUsers className="w-5 h-5" />,
    },
    {
      href: "/medico/agenda",
      label: "Agenda",
      icon: <FaCalendarAlt className="w-5 h-5" />,
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      // O usuário não está autenticado
    },
  });
  const { quantidadeProdutos } = useCarrinho();

  // Fecha o menu quando a rota muda
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  // Se estiver carregando, mostra um header neutro
  if (status === "loading") {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <nav className="w-full md:px-[150px]">
          <div className="flex justify-between h-16">
            {/* Menu Button */}
            <div className="flex items-center">
              <div className="w-6" />
            </div>

            {/* Logo */}
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

            {/* Espaço reservado para alinhamento */}
            <div className="w-6" />
          </div>
        </nav>
      </header>
    );
  }

  // Se o usuário não estiver autenticado, mostra o header padrão
  if (!session?.user) {
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

            {/* Menu Mobile */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-[#16829E] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#16829E]"
              >
                <span className="sr-only">Abrir menu principal</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Menu Desktop */}
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
        </nav>

        {/* Menu Mobile Aberto */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="space-y-1">
              {unauthenticatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    isActive(link.href)
                      ? "bg-[#16829E] text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-[#16829E]"
                  } block px-3 py-2 text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    );
  }

  // Se o usuário estiver autenticado, retorna o layout com header e sidebar controlável
  const role = session?.user?.role as keyof typeof profileLinks;
  const links = profileLinks[role] || [];

  return (
    <div className="relative">
      {/* Header Fixo */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <nav className="w-full md:px-[150px]">
          <div className="flex justify-between h-16">
            {/* Menu Button */}
            <div className="flex items-center w-12">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md text-gray-500 hover:text-[#16829E] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#16829E] ${
                  isMenuOpen ? "hidden" : "block"
                }`}
              >
                <span className="sr-only">Abrir menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center justify-center flex-1">
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

            {/* Carrinho de Compras (apenas para pacientes) */}
            <div className="flex items-center w-12">
              {role === "patient" && (
                <Link
                  href="/paciente/checkout"
                  className="relative text-gray-600 hover:text-[#16829E]"
                >
                  <FaShoppingCart className="w-6 h-6" />
                  {quantidadeProdutos > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#16829E] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {quantidadeProdutos}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col">
            {/* Cabeçalho do Sidebar com botão de fechar */}
            <div className="p-4 border-b flex justify-between items-center">
              <Image
                src="/images/icon.png"
                alt="ABEC Med"
                width={40}
                height={40}
                priority
              />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <span className="sr-only">Fechar menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Informações do Usuário */}
            <div className="p-4 border-b">
              <div className="flex flex-col items-center space-y-2">
                <span className="text-lg font-medium text-gray-800">
                  {session.user.name}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {session.user.role}
                </span>
              </div>
            </div>

            {/* Links de Navegação */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <div className="relative">
                      <Link
                        href={link.href}
                        className={`${
                          isActive(link.href)
                            ? "text-[#16829E] font-medium"
                            : "text-gray-600 hover:text-gray-900"
                        } flex items-center px-4 py-2.5 text-sm transition-colors duration-200`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.icon && <span className="mr-3">{link.icon}</span>}
                        {link.label}
                        {link.submenu && (
                          <svg
                            className="ml-auto h-4 w-4"
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
                      </Link>
                      {link.submenu && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {link.submenu.map((subitem) => (
                            <li key={subitem.href}>
                              <Link
                                href={subitem.href}
                                className={`${
                                  isActive(subitem.href)
                                    ? "text-[#16829E] font-medium"
                                    : "text-gray-600 hover:text-gray-900"
                                } flex items-center px-4 py-2 text-sm transition-colors duration-200`}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subitem.icon && (
                                  <span className="mr-3">{subitem.icon}</span>
                                )}
                                {subitem.label}
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

          {/* Botão Sair fixo no final */}
          <div className="p-4 border-t mt-auto">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FaSignOutAlt className="h-5 w-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay para fechar o menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Conteúdo Principal */}
      <main
        className={`pt-16 transition-all duration-300 ${
          isMenuOpen ? "md:pl-64" : ""
        }`}
      >
        {/* Aqui será renderizado o conteúdo da página */}
      </main>
    </div>
  );
}
