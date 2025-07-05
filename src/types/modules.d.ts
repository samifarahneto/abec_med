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

declare module "@mui/icons-material/*" {
  import * as React from "react";
  const Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  export default Icon;
}

declare module "next/navigation" {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    prefetch: (url: string) => Promise<void>;
  };

  export function useSearchParams(): URLSearchParams;
  export function usePathname(): string;
  export function redirect(url: string): never;
  export function notFound(): never;
  export function permanentRedirect(url: string): never;
}

// Declarações globais do navegador
declare global {
  function confirm(message?: string): boolean;
  function alert(message?: string): void;
  function prompt(message?: string, defaultValue?: string): string | null;
}
