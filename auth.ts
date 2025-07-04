import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getApiUrl, getApiHeaders } from "./src/config/api";

interface AbecMedUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  userType?: string;
  identifier?: string;
  company_id?: number;
}

interface AbecMedApiResponse {
  access_token?: string;
  // Estrutura antiga (fallback)
  success?: boolean;
  data?: {
    user?: AbecMedUser;
    token?: string;
  };
  user?: AbecMedUser;
  token?: string;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

// Função para decodificar JWT (sem verificação de assinatura)
function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("❌ Erro ao decodificar JWT:", error);
    return null;
  }
}

function mapAbecMedRole(userType?: string): string {
  if (!userType) return "patient";

  const roleMap: Record<string, string> = {
    // Novos mapeamentos baseados na API real
    ADMIN: "admin",
    DOCTOR: "doctor",
    MEDICO: "doctor",
    PHYSICIAN: "doctor",
    PATIENT: "patient",
    PACIENTE: "patient",
    RECEPTION: "reception",
    RECEPCAO: "reception",
    // Mapeamentos antigos (fallback)
    admin: "admin",
    administrator: "admin",
    doctor: "doctor",
    medico: "doctor",
    physician: "doctor",
    patient: "patient",
    paciente: "patient",
    reception: "reception",
    recepcao: "reception",
    receptionist: "reception",
  };

  return roleMap[userType.toUpperCase()] || "patient";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 === INÍCIO DA AUTENTICAÇÃO ===");
        console.log(
          "🔑 NEXTAUTH_SECRET:",
          process.env.NEXTAUTH_SECRET ? "presente" : "AUSENTE"
        );
        console.log(
          "🌍 NEXT_PUBLIC_API_BASE_URL:",
          process.env.NEXT_PUBLIC_API_BASE_URL || "AUSENTE"
        );

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Credenciais não fornecidas");
          return null;
        }

        try {
          console.log("📧 Email:", credentials.email);
          console.log("🔗 URL da API:", getApiUrl("LOGIN"));
          console.log("📋 Headers:", getApiHeaders());
          console.log("🌍 BASE_URL env:", process.env.NEXT_PUBLIC_API_BASE_URL);

          const requestBody = {
            email: credentials.email,
            password: credentials.password,
          };
          console.log("📦 Body da requisição:", requestBody);

          const response = await fetch(getApiUrl("LOGIN"), {
            method: "POST",
            headers: getApiHeaders(),
            body: JSON.stringify(requestBody),
          });

          console.log("📡 Status da resposta:", response.status);
          console.log(
            "📋 Headers da resposta:",
            Object.fromEntries(response.headers.entries())
          );

          // Verificar se a resposta é OK (200-299)
          if (!response.ok) {
            console.log(
              "❌ Resposta não OK:",
              response.status,
              response.statusText
            );

            // Tentar ler o erro
            try {
              const errorText = await response.text();
              console.log("📄 Texto do erro:", errorText);
            } catch {
              console.log("❌ Não foi possível ler o erro da resposta");
            }

            return null;
          }

          // Tentar fazer parse da resposta JSON
          let data: AbecMedApiResponse;
          try {
            data = await response.json();
            console.log("📦 Dados recebidos:", JSON.stringify(data, null, 2));
          } catch (parseError) {
            console.log("❌ Erro ao fazer parse do JSON:", parseError);
            const textResponse = await response.text();
            console.log("📄 Resposta como texto:", textResponse);
            return null;
          }

          // Verificar se temos access_token (nova estrutura da API)
          if (data.access_token) {
            console.log("✅ Access token recebido, decodificando JWT...");

            const decodedToken = decodeJWT(data.access_token);
            if (!decodedToken) {
              console.log("❌ Falha ao decodificar o JWT");
              return null;
            }

            console.log("📦 Dados decodificados do JWT:", decodedToken);

            const user: AbecMedUser = {
              id: (decodedToken.identifier ||
                decodedToken.id ||
                decodedToken.sub) as string,
              email: decodedToken.email as string,
              name: decodedToken.name as string,
              userType: decodedToken.userType as string,
              company_id: decodedToken.company_id as number,
            };

            console.log("👤 Dados do usuário extraídos:", user);

            if (!user.id || !user.email) {
              console.log("❌ Dados essenciais do usuário não encontrados");
              return null;
            }

            const mappedRole = mapAbecMedRole(user.userType);
            console.log("🎭 Role mapeado:", user.userType, "→", mappedRole);

            const returnUser = {
              id: user.id,
              email: user.email,
              name: user.name || user.email,
              role: mappedRole,
              accessToken: data.access_token,
            };

            console.log("✅ Usuário retornado:", returnUser);
            return returnUser;
          }

          // Fallback para estrutura antiga da API
          if (
            data.success ||
            response.status === 200 ||
            response.status === 201
          ) {
            console.log("✅ Login bem-sucedido (estrutura antiga)");

            const user = data.user || data.data?.user;
            const token = data.token || data.data?.token;

            console.log("👤 Dados do usuário extraídos:", user);
            console.log(
              "🎫 Token extraído:",
              token ? "Token presente" : "Token ausente"
            );

            if (!user) {
              console.log("❌ Dados do usuário não encontrados na resposta");
              return null;
            }

            const mappedRole = mapAbecMedRole(user.role || user.userType);
            console.log(
              "🎭 Role mapeado:",
              user.role || user.userType,
              "→",
              mappedRole
            );

            const returnUser = {
              id: user.id?.toString() || user.identifier?.toString() || "",
              email: user.email,
              name: user.name || user.email,
              role: mappedRole,
              accessToken: token,
            };

            // Verificar se temos ID válido
            if (!returnUser.id) {
              console.log("❌ ID do usuário não encontrado");
              return null;
            }

            console.log("✅ Usuário retornado:", returnUser);
            return returnUser;
          } else {
            console.log(
              "❌ Login não bem-sucedido:",
              data.message || data.error
            );
            return null;
          }
        } catch (error) {
          console.error("💥 Erro geral na autenticação:", error);
          if (error instanceof Error) {
            console.error("📋 Stack trace:", error.stack);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("🎫 JWT Callback - Token:", token ? "presente" : "ausente");
      console.log("👤 JWT Callback - User:", user ? "presente" : "ausente");

      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        console.log("✅ Token atualizado com role:", user.role);
      }
      return token;
    },
    async session({ session, token }) {
      console.log(
        "🎭 Session Callback - Session:",
        session ? "presente" : "ausente"
      );
      console.log(
        "🎫 Session Callback - Token:",
        token ? "presente" : "ausente"
      );

      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
        console.log("✅ Sessão atualizada com role:", token.role);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret:
    process.env.NEXTAUTH_SECRET || "abecmed-fallback-secret-2024-development",
  debug: process.env.NODE_ENV === "development",
});
