import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import AuthProvider from "@/providers/AuthProvider";
import { CarrinhoProvider } from "@/contexts/CarrinhoContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ABECMed - Associação Brasileira de Estudos Canábicos",
  description: "Associação Brasileira de Estudos Canábicos",
};

// Suprimir avisos de hidratação em desenvolvimento
if (process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes("Warning: A tree hydrated but some attributes")) {
      return;
    }
    originalError.call(console, ...args);
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <CarrinhoProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </CarrinhoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
