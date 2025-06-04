import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  accessToken?: string;
}

interface AuthSession {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isExternalUser: boolean;
  logout: () => Promise<void>;
  redirectToRole: () => void;
  hasRole: (roles: string | string[]) => boolean;
}

export const useAuthSession = (): AuthSession => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user: UserData | null = useMemo(() => {
    return session?.user
      ? {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          accessToken: session.user.accessToken,
        }
      : null;
  }, [session?.user]);

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!user;
  const isExternalUser = !!user?.accessToken;

  const logout = useCallback(async () => {
    try {
      console.log("🚪 Fazendo logout...");

      // Se for usuário externo com access token, tentar logout na API externa
      if (user?.accessToken) {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;
        if (baseUrl) {
          try {
            console.log("🌐 Fazendo logout na API externa...");
            await fetch(`${baseUrl}/api/auth/logout`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
                "Content-Type": "application/json",
              },
            });
            console.log("✅ Logout da API externa realizado");
          } catch (error) {
            console.warn("⚠️ Erro no logout da API externa:", error);
          }
        }
      }

      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    } catch (error) {
      console.error("❌ Erro no logout:", error);
      // Fallback: redirecionar manualmente
      router.push("/login");
    }
  }, [user?.accessToken, router]);

  const redirectToRole = useCallback(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const roleRedirects: { [key: string]: string } = {
      admin: "/admin/dashboard",
      medico: "/medic",
      doctor: "/medic",
      reception: "/acolhimento/agendamentos",
      recepcao: "/acolhimento/agendamentos",
      paciente: "/paciente/dashboard",
      patient: "/paciente/dashboard",
    };

    const redirectPath =
      roleRedirects[user.role.toLowerCase()] || "/paciente/dashboard";
    console.log(
      `🚀 Redirecionando para área do role '${user.role}': ${redirectPath}`
    );
    router.push(redirectPath);
  }, [user, router]);

  const hasRole = useCallback(
    (roles: string | string[]): boolean => {
      if (!user) return false;

      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      return allowedRoles.some(
        (role) => role.toLowerCase() === user.role.toLowerCase()
      );
    },
    [user]
  );

  return {
    user,
    isLoading,
    isAuthenticated,
    isExternalUser,
    logout,
    redirectToRole,
    hasRole,
  };
};

// Hook para verificar permissões de acesso
export const useAuthorization = () => {
  const { user, hasRole } = useAuthSession();

  const canAccessAdmin = hasRole(["admin"]);
  const canAccessMedic = hasRole(["admin", "medico", "doctor"]);
  const canAccessReception = hasRole(["admin", "reception", "recepcao"]);
  const canAccessPatient = hasRole([
    "admin",
    "paciente",
    "patient",
    "medico",
    "doctor",
    "reception",
    "recepcao",
  ]);

  return {
    user,
    canAccessAdmin,
    canAccessMedic,
    canAccessReception,
    canAccessPatient,
    hasRole,
  };
};

// Utilitários para roles
export const roleUtils = {
  isAdmin: (role?: string) => role === "admin",
  isMedic: (role?: string) =>
    ["medico", "doctor"].includes(role?.toLowerCase() || ""),
  isReception: (role?: string) =>
    ["reception", "recepcao"].includes(role?.toLowerCase() || ""),
  isPatient: (role?: string) =>
    ["paciente", "patient"].includes(role?.toLowerCase() || ""),

  getRoleDisplayName: (role?: string) => {
    const roleNames: { [key: string]: string } = {
      admin: "Administrador",
      medico: "Médico",
      doctor: "Médico",
      reception: "Recepção",
      recepcao: "Recepção",
      paciente: "Paciente",
      patient: "Paciente",
    };
    return roleNames[role?.toLowerCase() || ""] || "Usuário";
  },
};
