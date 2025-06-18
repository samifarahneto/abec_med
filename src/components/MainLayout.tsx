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
      className={`w-[90%] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 ${className}`}
    >
      {children}
    </div>
  );
}
