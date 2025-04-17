import React from "react";
import Image from "next/image";

interface HeroH3Props {
  className?: string;
}

const HeroH3: React.FC<HeroH3Props> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-full min-h-[400px] flex items-center justify-center bg-[#16829E] pt-16 ${className}`}
    >
      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 lg:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              <span className="block text-white/80 font-light mb-2 text-4xl sm:text-5xl md:text-6xl">
                Medicina Natural
              </span>
              <div className="flex flex-col items-start">
                <span className="[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] text-2xl sm:text-3xl">
                  Resultados Reais
                </span>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mt-2" />
              </div>
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Combinamos ciência e natureza para oferecer tratamentos seguros e
              eficazes, transformando a vida de nossos pacientes através da
              medicina canábica.
            </p>
          </div>

          {/* Imagem */}
          <div className="relative h-[400px] w-full">
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
