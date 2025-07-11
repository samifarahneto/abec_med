"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaCog,
  FaUserMd,
  FaClipboardList,
  FaChartBar,
  FaFileAlt,
} from "react-icons/fa";
import { useLayout } from "@/components/LayoutWrapper";

const profileLinks = {
  admin: [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <FaChartBar className="w-6 h-6" />,
    },
    {
      href: "/admin/pacientes",
      label: "Pacientes",
      icon: <FaUsers className="w-6 h-6" />,
    },
    {
      href: "/admin/medicos",
      label: "Médicos",
      icon: <FaUserMd className="w-6 h-6" />,
    },
    {
      href: "/admin/administradores",
      label: "Administradores",
      icon: <FaCog className="w-6 h-6" />,
    },
    {
      href: "/admin/acolhimento",
      label: "Acolhimento",
      icon: <FaClipboardList className="w-6 h-6" />,
    },
  ],
  doctor: [
    {
      href: "/medic/pacientes",
      label: "Pacientes",
      icon: <FaUsers className="w-6 h-6" />,
    },
    {
      href: "/medic/agenda",
      label: "Agenda",
      icon: <FaCalendarAlt className="w-6 h-6" />,
    },
    {
      href: "/medic/consultas",
      label: "Consultas",
      icon: <FaFileAlt className="w-6 h-6" />,
    },
  ],
  reception: [
    {
      href: "/acolhimento/pacientes",
      label: "Pacientes",
      icon: <FaUsers className="w-6 h-6" />,
    },
    {
      href: "/acolhimento/agendamento",
      label: "Agendamento",
      icon: <FaCalendarAlt className="w-6 h-6" />,
    },
  ],
  patient: [
    {
      href: "/paciente/dashboard",
      label: "Dashboard",
      icon: <FaHome className="w-6 h-6" />,
    },
    {
      href: "/paciente/consultas",
      label: "Minhas Consultas",
      icon: <FaFileAlt className="w-6 h-6" />,
    },
  ],
};

interface PrivateHeaderProps {
  session: { user?: { name?: string; role?: string } };
}

export default function PrivateHeader({ session }: PrivateHeaderProps) {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isSidebarExpanded, setIsSidebarExpanded } = useLayout();

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
                          signOut({ callbackUrl: "/" });
                          setIsUserMenuOpen(false);
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
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${
          isSidebarExpanded ? "w-64 lg:w-72" : "w-12 lg:w-16"
        }`}
      >
        <nav className="h-full py-4">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive(link.href)
                      ? "bg-[#16829E]/10 text-[#16829E] border-l-4 border-[#16829E]"
                      : "text-gray-600 hover:bg-gray-100 hover:text-[#16829E]"
                  }`}
                >
                  {link.icon && (
                    <span className="flex-shrink-0 mr-3 flex items-center justify-center">
                      {link.icon}
                    </span>
                  )}
                  {isSidebarExpanded && (
                    <span className="truncate">{link.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
