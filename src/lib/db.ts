import fs from "fs";
import path from "path";

const usersFilePath = path.join(process.cwd(), "data", "users.json");

interface User {
  id: string;
  name: string;
  email: string;
  role: "paciente" | "medico" | "admin";
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    if (!fs.existsSync(usersFilePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(usersFilePath, "utf-8");
    const users: User[] = JSON.parse(fileContent);
    return users.find((user) => user.email === email) || null;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}
