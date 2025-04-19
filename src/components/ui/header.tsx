"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FaHome,
  FaUsers,
  FaBox,
  FaChartLine,
  FaCog,
  FaUserCircle,
  FaCalendarAlt,
  FaFileMedical,
  FaShoppingCart,
  FaPills,
  FaLeaf,
  FaOilCan,
  FaFlask,
  FaCookie,
} from "react-icons/fa";

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
      href: "/admin/relatorios",
      label: "Relatórios",
      icon: <FaChartLine className="w-5 h-5" />,
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
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  if (!session) {
    return (
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <span className="text-2xl font-bold text-[#16829E]">
                    ABEC
                  </span>
                </Link>
              </div>
            </div>

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

            <div className="sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-[#16829E]"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

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
        </nav>
      </header>
    );
  }

  const role = session.user.role as keyof typeof profileLinks;
  const links = profileLinks[role] || [];

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold text-[#16829E]">ABEC</span>
              </Link>
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {links.map((link) => (
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

          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-[#16829E]"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="space-y-1">
              {links.map((link) => (
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
      </nav>
    </header>
  );
}
