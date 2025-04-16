"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

interface LinkItem {
  href: string;
  label: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  // Links específicos por perfil
  const profileLinks: Record<string, LinkItem[]> = {
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
      { href: "/paciente/pedidos", label: "Pedidos" },
      { href: "/paciente/receitas", label: "Receitas" },
      { href: "/paciente/medicamentos", label: "Medicamentos" },
    ],
  };

  // Links para usuários não autenticados
  const unauthenticatedLinks = [
    { href: "/", label: "Início" },
    { href: "/registrar", label: "Registrar-se" },
    { href: "/login", label: "Login" },
  ];

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

  // Se o usuário estiver autenticado, retorna o layout com header e sidebar controlável
  if (session?.user) {
    const role = session.user.role as keyof typeof profileLinks;
    const links = profileLinks[role] || [];

    return (
      <div className="relative">
        {/* Header Fixo */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
          <nav className="w-full md:px-[150px]">
            <div className="flex justify-between h-16">
              {/* Menu Button */}
              <div className="flex items-center">
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

              {/* Espaço reservado para alinhamento */}
              <div className="w-6" />
            </div>
          </nav>
        </header>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-[calc(100vh-4rem)]">
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
                className="p-2 rounded-md text-gray-500 hover:text-[#16829E] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#16829E]"
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
                <span className="text-lg font-medium text-gray-700">
                  {session.user.name}
                </span>
                <span className="text-xs bg-[#16829E] text-white px-2 py-1 rounded-full">
                  {session.user.role}
                </span>
              </div>
            </div>

            {/* Links de Navegação */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block px-4 py-2 rounded-md ${
                        isActive(link.href)
                          ? "bg-[#16829E] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Botão Sair */}
            <div className="p-4 border-t">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-center text-gray-500 hover:text-[#16829E] text-sm font-medium py-2"
              >
                Sair
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay para fechar o menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Conteúdo Principal */}
        <main className="pt-16 md:pl-64">
          {/* Aqui será renderizado o conteúdo da página */}
        </main>
      </div>
    );
  }

  // Header para usuários não autenticados
  return (
    <header className="bg-white shadow-md">
      <nav className="w-full">
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
