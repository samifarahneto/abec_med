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

export async function POST(request: NextRequest) {
  try {
    console.log("🏥 Recebendo requisição para cadastrar médico...");

    const body = await request.json();
    console.log("📦 Dados recebidos:", body);

    // Validações básicas
    if (!body.email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }
    if (!body.password) {
      return NextResponse.json(
        { error: "Senha é obrigatória" },
        { status: 400 }
      );
    }
    if (!body.name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }
    if (!body.cpf) {
      return NextResponse.json({ error: "CPF é obrigatório" }, { status: 400 });
    }

    // Obter token de autenticação
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: "Não foi possível obter token de autenticação" },
        { status: 500 }
      );
    }

    console.log("🔑 Token obtido, fazendo requisição para API externa...");

    // Fazer requisição para a API externa
    const response = await fetch(`${API_BASE_URL}/doctors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    console.log(`📡 Status da resposta: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Erro na API externa:", errorData);

      // Handle 409 Conflict specifically
      if (response.status === 409) {
        let conflictDetails = {};

        // Try to extract specific conflict information
        if (errorData.message) {
          if (errorData.message.toLowerCase().includes("email")) {
            conflictDetails = { email: "Email já cadastrado" };
          } else if (errorData.message.toLowerCase().includes("cpf")) {
            conflictDetails = { cpf: "CPF já cadastrado" };
          } else if (
            errorData.message.toLowerCase().includes("document") ||
            errorData.message.toLowerCase().includes("crm")
          ) {
            conflictDetails = {
              documentDoctorNumber: "Número do documento já cadastrado",
            };
          }
        }

        return NextResponse.json(
          {
            error: errorData.message || "Dados já existem no sistema",
            details: conflictDetails,
          },
          { status: response.status }
        );
      }

      return NextResponse.json(
        {
          error:
            errorData.message ||
            `Erro ${response.status}: ${response.statusText}`,
          details: errorData,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("✅ Médico cadastrado com sucesso:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Erro interno:", error);

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
