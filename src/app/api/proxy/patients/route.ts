import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";

const API_BASE_URL = "https://abecmed-api.22aczq.easypanel.host";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const accessToken = session.user.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Token de acesso não encontrado" },
        { status: 401 }
      );
    }

    console.log("🔍 Proxy: Buscando pacientes via servidor...");
    console.log(`🔑 Proxy: Token: ${accessToken.substring(0, 20)}...`);

    // Fazer a requisição para a API externa
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(`📡 Proxy: Status da resposta: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Proxy: Erro na API externa:`, errorText);
      return NextResponse.json(
        { error: `Erro na API externa: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`✅ Proxy: ${data.length} pacientes encontrados`);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Proxy: Erro interno:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const accessToken = session.user.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Token de acesso não encontrado" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const patientId = url.searchParams.get("id");

    if (!patientId) {
      return NextResponse.json(
        { error: "ID do paciente é obrigatório" },
        { status: 400 }
      );
    }

    console.log(`🗑️ Proxy: Deletando paciente ID: ${patientId}`);

    const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(`📡 Proxy: Status da deleção: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Proxy: Erro ao deletar:`, errorText);
      return NextResponse.json(
        { error: `Erro ao deletar paciente: ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Proxy: Erro ao deletar:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
