import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Se o usuário estiver autenticado e tentar acessar /dashboard
  if (token && pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/paciente/dashboard", request.url));
  }

  // Se o usuário estiver autenticado e tentar acessar /paciente
  if (token && pathname === "/paciente") {
    return NextResponse.redirect(new URL("/paciente/dashboard", request.url));
  }

  // Se o usuário estiver autenticado e tentar acessar /admin
  if (token && pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/paciente", "/admin"],
};
