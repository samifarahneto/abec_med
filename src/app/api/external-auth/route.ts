import { NextRequest, NextResponse } from "next/server";

interface LoginRequest {
  email: string;
  password: string;
  action: "login" | "validate" | "logout" | "profile";
  token?: string;
}

interface ExternalApiResponse {
  success: boolean;
  data?: {
    user?: AbecMedUser;
    token?: string;
    expires_at?: string;
  };
  user?: AbecMedUser;
  token?: string;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

interface AbecMedUser {
  id: number | string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password, action, token } = body;

    // Configurações da API AbecMed
    const apiUrl = "https://abecmed-api-hrgcn.ondigitalocean.app";

    switch (action) {
      case "login":
        return await handleAbecMedLogin(apiUrl, email, password);

      case "validate":
        return await handleValidateToken(apiUrl, token);

      case "logout":
        return await handleLogout(apiUrl, token);

      case "profile":
        return await handleGetProfile(apiUrl, token);

      default:
        return NextResponse.json(
          { error: "Ação não suportada" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erro na API AbecMed:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

async function handleAbecMedLogin(
  apiUrl: string,
  email: string,
  password: string
) {
  try {
    console.log("=== LOGIN ABECMED ===");
    console.log("URL:", `${apiUrl}/api/auth/login`);
    console.log("Email:", email);

    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    console.log("Status da resposta:", response.status);

    // Tratar especificamente erro 503 (Service Unavailable)
    if (response.status === 503) {
      console.log("🚨 API AbecMed indisponível (503)");
      return NextResponse.json(
        {
          success: false,
          error: "Servidor AbecMed temporariamente indisponível",
          code: "SERVICE_UNAVAILABLE",
          fallback: true,
        },
        { status: 503 }
      );
    }

    // Tratar outros erros de servidor (5xx)
    if (response.status >= 500) {
      console.log(`🚨 Erro interno do servidor AbecMed (${response.status})`);
      return NextResponse.json(
        {
          success: false,
          error: `Erro interno do servidor AbecMed (${response.status})`,
          code: "SERVER_ERROR",
          fallback: true,
        },
        { status: response.status }
      );
    }

    const data: ExternalApiResponse = await response.json();
    console.log(
      "Resposta completa da API AbecMed:",
      JSON.stringify(data, null, 2)
    );

    if (response.ok && (data.success || response.status === 200)) {
      console.log("✅ Login na AbecMed bem-sucedido");

      const user = data.user || data.data?.user;
      const token = data.token || data.data?.token;

      if (!user) {
        console.log("❌ Dados do usuário não encontrados na resposta");
        throw new Error("Dados do usuário não encontrados na resposta");
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: mapAbecMedRole(user.role),
          avatar: user.avatar,
        },
        token: token,
        externalAuth: true,
        source: "abecmed",
      });
    } else {
      console.log("❌ Falha no login AbecMed:", {
        status: response.status,
        message: data.message,
        error: data.error,
        errors: data.errors,
      });

      // Tratar erros específicos da API Laravel
      let errorMessage = "Credenciais inválidas";

      if (data.errors?.email) {
        errorMessage = data.errors.email[0];
      } else if (data.errors?.password) {
        errorMessage = data.errors.password[0];
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          code: "AUTH_FAILED",
          fallback: true,
        },
        { status: response.status || 401 }
      );
    }
  } catch (error) {
    console.error("💥 Erro na requisição para AbecMed:", error);

    // Verificar se é erro de rede/conectividade
    const isNetworkError =
      error instanceof Error &&
      (error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("ENOTFOUND") ||
        error.message.includes("ECONNREFUSED"));

    if (isNetworkError) {
      console.log("🌐 Erro de conectividade detectado");
      return NextResponse.json(
        {
          success: false,
          error: "Não foi possível conectar com o servidor AbecMed",
          code: "NETWORK_ERROR",
          fallback: true,
          details: error instanceof Error ? error.message : "Erro desconhecido",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro inesperado ao conectar com AbecMed",
        code: "UNEXPECTED_ERROR",
        fallback: true,
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 503 }
    );
  }
}

async function handleValidateToken(apiUrl: string, token: string | undefined) {
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token não fornecido" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${apiUrl}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return NextResponse.json({
        success: true,
        valid: true,
        user: userData,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          error: "Token inválido ou expirado",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erro ao validar token na AbecMed:", error);
    return NextResponse.json(
      {
        success: false,
        valid: false,
        error: "Erro na validação do token",
      },
      { status: 503 }
    );
  }
}

async function handleLogout(apiUrl: string, token: string | undefined) {
  if (!token) {
    return NextResponse.json({ success: true }); // Se não há token, considerar logout bem-sucedido
  }

  try {
    await fetch(`${apiUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    // Sempre retornar sucesso, mesmo se a API retornar erro
    return NextResponse.json({
      success: true,
      message: "Logout realizado com sucesso",
    });
  } catch (error) {
    console.error("Erro no logout AbecMed:", error);
    // Mesmo com erro, considerar logout bem-sucedido localmente
    return NextResponse.json({
      success: true,
      message: "Logout local realizado",
    });
  }
}

async function handleGetProfile(apiUrl: string, token: string | undefined) {
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token não fornecido" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${apiUrl}/api/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      const user = userData.data || userData;

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: mapAbecMedRole(user.role),
          avatar: user.avatar,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Perfil não encontrado",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao buscar perfil na AbecMed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar perfil do usuário",
      },
      { status: 503 }
    );
  }
}

// GET method para validação de token via query params
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const token = searchParams.get("token");

  if (action === "validate" && token) {
    const apiUrl = "https://abecmed-api-hrgcn.ondigitalocean.app";
    return await handleValidateToken(apiUrl, token);
  }

  if (action === "test") {
    // Endpoint de teste para verificar conectividade
    try {
      const response = await fetch(
        "https://abecmed-api-hrgcn.ondigitalocean.app/api/docs"
      );
      return NextResponse.json({
        success: true,
        message: "API AbecMed acessível",
        status: response.status,
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: "Erro ao conectar com API AbecMed",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
}

// Função específica para mapear roles da AbecMed
function mapAbecMedRole(externalRole?: string): string {
  if (!externalRole) return "paciente";

  const roleMap: { [key: string]: string } = {
    // Roles possíveis da AbecMed
    admin: "admin",
    administrator: "admin",
    super_admin: "admin",
    medico: "medico",
    doctor: "medico",
    physician: "medico",
    paciente: "paciente",
    patient: "paciente",
    user: "paciente",
    recepcao: "reception",
    receptionist: "reception",
    reception: "reception",
    acolhimento: "reception",
  };

  return roleMap[externalRole.toLowerCase()] || "paciente";
}
