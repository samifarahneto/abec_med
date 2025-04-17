"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PatientHeader = () => {
  const pathname = usePathname();

  const links = [
    {
      href: "/paciente",
      label: "Início",
    },
    {
      href: "/paciente/receitas",
      label: "Receitas",
    },
    {
      href: "/paciente/pedidos",
      label: "Pedidos",
    },
    {
      href: "/paciente/medicamentos",
      label: "Medicamentos",
      submenu: [
        { href: "/paciente/medicamentos/oleos", label: "Óleos" },
        { href: "/paciente/medicamentos/concentrados", label: "Concentrados" },
        {
          href: "/paciente/medicamentos/inflorescencias",
          label: "Inflorescências",
        },
        { href: "/paciente/medicamentos/comestiveis", label: "Comestíveis" },
      ],
    },
  ];

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/paciente"
                className="text-xl font-bold text-[#16829E]"
              >
                ABEC MED
              </Link>
            </div>
            <nav className="ml-6 flex space-x-8">
              {links.map((link) => (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === link.href
                        ? "border-[#16829E] text-[#16829E]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {link.label}
                    {link.submenu && (
                      <svg
                        className="ml-1 h-4 w-4"
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
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-1">
                        {link.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Sair
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PatientHeader;
