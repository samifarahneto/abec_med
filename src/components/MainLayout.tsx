"use client";

import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainLayout({
  children,
  className = "",
}: MainLayoutProps) {
  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 ${className}`}
    >
      {children}
    </div>
  );
}
