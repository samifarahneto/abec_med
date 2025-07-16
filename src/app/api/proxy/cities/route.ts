import { NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stateId = searchParams.get("stateId");
  const query = searchParams.get("query");

  if (!stateId) {
    return NextResponse.json(
      { error: "stateId é obrigatório" },
      { status: 400 }
    );
  }

  try {
    console.log(`🔍 Buscando cidades da API externa para estado ${stateId}...`);

    // Obter token de autenticação
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Não foi possível obter token de autenticação");
    }

    let url = `${API_BASE_URL}/city/search?stateId=${stateId}`;
    if (query) {
      url += `&query=${encodeURIComponent(query)}`;
    }

    const response = await fetch(url, {
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
      throw new Error(`Erro ao buscar cidades: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      `✅ Cidades encontradas: ${data.length} cidades para estado ${stateId}`
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Erro ao buscar cidades:", error);

    // Fallback com dados mockados para manter o sistema funcionando
    const allFallbackCities = [
      { id: 1, name: "São Paulo", stateId: 25 },
      { id: 2, name: "Rio de Janeiro", stateId: 19 },
      { id: 3, name: "Belo Horizonte", stateId: 13 },
      { id: 4, name: "Salvador", stateId: 5 },
      { id: 5, name: "Fortaleza", stateId: 6 },
      { id: 6, name: "Brasília", stateId: 7 },
      { id: 7, name: "Curitiba", stateId: 16 },
      { id: 8, name: "Recife", stateId: 17 },
      { id: 9, name: "Porto Alegre", stateId: 21 },
      { id: 10, name: "Manaus", stateId: 4 },
      { id: 11, name: "Belém", stateId: 14 },
      { id: 12, name: "Goiânia", stateId: 9 },
      { id: 13, name: "Guarulhos", stateId: 25 },
      { id: 14, name: "Campinas", stateId: 25 },
      { id: 15, name: "Natal", stateId: 20 },
    ];

    // Filtrar apenas cidades do estado solicitado
    const stateIdNum = parseInt(stateId);
    const fallbackCities = allFallbackCities.filter(
      (city) => city.stateId === stateIdNum
    );

    console.log(
      `⚠️ Usando dados mockados como fallback - ${fallbackCities.length} cidades para estado ${stateId}`
    );
    return NextResponse.json(fallbackCities);
  }
}
