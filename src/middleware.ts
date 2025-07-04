import { auth } from "../auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { auth: session } = req;
  const { pathname } = req.nextUrl;

  console.log("=== MIDDLEWARE ===");
  console.log("Path:", pathname);
  console.log(
    "Session:",
    session ? { email: session.user?.email, role: session.user?.role } : null
  );

  // Rotas públicas que NÃO precisam de autenticação
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/registrar" ||
    pathname === "/register" ||
    pathname.startsWith("/api/auth") ||
    pathname === "/unauthorized"
  ) {
    return NextResponse.next(); // Sempre permitir acesso a rotas públicas
  }

  // Se não tem sessão em rotas protegidas, será redirecionado para login
  if (!session) {
    console.log("❌ Sem sessão, redirecionando para login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userRole = session.user?.role as string;
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
});

export const config = {
  matcher: [
    // Proteger apenas rotas específicas que precisam de autenticação
    "/admin/:path*",
    "/medic/:path*",
    "/acolhimento/:path*",
    "/paciente/:path*",
  ],
};
