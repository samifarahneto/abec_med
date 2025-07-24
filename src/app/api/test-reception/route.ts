import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

const API_BASE_URL = "https://abecmed-api.22aczq.easypanel.host";

export async function GET() {
  try {
    console.log("🧪 Testando endpoint /reception especificamente...");

    // Verificar se o usuário está autenticado
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Corrigindo o acesso ao accessToken sem usar 'any'
    const accessToken =
      (typeof session.user === "object" &&
      session.user !== null &&
      "accessToken" in session.user
        ? (session.user as { accessToken?: string }).accessToken
        : undefined) ||
      ("accessToken" in session
        ? (session as { accessToken?: string }).accessToken
        : undefined);

    if (!accessToken) {
      return NextResponse.json(
        { error: "Token de acesso não encontrado" },
        { status: 401 }
      );
    }

    console.log("🔑 Token obtido, testando /reception...");

    // Testar GET primeiro
    const getResponse = await fetch(`${API_BASE_URL}/reception`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(`📡 GET /reception status: ${getResponse.status}`);

    // Testar POST com dados mínimos
    const testPayload = {
      name: "Maria da Silva",
      cpf: "12345678909",
      dateOfBirth: "1990-05-20",
      gender: "FEMININO",
      phone: "(11) 91234-5678",
      observations: "Acolhimento teste",
      companyId: 1,
      status: "ACTIVE",
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Centro",
      cityId: 1,
      stateId: 1,
      zipCode: "12345-678",
      email: "maria.silva@teste.com",
      password: "senhaSegura123",
    };

    const postResponse = await fetch(`${API_BASE_URL}/reception`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(testPayload),
    });

    console.log(`📡 POST /reception status: ${postResponse.status}`);

    let getData = null;
    let postData = null;

    try {
      if (getResponse.ok) {
        getData = await getResponse.json();
      }
    } catch {
      getData = "Erro ao parsear resposta GET";
    }

    try {
      if (postResponse.ok) {
        postData = await postResponse.json();
      } else {
        postData = await postResponse.text();
      }
    } catch {
      postData = "Erro ao parsear resposta POST";
    }

    return NextResponse.json({
      success: true,
      message: "Teste do endpoint /reception concluído",
      apiUrl: API_BASE_URL,
      get: {
        status: getResponse.status,
        ok: getResponse.ok,
        data: getData,
      },
      post: {
        status: postResponse.status,
        ok: postResponse.ok,
        data: postData,
      },
    });
  } catch (error) {
    console.error("❌ Erro no teste do /reception:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao testar /reception",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        apiUrl: API_BASE_URL,
      },
      { status: 500 }
    );
  }
}
