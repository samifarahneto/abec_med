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
    console.log("📝 Recebendo dados de acolhimento...");

    const body = await request.json();
    console.log("📤 Dados recebidos:", body);

    // Validações básicas
    if (!body.name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }
    if (!body.cpf) {
      return NextResponse.json({ error: "CPF é obrigatório" }, { status: 400 });
    }
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
    if (!body.dateOfBirth) {
      return NextResponse.json(
        { error: "Data de nascimento é obrigatória" },
        { status: 400 }
      );
    }
    if (!body.cityId) {
      return NextResponse.json(
        { error: "Cidade é obrigatória" },
        { status: 400 }
      );
    }
    if (!body.stateId) {
      return NextResponse.json(
        { error: "Estado é obrigatório" },
        { status: 400 }
      );
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

    // Preparar payload para API externa seguindo o modelo fornecido
    const payload = {
      name: body.name,
      cpf: body.cpf,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender || "Masculino",
      phone: body.phone || "",
      observations: body.observations || "",
      companyId: body.companyId || 1,
      status: body.status || "ACTIVE",
      street: body.street || "",
      number: body.number || "",
      complement: body.complement || "",
      neighborhood: body.neighborhood || "",
      cityId: body.cityId,
      stateId: body.stateId,
      zipCode: body.zipCode || "",
      email: body.email,
      password: body.password,
    };

    console.log("📤 Payload para API externa:", payload);

    // Testar diferentes endpoints possíveis
    const possibleEndpoints = [
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
    ];

    let lastError = null;

    for (const endpoint of possibleEndpoints) {
      const apiUrl = `${API_BASE_URL}${endpoint}`;
      console.log(`🔍 Testando endpoint: ${apiUrl}`);

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        console.log(`📡 Status da resposta para ${endpoint}:`, response.status);

        if (response.ok) {
          const result = await response.json();
          console.log("✅ Acolhimento cadastrado com sucesso:", result);
          return NextResponse.json({
            success: true,
            message: "Acolhimento cadastrado com sucesso",
            data: result,
          });
        } else {
          let errorData: Record<string, unknown> = {};
          let errorText = "";

          try {
            errorData = await response.json();
            errorText =
              (errorData.message as string) ||
              (errorData.error as string) ||
              response.statusText;
          } catch {
            errorText = await response.text().catch(() => response.statusText);
          }

          console.error(`❌ Erro no endpoint ${endpoint}:`, {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
            text: errorText,
          });

          // Handle 409 Conflict specifically
          if (response.status === 409) {
            let conflictDetails = {};

            if (errorText.toLowerCase().includes("email")) {
              conflictDetails = { email: "Email já cadastrado" };
            } else if (errorText.toLowerCase().includes("cpf")) {
              conflictDetails = { cpf: "CPF já cadastrado" };
            }

            return NextResponse.json(
              {
                error: errorText || "Dados já existem no sistema",
                details: conflictDetails,
              },
              { status: response.status }
            );
          }

          lastError = `Endpoint ${endpoint}: ${response.status} - ${errorText}`;
        }
      } catch (fetchError) {
        console.error(`💥 Erro no endpoint ${endpoint}:`, fetchError);
        lastError =
          fetchError instanceof Error
            ? fetchError.message
            : "Erro desconhecido";
      }
    }

    // Se chegou aqui, todos os endpoints falharam
    console.error("❌ Todos os endpoints falharam");
    return NextResponse.json(
      {
        success: false,
        message: "Não foi possível cadastrar na API externa",
        error: lastError,
        note: "Todos os endpoints testados falharam. Verifique se a API externa está disponível.",
        tested_endpoints: possibleEndpoints,
        debug_info: {
          api_url: API_BASE_URL,
          token_obtained: !!token,
          payload_sent: payload,
        },
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("❌ Erro interno:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("📋 Buscando dados de acolhimento...");

    // Obter token de autenticação
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: "Não foi possível obter token de autenticação" },
        { status: 500 }
      );
    }

    console.log("🔑 Token obtido, buscando dados...");

    // Testar diferentes endpoints para buscar dados
    const endpoints = [
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
    ];

    for (const endpoint of endpoints) {
      try {
        const apiUrl = `${API_BASE_URL}${endpoint}`;
        console.log(`🔍 Testando endpoint GET: ${apiUrl}`);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(
          `📡 Status da resposta GET para ${endpoint}:`,
          response.status
        );

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Dados encontrados em ${endpoint}:`, data);

          return NextResponse.json({
            success: true,
            data: data,
            source: endpoint,
          });
        } else {
          console.log(`❌ Endpoint ${endpoint} falhou:`, response.status);
        }
      } catch (error) {
        console.error(`💥 Erro no endpoint ${endpoint}:`, error);
      }
    }

    // Se chegou aqui, nenhum endpoint funcionou
    console.error("❌ Nenhum endpoint funcionou para buscar dados");
    return NextResponse.json(
      {
        success: false,
        message: "Não foi possível buscar dados da API externa",
        error: "Todos os endpoints testados falharam",
        tested_endpoints: endpoints,
        debug_info: {
          api_url: API_BASE_URL,
          token_obtained: !!token,
        },
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("❌ Erro interno:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
