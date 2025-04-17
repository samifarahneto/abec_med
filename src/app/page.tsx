/**
 * Página inicial (Home) do site
 * Rota: "/"
 */

"use client";

import HeroH1 from "@/components/HeroH1";
import HeroH2 from "@/components/HeroH2";
import HeroH3 from "@/components/HeroH3";
import HeroH4 from "@/components/HeroH4";
import HeroH5 from "@/components/HeroH5";
import HeroH6 from "@/components/HeroH6";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <HeroH1 className="shadow-[inset_0_4px_4px_-2px_rgba(0,0,0,0.3),inset_0_-4px_4px_-2px_rgba(0,0,0,0.3)]" />
      <HeroH2 />
      <HeroH3 className="shadow-[inset_0_4px_4px_-2px_rgba(0,0,0,0.3),inset_0_-4px_4px_-2px_rgba(0,0,0,0.3)]" />
      <HeroH4 />
      <HeroH5 className="shadow-[inset_0_4px_4px_-2px_rgba(0,0,0,0.3),inset_0_-4px_4px_-2px_rgba(0,0,0,0.3)]" />
      <HeroH6 />
    </main>
  );
}
