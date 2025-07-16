import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://abecmed-api.22aczq.easypanel.host";

// Função para obter token de autenticação
async function getAuthToken() {
  try {
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: "admin@system.com.br",
        password: "admin123",
      }),
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      return loginData.access_token;
    }
  } catch (error) {
    console.error("❌ Erro ao obter token:", error);
  }
  return null;
}

export async function GET() {
  try {
    console.log("🔍 Buscando estados da API externa...");

    // Obter token de autenticação
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Não foi possível obter token de autenticação");
    }

    const response = await fetch(`${API_BASE_URL}/state`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(
        `❌ Erro na API externa: ${response.status} ${response.statusText}`
      );
      throw new Error(`Erro ao buscar estados: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Estados encontrados: ${data.length} estados`);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Erro ao buscar estados:", error);

    // Fallback com dados mockados para manter o sistema funcionando
    const fallbackStates = [
      { id: 1, name: "Acre", uf: "AC" },
      { id: 2, name: "Alagoas", uf: "AL" },
      { id: 3, name: "Amapá", uf: "AP" },
      { id: 4, name: "Amazonas", uf: "AM" },
      { id: 5, name: "Bahia", uf: "BA" },
      { id: 6, name: "Ceará", uf: "CE" },
      { id: 7, name: "Distrito Federal", uf: "DF" },
      { id: 8, name: "Espírito Santo", uf: "ES" },
      { id: 9, name: "Goiás", uf: "GO" },
      { id: 10, name: "Maranhão", uf: "MA" },
      { id: 11, name: "Mato Grosso", uf: "MT" },
      { id: 12, name: "Mato Grosso do Sul", uf: "MS" },
      { id: 13, name: "Minas Gerais", uf: "MG" },
      { id: 14, name: "Pará", uf: "PA" },
      { id: 15, name: "Paraíba", uf: "PB" },
      { id: 16, name: "Paraná", uf: "PR" },
      { id: 17, name: "Pernambuco", uf: "PE" },
      { id: 18, name: "Piauí", uf: "PI" },
      { id: 19, name: "Rio de Janeiro", uf: "RJ" },
      { id: 20, name: "Rio Grande do Norte", uf: "RN" },
      { id: 21, name: "Rio Grande do Sul", uf: "RS" },
      { id: 22, name: "Rondônia", uf: "RO" },
      { id: 23, name: "Roraima", uf: "RR" },
      { id: 24, name: "Santa Catarina", uf: "SC" },
      { id: 25, name: "São Paulo", uf: "SP" },
      { id: 26, name: "Sergipe", uf: "SE" },
      { id: 27, name: "Tocantins", uf: "TO" },
    ];

    console.log("⚠️ Usando dados mockados como fallback");
    return NextResponse.json(fallbackStates);
  }
}
