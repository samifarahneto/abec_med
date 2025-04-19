import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), "src/lib/db.json");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    // Filtra o usuário a ser excluído
    const usuariosAtualizados = data.users.filter(
      (user: User) => user.id !== params.id
    );

    // Atualiza o arquivo com os usuários restantes
    data.users = usuariosAtualizados;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return NextResponse.json(
      { error: "Erro ao excluir usuário" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), "src/lib/db.json");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    // Busca o usuário a ser atualizado
    const usuarioAtualizado = await request.json();
    const usuariosAtualizados = data.users.map((user: User) =>
      user.id === params.id ? { ...user, ...usuarioAtualizado } : user
    );

    // Atualiza o arquivo com os usuários atualizados
    data.users = usuariosAtualizados;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ message: "Usuário atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}
