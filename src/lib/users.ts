import bcrypt from "bcryptjs";

// Senha: admin123
const ADMIN_PASSWORD =
  "$2a$10$YQtGKyxHFJWC9Yx5mO1Hy.Uh0BEbXqYNgWWgi3hGjB.NWxGMtYVPi";

export const users: {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@abecmed.com",
    password: ADMIN_PASSWORD,
    role: "admin",
  },
];

export async function findUserByEmail(email: string) {
  return users.find((u) => u.email === email);
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = {
    id: (users.length + 1).toString(),
    ...userData,
    password: hashedPassword,
  };
  users.push(newUser);
  return newUser;
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error("Erro ao verificar senha:", error);
    return false;
  }
}
