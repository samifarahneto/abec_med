import { NextResponse } from "next/server";
import { users, createUser } from "@/lib/users";
import fs from "fs";
import path from "path";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src/lib/db.json");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    // Log para debug
    console.log("Usuários encontrados:", data.users);

    // Retorna apenas os campos necessários
    const usuarios = data.users.map((user: User) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    }));

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Erro ao ler arquivo JSON:", error);
    return NextResponse.json(
      { error: "Erro ao carregar usuários" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    const newUser = await createUser({ name, email, password, role });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
