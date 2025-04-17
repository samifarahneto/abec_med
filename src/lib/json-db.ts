import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "src/lib");
const DB_FILE = path.join(DB_PATH, "db.json");

// Garantir que o diretório existe
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Inicializar arquivo de banco de dados se não existir
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
}

export async function readCollection<T>(collectionName: string): Promise<T[]> {
  try {
    const filePath = path.join(DB_PATH, `${collectionName}.json`);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler coleção ${collectionName}:`, error);
    return [];
  }
}

export async function writeCollection<T>(
  collectionName: string,
  data: T[]
): Promise<void> {
  try {
    const filePath = path.join(DB_PATH, `${collectionName}.json`);
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Erro ao escrever na coleção ${collectionName}:`, error);
    throw error;
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    // Testa se podemos ler/escrever no diretório
    const testPath = path.join(DB_PATH, "test.json");
    await fs.promises.writeFile(testPath, "{}");
    await fs.promises.readFile(testPath, "utf-8");
    await fs.promises.unlink(testPath);
    return true;
  } catch (error) {
    console.error("Erro ao testar conexão com JSON DB:", error);
    return false;
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

// Senha: admin123
const ADMIN_PASSWORD =
  "$2a$10$YQtGKyxHFJWC9Yx5mO1Hy.Uh0BEbXqYNgWWgi3hGjB.NWxGMtYVPi";

async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.promises.readFile(DB_FILE, "utf-8");
    const db = JSON.parse(data);
    return db.users || [];
  } catch (error) {
    console.error("Erro ao ler usuários:", error);
    return [];
  }
}

async function saveUsers(users: User[]): Promise<void> {
  try {
    const db = { users };
    await fs.promises.writeFile(DB_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error("Erro ao salvar usuários:", error);
    throw error;
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await getUsers();
    console.log("Procurando usuário com email:", email);
    console.log("Total de usuários no banco:", users.length);
    console.log(
      "Usuários disponíveis:",
      users.map((u) => ({
        email: u.email,
        name: u.name,
        role: u.role,
        active: u.active,
      }))
    );

    // Normaliza o email para comparação
    const normalizedEmail = email.toLowerCase().trim();

    const user = users.find((u) => {
      const userEmail = u.email.toLowerCase().trim();
      console.log(`Comparando ${userEmail} com ${normalizedEmail}`);
      return userEmail === normalizedEmail;
    });

    if (user) {
      console.log("Usuário encontrado:", {
        email: user.email,
        name: user.name,
        role: user.role,
        active: user.active,
      });
    } else {
      console.log("Usuário não encontrado");
    }

    return user || null;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}

export async function createUser(
  user: Omit<User, "id" | "createdAt" | "updatedAt" | "__v">
): Promise<User> {
  const users = await getUsers();
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser: User = {
    ...user,
    id: (users.length + 1).toString(),
    password: hashedPassword,
    active: true,
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
}

export async function updateUserPassword(
  id: string,
  newPassword: string
): Promise<User | null> {
  const users = await getUsers();
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) return null;

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  users[userIndex] = {
    ...users[userIndex],
    password: hashedPassword,
  };
  await saveUsers(users);
  return users[userIndex];
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    console.log("Verificando senha...");
    console.log("Senha fornecida:", plainPassword);
    console.log("Hash armazenado:", hashedPassword);

    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log("Resultado da verificação:", isValid);

    if (!isValid) {
      console.log("Senha inválida. Detalhes:");
      console.log("- Senha fornecida:", plainPassword);
      console.log("- Hash armazenado:", hashedPassword);
    }

    return isValid;
  } catch (error) {
    console.error("Erro ao verificar senha:", error);
    return false;
  }
}

// Função para inicializar o banco de dados
export async function initializeDb() {
  try {
    console.log("Inicializando banco de dados...");

    const users = await getUsers();
    if (users.length === 0) {
      // Cria o usuário admin se não existir nenhum usuário
      const adminUser: User = {
        id: "1",
        name: "Admin",
        email: "admin@abecmed.com",
        password: ADMIN_PASSWORD,
        role: "admin",
        active: true,
      };
      await saveUsers([adminUser]);
      console.log("Usuário admin criado com sucesso");
    }
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error);
  }
}
