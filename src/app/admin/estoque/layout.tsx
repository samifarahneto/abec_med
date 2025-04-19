"use client";

import { ReactNode } from "react";

interface EstoqueLayoutProps {
  children: ReactNode;
}

export default function EstoqueLayout({ children }: EstoqueLayoutProps) {
  return <div className="w-full">{children}</div>;
}
