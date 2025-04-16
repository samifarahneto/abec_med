"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="bg-[#16829E] shadow-sm sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex justify-between items-center py-3 sm:py-4">
          <div className="flex items-center">
            <Link href="/" className="text-lg sm:text-xl font-bold text-white">
              ABEC Med
            </Link>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <Link
              href="/"
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              Início
            </Link>
            <Link
              href="/servicos"
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              Serviços
            </Link>
            <Link
              href="/contato"
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              Contato
            </Link>
          </nav>

          {/* Botão menu mobile */}
          <button
            className="md:hidden p-2 hover:bg-[#1a94b3] rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6 text-white"
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

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-white hover:text-gray-200 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                href="/servicos"
                className="text-white hover:text-gray-200 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </Link>
              <Link
                href="/contato"
                className="text-white hover:text-gray-200 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
