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
    console.log("🧪 Testando endpoints da API externa...");

    // Obter token de autenticação
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: "Não foi possível obter token de autenticação" },
        { status: 500 }
      );
    }

    console.log("🔑 Token obtido, testando endpoints...");

    // Lista de endpoints para testar
    const endpoints = [
      "/doctors", // Este sabemos que funciona
      "/reception",
      "/users",
      "/patients",
      "/user",
      "/patient",
      "/receptionists",
      "/staff",
      "/employees",
      "/personnel",
      "/admin/users",
      "/admin/patients",
      "/api/users",
      "/api/patients",
      "/api/reception",
      "/auth/users",
      "/auth/patients",
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Testando: ${endpoint}`);

        // Testar GET primeiro
        const getResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const getStatus = getResponse.status;
        let getData = null;
        let getError = null;

        try {
          if (getResponse.ok) {
            getData = await getResponse.json();
          } else {
            getError = await getResponse.text();
          }
        } catch {
          getError = "Erro ao parsear resposta GET";
        }

        // Testar POST com dados mínimos
        const testPayload = {
          email: "test@example.com",
          password: "test123",
          name: "Test User",
          cpf: "12345678900",
        };

        const postResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(testPayload),
        });

        const postStatus = postResponse.status;
        let postData = null;
        let postError = null;

        try {
          if (postResponse.ok) {
            postData = await postResponse.json();
          } else {
            postError = await postResponse.text();
          }
        } catch {
          postError = "Erro ao parsear resposta POST";
        }

        results.push({
          endpoint,
          get: {
            status: getStatus,
            ok: getResponse.ok,
            data: getData ? "Dados recebidos" : null,
            error: getError || null,
          },
          post: {
            status: postStatus,
            ok: postResponse.ok,
            data: postData ? "Dados recebidos" : null,
            error: postError || null,
          },
          hasData:
            (getData &&
              (Array.isArray(getData) ||
                (typeof getData === "object" && getData !== null))) ||
            (postData &&
              (Array.isArray(postData) ||
                (typeof postData === "object" && postData !== null))),
        });
      } catch (error) {
        console.log(`❌ ${endpoint}: Erro de rede`);
        results.push({
          endpoint,
          get: {
            status: "NETWORK_ERROR",
            ok: false,
            data: null,
            error: error instanceof Error ? error.message : "Erro de rede",
          },
          post: {
            status: "NETWORK_ERROR",
            ok: false,
            data: null,
            error: error instanceof Error ? error.message : "Erro de rede",
          },
          hasData: false,
        });
      }
    }

    // Encontrar endpoints que retornaram dados
    const workingEndpoints = results.filter((r) => r.get.ok || r.post.ok);
    const failedEndpoints = results.filter((r) => !r.get.ok && !r.post.ok);

    return NextResponse.json({
      success: true,
      message: "Teste de endpoints da API externa concluído",
      apiUrl: API_BASE_URL,
      totalTested: endpoints.length,
      workingEndpoints: workingEndpoints.length,
      failedEndpoints: failedEndpoints.length,
      results: results,
      recommendations:
        workingEndpoints.length > 0
          ? `Use um destes endpoints: ${workingEndpoints
              .map((r) => r.endpoint)
              .join(", ")}`
          : "Nenhum endpoint funcionou. Verifique se a API externa está disponível.",
    });
  } catch (error) {
    console.error("❌ Erro no teste de endpoints:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao testar endpoints",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        apiUrl: API_BASE_URL,
      },
      { status: 500 }
    );
  }
}
