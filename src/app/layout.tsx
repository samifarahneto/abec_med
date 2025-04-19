import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AuthProvider from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ABEC Med - Clínica Médica",
  description: "Sistema de gestão para clínica médica",
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
          <Header />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
