import { NextResponse } from "next/server";

export async function GET() {
  console.log("=== DEBUG ENDPOINT ===");

  const envVars = {
    BASE_URL: process.env.BASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
      ? "CONFIGURADA"
      : "NÃO CONFIGURADA",
    NODE_ENV: process.env.NODE_ENV,
  };

  console.log("Variáveis de ambiente:", envVars);

  return NextResponse.json(envVars);
}
