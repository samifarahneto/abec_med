import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Interfaces para tipagem
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      accessToken?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    email: string;
    name: string;
    accessToken?: string;
  }
}

// Interface para resposta da API externa
interface ExternalApiResponse {
  data: {
    data: {
      access_token: string;
      user: {
        id: number;
        email: string;
        role: string;
      };
    };
    message: string;
    statusCode: number;
  };
  message: string;
  statusCode: number;
}

// Função para fazer login na API externa
async function loginWithExternalApi(email: string, password: string) {
  console.log("🔍 [API Externa] Iniciando autenticação...");

  const baseUrl = process.env.BASE_URL;
  console.log("🔍 [API Externa] BASE_URL:", baseUrl);

  if (!baseUrl) {
    console.error(
      "❌ [API Externa] BASE_URL não configurada nas variáveis de ambiente"
    );
    throw new Error(
      "Configuração da API externa não encontrada. Contate o administrador."
    );
  }

  try {
    const apiUrl = `${baseUrl}/api/auth/login`;
    console.log("🌐 [API Externa] Endpoint:", apiUrl);
    console.log("📧 [API Externa] Email:", email);

    const requestBody = JSON.stringify({
      email,
      password,
    });
    console.log("📦 [API Externa] Enviando requisição...");

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    console.log("📡 [API Externa] Status da resposta:", response.status);
    console.log(
      "📡 [API Externa] Headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      console.log(`❌ [API Externa] Erro HTTP ${response.status}`);

      // Tentar ler o corpo da resposta para mais detalhes
      try {
        const errorText = await response.text();
        console.log("📝 [API Externa] Detalhes do erro:", errorText);

        // Personalizar mensagens de erro baseadas no status
        switch (response.status) {
          case 401:
            throw new Error("Email ou senha incorretos");
          case 403:
            throw new Error("Acesso negado. Verifique suas permissões.");
          case 404:
            throw new Error("Serviço de autenticação não encontrado");
          case 500:
            throw new Error(
              "Erro interno do servidor. Tente novamente em alguns minutos."
            );
          case 503:
            throw new Error(
              "Serviço temporariamente indisponível. Tente novamente."
            );
          default:
            throw new Error(
              `Erro na autenticação (${response.status}). Tente novamente.`
            );
        }
      } catch {
        console.log("⚠️ [API Externa] Não foi possível ler detalhes do erro");
        throw new Error(
          `Erro na autenticação (${response.status}). Tente novamente.`
        );
      }
    }

    const data: ExternalApiResponse = await response.json();
    console.log("✅ [API Externa] Resposta recebida:", {
      message: data.message,
      statusCode: data.statusCode,
      user: data.data?.data?.user,
      hasAccessToken: !!data.data?.data?.access_token,
    });

    if (data.statusCode === 200 && data.data?.data?.access_token) {
      const apiUser = data.data.data.user;
      console.log("👤 [API Externa] Dados do usuário:", apiUser);

      // Mapear roles da API externa para roles locais
      const roleMapping: { [key: string]: string } = {
        ADMIN: "admin",
        DOCTOR: "medico",
        MEDICO: "medico",
        RECEPTION: "reception",
        PATIENT: "paciente",
        PACIENTE: "paciente",
      };

      const mappedRole = roleMapping[apiUser.role.toUpperCase()] || "paciente";
      console.log(
        "🎭 [API Externa] Role mapeado:",
        `${apiUser.role} → ${mappedRole}`
      );

      const userResult = {
        id: apiUser.id.toString(),
        email: apiUser.email,
        name: apiUser.email.split("@")[0],
        role: mappedRole,
        accessToken: data.data.data.access_token,
      };

      console.log("🎯 [API Externa] Usuário autenticado com sucesso:", {
        ...userResult,
        accessToken: "***",
      });
      return userResult;
    }

    console.log("❌ [API Externa] Resposta inválida - dados ausentes");
    throw new Error("Resposta inválida da API. Contate o administrador.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("💥 [API Externa] Erro:", error.message);
      throw error; // Re-throw para manter a mensagem específica
    } else {
      console.error("💥 [API Externa] Erro desconhecido:", error);
      throw new Error(
        "Erro de conectividade com o servidor. Verifique sua conexão."
      );
    }
  }
}

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
          console.log("=== AUTENTICAÇÃO ABEC MED API ===");
          console.log("Email:", credentials?.email);

          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Email ou senha não fornecidos");
            throw new Error("Email e senha são obrigatórios");
          }

          console.log("🚀 Autenticando via API externa...");

          // Tentar login na API externa
          const externalUser = await loginWithExternalApi(
            credentials.email,
            credentials.password
          );

          console.log("✅ Login bem-sucedido para:", externalUser.email);
          return externalUser;
        } catch (error) {
          console.error("💥 Erro durante a autenticação:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("=== JWT CALLBACK ===");

      // Na primeira autenticação, user estará presente
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
        console.log("✅ JWT criado para usuário:", user.email);
      }

      return token;
    },

    async session({ session, token }) {
      console.log("=== SESSION CALLBACK ===");

      // Adicionar dados do token à sessão
      if (token) {
        session.user = {
          id: token.id as string,
          role: token.role as string,
          email: token.email as string,
          name: token.name as string,
          accessToken: token.accessToken as string,
        };
        console.log("✅ Sessão criada para:", session.user.email);
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log("=== REDIRECT CALLBACK ===");
      console.log("URL:", url);
      console.log("BaseURL:", baseUrl);

      // Se a URL for de callback, redirecionar para página principal
      if (url.includes("/api/auth/callback")) {
        console.log("Redirecionando para página principal após callback");
        return `${baseUrl}/`;
      }

      // Se for uma URL relativa, usar baseUrl
      if (url.startsWith("/")) {
        console.log("URL relativa detectada:", url);
        return `${baseUrl}${url}`;
      }

      // Se for URL do mesmo domínio, permitir
      if (url.startsWith(baseUrl)) {
        console.log("URL do mesmo domínio:", url);
        return url;
      }

      // Caso contrário, redirecionar para base
      console.log("Redirecionando para baseUrl");
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
    updateAge: 24 * 60 * 60, // Atualizar a cada 24 horas
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 dias
      },
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
