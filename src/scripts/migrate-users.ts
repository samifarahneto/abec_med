import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "..", "lib");
const DB_FILE = path.join(DB_PATH, "db.json");
const USERS_FILE = path.join(__dirname, "..", "data", "users.json");

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

interface UserFromJson {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  active?: boolean;
}

async function migrateUsers() {
  try {
    // Verificar se o arquivo users.json existe
    if (!fs.existsSync(USERS_FILE)) {
      console.log("Arquivo users.json não encontrado. Nada para migrar.");
      return;
    }

    // Ler usuários do users.json
    const usersData: UserFromJson[] = JSON.parse(
      fs.readFileSync(USERS_FILE, "utf-8")
    );

    // Ler usuários do db.json
    const dbData = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    const existingUsers: User[] = dbData.users || [];

    // Migrar usuários
    const migratedUsers: User[] = usersData.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      active: user.active !== undefined ? user.active : true,
    }));

    // Combinar usuários existentes com migrados, dando preferência aos migrados em caso de duplicatas
    const uniqueUsers = [...migratedUsers];

    // Adicionar usuários existentes que não estão nos migrados
    existingUsers.forEach((existingUser) => {
      if (!uniqueUsers.some((user) => user.email === existingUser.email)) {
        uniqueUsers.push({
          ...existingUser,
          active:
            existingUser.active !== undefined ? existingUser.active : true,
        });
      }
    });

    // Salvar no db.json
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: uniqueUsers }, null, 2));

    console.log("Migração concluída com sucesso!");
    console.log("Total de usuários migrados:", uniqueUsers.length);
    console.log(
      "Usuários:",
      uniqueUsers.map((user: User) => ({
        email: user.email,
        role: user.role,
        active: user.active,
      }))
    );

    // Fazer backup do users.json antes de removê-lo
    const backupPath = USERS_FILE + ".backup";
    fs.copyFileSync(USERS_FILE, backupPath);
    console.log("Backup do users.json criado em:", backupPath);

    // Remover users.json
    fs.unlinkSync(USERS_FILE);
    console.log("Arquivo users.json removido");
  } catch (error) {
    console.error("Erro durante a migração:", error);
    process.exit(1);
  }
}

migrateUsers();
