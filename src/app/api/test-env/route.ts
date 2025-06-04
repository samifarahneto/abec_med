import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.BASE_URL;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;

  return NextResponse.json({
    BASE_URL: baseUrl || "Não configurada",
    NEXTAUTH_URL: nextAuthUrl || "Não configurada",
    NEXTAUTH_SECRET: nextAuthSecret ? "Configurada" : "Não configurada",
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
