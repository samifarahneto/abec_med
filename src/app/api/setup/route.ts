import { NextResponse } from "next/server";
import { users, createUser } from "@/lib/users";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
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

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Senha hash gerada:", hashedPassword);

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar usuário admin:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário admin" },
      { status: 500 }
    );
  }
}
