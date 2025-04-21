declare module "@/lib/auth" {
  export const authOptions: import("next-auth").NextAuthOptions;
}

declare module "@/lib/db" {
  export function findUserByEmail(email: string): Promise<{
    id: string;
    name: string;
    email: string;
    role: "paciente" | "medico" | "admin";
  } | null>;
}
