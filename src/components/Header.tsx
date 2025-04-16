"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  // Links comuns para todos os perfis
  const commonLinks = [{ href: "/", label: "Início" }];

  // Links específicos por perfil
  const profileLinks = {
    admin: [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/usuarios", label: "Usuários" },
      { href: "/admin/configuracoes", label: "Configurações" },
    ],
    doctor: [
      { href: "/medico/consultas", label: "Consultas" },
      { href: "/medico/pacientes", label: "Pacientes" },
      { href: "/medico/agenda", label: "Agenda" },
    ],
    reception: [
      { href: "/acolhimento/agendamentos", label: "Agendamentos" },
      { href: "/acolhimento/pacientes", label: "Pacientes" },
      { href: "/acolhimento/relatorios", label: "Relatórios" },
    ],
    patient: [
      { href: "/paciente/consultas", label: "Minhas Consultas" },
      { href: "/paciente/exames", label: "Meus Exames" },
      { href: "/paciente/perfil", label: "Meu Perfil" },
    ],
  };

  // Links para usuários não autenticados
  const unauthenticatedLinks = [
    { href: "/registrar", label: "Registrar-se" },
    { href: "/login", label: "Login" },
  ];

  // Determina quais links mostrar baseado no perfil
  const getLinks = () => {
    // Durante o carregamento ou antes da montagem, mostra apenas links comuns
    if (status === "loading" || !mounted) {
      return commonLinks;
    }

    // Se não houver sessão, mostra links para não autenticados
    if (!session?.user) {
      return [...commonLinks, ...unauthenticatedLinks];
    }

    // Se houver sessão, mostra links específicos do perfil
    const role = session.user.role;
    if (role && profileLinks[role as keyof typeof profileLinks]) {
      return [
        ...commonLinks,
        ...profileLinks[role as keyof typeof profileLinks],
      ];
    }

    // Fallback para caso o perfil não seja reconhecido
    return commonLinks;
  };

  // Se o componente ainda não estiver montado, retorna um header vazio
  if (!mounted) {
    return (
      <header className="bg-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-[#16829E]">
                ABEC Med
              </span>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-[#16829E]">
                ABEC Med
              </Link>
            </div>
          </div>

          {/* Menu Desktop */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            {getLinks().map((link) => (
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
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/perfil"
                  className="flex items-center space-x-2 text-gray-500 hover:text-[#16829E]"
                >
                  <span className="text-sm font-medium">
                    {session.user.name}
                  </span>
                  <span className="text-xs bg-[#16829E] text-white px-2 py-1 rounded-full">
                    {session.user.role}
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-gray-500 hover:text-[#16829E] text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            ) : null}
          </div>

          {/* Botão do menu mobile */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-[#16829E] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#16829E]"
            >
              <span className="sr-only">Abrir menu principal</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
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
              ) : (
                <svg
                  className="block h-6 w-6"
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
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {getLinks().map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  isActive(link.href)
                    ? "bg-[#16829E] text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#16829E]"
                } block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session?.user && (
              <div className="px-3 py-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">
                    {session.user.name}
                  </span>
                  <span className="text-xs bg-[#16829E] text-white px-2 py-1 rounded-full">
                    {session.user.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full text-left text-gray-500 hover:text-[#16829E] text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
