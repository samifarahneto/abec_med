import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://abecmed-api.22aczq.easypanel.host";

export async function GET() {
  try {
    console.log("🧪 Testando conectividade com a API externa...");
    console.log(`URL da API: ${API_BASE_URL}`);

    // Testar endpoint de estados
    const statesResponse = await fetch(`${API_BASE_URL}/state`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log(`Status da resposta de estados: ${statesResponse.status}`);

    if (statesResponse.ok) {
      const statesData = await statesResponse.json();
      console.log(`Estados encontrados: ${statesData.length}`);
    }

    // Testar endpoint de cidades
    const citiesResponse = await fetch(
      `${API_BASE_URL}/city/search?stateId=25`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log(`Status da resposta de cidades: ${citiesResponse.status}`);

    if (citiesResponse.ok) {
      const citiesData = await citiesResponse.json();
      console.log(`Cidades encontradas: ${citiesData.length}`);
    }

    return NextResponse.json({
      success: true,
      message: "Teste de conectividade concluído",
      apiUrl: API_BASE_URL,
      statesStatus: statesResponse.status,
      citiesStatus: citiesResponse.status,
    });
  } catch (error) {
    console.error("❌ Erro no teste de conectividade:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao testar conectividade",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        apiUrl: API_BASE_URL,
      },
      { status: 500 }
    );
  }
}
