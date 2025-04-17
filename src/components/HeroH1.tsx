import React from "react";
import Image from "next/image";

interface HeroH1Props {
  className?: string;
}

const HeroH1: React.FC<HeroH1Props> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-full min-h-[600px] flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Imagem de fundo */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/modelo.webp"
          alt="Modelo"
          fill
          className="object-cover lg:object-[center_30%] lg:scale-110"
          priority
        />
        {/* Overlay escuro para melhorar legibilidade */}
        <div className="absolute inset-0 bg-[#16829E]/80" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
          <span className="relative inline-block">
            <span className="absolute -inset-1 bg-white/20 blur-lg rounded-lg" />
            <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80">
              Transformando Vidas
            </span>
          </span>
          <br />
          <span className="text-white/90 font-light tracking-wider">
            através da Medicina Canábica
          </span>
        </h1>

        {/* Linha decorativa com efeito */}
        <div className="relative w-32 h-1 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full" />
          <div className="absolute inset-0 bg-white/30 blur-sm rounded-full" />
        </div>

        <p className="text-lg sm:text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed">
          <span className="font-light tracking-wider">
            Associação Brasileira de Estudos Canábicos:
          </span>
          <br />
          <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Pioneira em tratamentos
          </span>
          <br />
          <span className="italic tracking-wider">
            seguros e eficazes com cannabis medicinal.
          </span>
        </p>
      </div>
    </div>
  );
};

export default HeroH1;
