"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      // Redirect authenticated non-admins
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    // Loading indicator centered, considering the header height from RootLayout
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16829E]"></div>
      </div>
    );
  }

  // If authenticated as admin, render children. Child pages will use MainLayout.
  if (status === "authenticated" && session?.user?.role === "admin") {
    return <>{children}</>;
  }

  // Fallback for edge cases or while redirecting
  return null;
}

