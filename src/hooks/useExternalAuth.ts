import { useState } from "react";

interface LoginCredentials {
  email: string;
  password: string;
}

interface ExternalUser {
  id: string;
  email: string;
  name: string;
  role: string;
  token?: string;
  avatar?: string;
}

interface AbecMedApiResponse {
  success: boolean;
  data?: {
    user?: AbecMedUser;
    token?: string;
    expires_at?: string;
  };
  user?: AbecMedUser;
  token?: string;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  fallback?: boolean;
  code?: string;
}

interface AbecMedUser {
  id: number | string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export const useExternalAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithExternalAPI = async (
    credentials: LoginCredentials
  ): Promise<ExternalUser | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log("=== HOOK: Iniciando login com API AbecMed ===");
      console.log("Email:", credentials.email);

      // Usar nossa rota interna que se conecta com a AbecMed
      const response = await fetch("/api/external-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          action: "login",
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();
      console.log("Resposta da integração AbecMed:", data);

      if (response.ok && data.success) {
        console.log("✅ Login AbecMed bem-sucedido via hook");
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          token: data.token,
          avatar: data.user.avatar,
        };
      } else {
        // Detectar se deve fazer fallback baseado no código de erro
        const shouldFallback =
          data.fallback ||
          data.code === "SERVICE_UNAVAILABLE" ||
          data.code === "NETWORK_ERROR" ||
          data.code === "SERVER_ERROR" ||
          response.status >= 500;

        if (shouldFallback) {
          console.log(
            "🔄 API AbecMed indisponível, será feito fallback para sistema local"
          );
          setError(null); // Não mostrar erro se vai fazer fallback
          return null;
        } else {
          // Erro de credenciais ou outro erro que não permite fallback
          const errorMessage = data.error || "Credenciais inválidas na AbecMed";
          setError(errorMessage);
          console.error(
            "❌ Erro no login AbecMed (sem fallback):",
            errorMessage
          );
          return null;
        }
      }
    } catch (err) {
      console.error("💥 Erro na requisição AbecMed (hook):", err);

      // Em caso de erro de fetch, assumir que é problema de conectividade
      // e permitir fallback
      console.log("🔄 Erro de conectividade, permitindo fallback");
      setError(null); // Não mostrar erro se vai fazer fallback
      return null;
    } finally {
      setLoading(false);
    }
  };

  const validateExternalToken = async (token: string): Promise<boolean> => {
    try {
      console.log("Validando token AbecMed...");

      const response = await fetch("/api/external-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          action: "validate",
          token: token,
        }),
      });

      const data = await response.json();
      return response.ok && data.success && data.valid;
    } catch (error) {
      console.error("Erro ao validar token AbecMed:", error);
      return false;
    }
  };

  const logoutExternalAPI = async (token: string): Promise<boolean> => {
    try {
      console.log("Fazendo logout na API AbecMed...");

      const response = await fetch("/api/external-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          action: "logout",
          token: token,
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Erro ao fazer logout na AbecMed:", error);
      // Retornar true mesmo com erro para permitir logout local
      return true;
    }
  };

  const fetchUserProfile = async (
    token: string
  ): Promise<ExternalUser | null> => {
    try {
      console.log("Buscando perfil do usuário na AbecMed...");

      const response = await fetch("/api/external-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          action: "profile",
          token: token,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            avatar: data.user.avatar,
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar perfil na AbecMed:", error);
      return null;
    }
  };

  const testAbecMedConnection = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      setLoading(true);
      console.log("Testando conexão com API AbecMed...");

      const response = await fetch("/api/external-auth?action=test", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          message: `Conexão com AbecMed bem-sucedida (Status: ${data.status})`,
        };
      } else {
        return {
          success: false,
          message: data.message || "Falha ao conectar com AbecMed",
        };
      }
    } catch (error) {
      console.error("Erro ao testar conexão AbecMed:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro de rede",
      };
    } finally {
      setLoading(false);
    }
  };

  const loginDirectly = async (
    credentials: LoginCredentials
  ): Promise<ExternalUser | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log("Login direto na API AbecMed:", credentials.email);

      // Conectar diretamente com a API AbecMed (para testes/debug)
      const response = await fetch(
        "https://abecmed-api-hrgcn.ondigitalocean.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        }
      );

      const data: AbecMedApiResponse = await response.json();
      console.log("Resposta direta da AbecMed:", data);

      if (response.ok && (data.success || response.status === 200)) {
        const user = data.user || data.data?.user;
        const token = data.token || data.data?.token;

        if (user) {
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: mapAbecMedRole(user.role),
            token: token,
            avatar: user.avatar,
          };
        }
      }

      // Tratar erros
      let errorMessage = "Credenciais inválidas";
      if (data.errors?.email) {
        errorMessage = data.errors.email[0];
      } else if (data.errors?.password) {
        errorMessage = data.errors.password[0];
      } else if (data.message) {
        errorMessage = data.message;
      }

      setError(errorMessage);
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro de conexão";
      setError(errorMessage);
      console.error("Erro no login direto AbecMed:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loginWithExternalAPI,
    validateExternalToken,
    logoutExternalAPI,
    fetchUserProfile,
    testAbecMedConnection,
    loginDirectly,
    loading,
    error,
    setError,
  };
};

// Função helper para mapear roles da AbecMed
function mapAbecMedRole(externalRole?: string): string {
  if (!externalRole) return "paciente";

  const roleMap: { [key: string]: string } = {
    admin: "admin",
    administrator: "admin",
    super_admin: "admin",
    medico: "medico",
    doctor: "medico",
    physician: "medico",
    paciente: "paciente",
    patient: "paciente",
    user: "paciente",
    recepcao: "reception",
    receptionist: "reception",
    reception: "reception",
    acolhimento: "reception",
  };

  return roleMap[externalRole.toLowerCase()] || "paciente";
}
