"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UnauthorizedPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Se não há sessão, redirecionar para login
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  const handleGoHome = () => {
    if (session?.user?.role) {
      const redirectPath = getRedirectPath(session.user.role);
      router.push(redirectPath);
    } else {
      router.push("/login");
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

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8 text-center">
        <div>
          <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-4 sm:mt-6 text-center text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">
            Acesso Negado
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Você não tem permissão para acessar esta área
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Privilégios Insuficientes
              </h3>
              <div className="mt-2 text-xs sm:text-sm text-red-700">
                <p>
                  Sua conta ({session?.user?.email}) com role &apos;
                  {session?.user?.role}&apos; não possui permissões para acessar
                  esta seção do sistema.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-[#16829E] hover:bg-[#126a7e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16829E] transition-colors duration-200"
          >
            Ir para Minha Área
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-2 sm:py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16829E] transition-colors duration-200"
          >
            Fazer Logout
          </button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 sm:mt-6 p-3 bg-gray-100 rounded text-xs text-left">
            <p>
              <strong>Debug Info:</strong>
            </p>
            <p>Email: {session?.user?.email}</p>
            <p>Role: {session?.user?.role}</p>
            <p>ID: {session?.user?.id}</p>
          </div>
        )}
      </div>
    </div>
  );
}
