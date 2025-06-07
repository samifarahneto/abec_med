import React from "react";
import Image from "next/image";

interface HeroH3Props {
  className?: string;
}

const HeroH3: React.FC<HeroH3Props> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center bg-[#16829E] pt-8 sm:pt-12 md:pt-16 ${className}`}
    >
      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Texto */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 text-center md:text-left order-2 md:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4">
              <span className="block text-white/80 font-light mb-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                Medicina Natural
              </span>
              <div className="flex flex-col items-center md:items-start">
                <span className="[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] text-lg sm:text-xl md:text-2xl lg:text-3xl">
                  Resultados Reais
                </span>
                <div className="w-full max-w-xs md:max-w-none h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mt-2" />
              </div>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-lg mx-auto md:mx-0">
              Combinamos ciência e natureza para oferecer tratamentos seguros e
              eficazes, transformando a vida de nossos pacientes através da
              medicina canábica.
            </p>
          </div>

          {/* Imagem */}
          <div className="relative h-[250px] sm:h-[300px] md:h-[400px] w-full order-1 md:order-2">
            <Image
              src="/images/cbd.webp"
              alt="Medicina Natural"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroH3;
