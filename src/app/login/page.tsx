"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      console.log("=== INICIANDO LOGIN ===");
      console.log("Email:", email);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Não redirecionar automaticamente
      });

      console.log("Resultado do signIn:", result);

      if (result?.error) {
        console.error("❌ Erro no login:", result.error);
        if (result.error === "CredentialsSignin") {
          setError("Email ou senha incorretos");
        } else {
          setError(
            "Ocorreu um erro ao fazer login. Por favor, tente novamente."
          );
        }
      } else if (result?.ok) {
        console.log("✅ Login bem-sucedido! Obtendo sessão...");

        // Obter a sessão atualizada para pegar o role do usuário
        const session = await getSession();
        console.log("Sessão obtida:", session);

        if (session?.user?.role) {
          const redirectPath = getRedirectPath(session.user.role);
          console.log(`🚀 Redirecionando para: ${redirectPath}`);

          // Forçar refresh da página para garantir que a sessão seja reconhecida
          router.push(redirectPath);
          router.refresh();
        } else {
          console.log("⚠️ Role não encontrado, usando redirecionamento padrão");
          router.push("/paciente/dashboard");
          router.refresh();
        }
      }
    } catch (err) {
      console.error("💥 Erro geral no login:", err);
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getRedirectPath = (role: string): string => {
    const roleRedirects: { [key: string]: string } = {
      admin: "/admin/dashboard",
      medico: "/medic",
      doctor: "/medic",
      reception: "/acolhimento/agendamentos",
      recepcao: "/acolhimento/agendamentos",
      paciente: "/paciente/dashboard",
      patient: "/paciente/dashboard",
    };

    return roleRedirects[role.toLowerCase()] || "/paciente/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema ABEC Med
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#16829E] focus:border-[#16829E] focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#16829E] focus:border-[#16829E] focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#16829E] hover:bg-[#126a7e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16829E] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </div>
        </form>

        {/* Informações de debug em desenvolvimento */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-gray-100 rounded text-xs space-y-1">
              <p>
                <strong>Status:</strong> {loading ? "Processando..." : "Pronto"}
              </p>
              <p>
                <strong>Sessão:</strong> JWT com cookies (30 dias)
              </p>
              <p>
                <strong>API:</strong> AbecMed Externa Exclusiva
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs">
              <p className="font-semibold text-blue-800 mb-2">
                🌐 Sistema API Externa:
              </p>
              <div className="space-y-1 text-blue-700">
                <p>
                  <strong>Endpoint:</strong> AbecMed API
                </p>
                <p>
                  <strong>Autenticação:</strong> Exclusivamente via API externa
                </p>
                <p>
                  <strong>Roles:</strong> ADMIN→admin, DOCTOR→medico, etc.
                </p>
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded text-xs">
              <p className="font-semibold text-green-800 mb-2">
                🔐 Credenciais:
              </p>
              <div className="space-y-1 text-green-700">
                <p>
                  <strong>Use suas credenciais do sistema AbecMed</strong>
                </p>
                <p>
                  <em>Redirecionamento automático baseado no seu role</em>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
