import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail, verifyPassword, initializeDb } from "@/lib/json-db";

// Inicializar o banco de dados
let dbInitialized = false;

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Inicializa o banco de dados se ainda não foi inicializado
          if (!dbInitialized) {
            console.log("Inicializando banco de dados...");
            await initializeDb();
            dbInitialized = true;
          }

          console.log("Tentativa de login com email:", credentials?.email);

          if (!credentials?.email || !credentials?.password) {
            console.log("Email ou senha não fornecidos");
            throw new Error("Email e senha são obrigatórios");
          }

          const user = await findUserByEmail(credentials.email);
          console.log(
            "Usuário encontrado:",
            user ? { ...user, password: "***" } : null
          );

          if (!user) {
            console.log("Usuário não encontrado");
            throw new Error("Usuário não encontrado");
          }

          if (!user.active) {
            console.log("Usuário inativo");
            throw new Error("Usuário inativo");
          }

          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );
          console.log("Senha válida:", isValid);

          if (!isValid) {
            console.log("Senha inválida");
            throw new Error("Senha inválida");
          }

          console.log("Login bem sucedido para:", user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Erro durante a autenticação:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - User:", user);

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Session:", session);
      console.log("Session Callback - Token:", token);

      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          email: token.email as string,
          name: token.name as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
