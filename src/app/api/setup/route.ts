import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validação básica
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Verifica se já existe algum usuário admin
    const existingAdmin = await db
      .collection("users")
      .findOne({ role: "admin" });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Administrador já existe" },
        { status: 400 }
      );
    }

    // Verifica se o email já existe
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      );
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário administrador
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Administrador criado com sucesso",
        userId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar administrador:", error);
    return NextResponse.json(
      { message: "Erro ao processar o registro" },
      { status: 500 }
    );
  }
}
