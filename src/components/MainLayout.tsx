"use client";

import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 ${className}`}
    >
      {children}
    </div>
  );
};

export default MainLayout;
