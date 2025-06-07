import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    console.log("=== MIDDLEWARE ===");
    console.log("Path:", pathname);
    console.log(
      "Token:",
      token ? { email: token.email, role: token.role } : null
    );

    // Se não tem token em rotas protegidas, será redirecionado para login
    if (!token) {
      console.log("❌ Sem token, redirecionando para login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userRole = token.role as string;
    console.log("Role do usuário:", userRole);

    // Verificação de acesso baseado em roles
    if (pathname.startsWith("/admin")) {
      if (userRole !== "admin") {
        console.log("❌ Acesso negado para admin - role:", userRole);
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (pathname.startsWith("/medic")) {
      if (!["admin", "medico", "doctor"].includes(userRole)) {
        console.log("❌ Acesso negado para médico - role:", userRole);
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (pathname.startsWith("/acolhimento")) {
      if (!["admin", "reception", "recepcao"].includes(userRole)) {
        console.log("❌ Acesso negado para recepção - role:", userRole);
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (pathname.startsWith("/paciente")) {
      // Pacientes podem acessar sua área, mas admin e médicos também
      if (
        ![
          "admin",
          "paciente",
          "patient",
          "medico",
          "doctor",
          "reception",
          "recepcao",
        ].includes(userRole)
      ) {
        console.log("❌ Acesso negado para paciente - role:", userRole);
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    console.log("✅ Acesso autorizado");
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Rotas públicas que NÃO precisam de autenticação
        if (
          pathname === "/" ||
          pathname === "/login" ||
          pathname === "/registrar" ||
          pathname === "/register" ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/test-env") ||
          pathname.startsWith("/api/debug") ||
          pathname.startsWith("/api/test-vars") ||
          pathname.startsWith("/api/produtos") ||
          pathname === "/unauthorized"
        ) {
          return true; // Sempre permitir acesso a rotas públicas
        }

        // Para rotas protegidas, exigir token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Proteger apenas rotas específicas que precisam de autenticação
    "/admin/:path*",
    "/medic/:path*",
    "/acolhimento/:path*",
    "/paciente/:path*",
  ],
};
