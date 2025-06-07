import React from "react";
import Image from "next/image";

interface HeroH1Props {
  className?: string;
}

const HeroH1: React.FC<HeroH1Props> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden ${className}`}
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
        <div className="absolute inset-0 bg-[#16829E]/70 sm:bg-[#16829E]/80" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight">
          <span className="relative inline-block">
            <span className="absolute -inset-1 bg-white/20 blur-lg rounded-lg" />
            <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80">
              Transformando Vidas
            </span>
          </span>
          <br />
          <span className="text-white/90 font-light tracking-wider text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl">
            através da Medicina Canábica
          </span>
        </h1>

        {/* Linha decorativa com efeito */}
        <div className="relative w-20 sm:w-24 md:w-32 h-0.5 sm:h-1 mx-auto mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full" />
          <div className="absolute inset-0 bg-white/30 blur-sm rounded-full" />
        </div>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/95 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
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
