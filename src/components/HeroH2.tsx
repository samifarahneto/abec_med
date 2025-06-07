import React from "react";
import Image from "next/image";

interface HeroH2Props {
  className?: string;
}

const HeroH2: React.FC<HeroH2Props> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-full min-h-[600px] sm:min-h-[700px] md:min-h-[800px] lg:min-h-[900px] flex items-center justify-center bg-white pb-8 sm:pb-12 md:pb-16 ${className}`}
    >
      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Título Principal */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#16829E] mb-3 sm:mb-4">
            <span className="block text-[#16829E]/80 font-light mb-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
              Nossa Essência
            </span>
            <span className="[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
              Nossa História e Missão
            </span>
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-0.5 bg-gradient-to-r from-transparent via-[#16829E]/50 to-transparent mx-auto" />
        </div>

        {/* Grid de Conteúdo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Quem Somos */}
          <div className="relative group overflow-hidden rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-[#16829E]/10">
            <div className="relative h-40 sm:h-44 md:h-48 w-full">
              <Image
                src="/images/quemsomos.webp"
                alt="Quem Somos"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#16829E] mb-3 sm:mb-4">
                Quem Somos
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                A Associação Brasileira de Estudos Canábicos (ABECMED) é uma
                entidade sem fins lucrativos dedicada a assegurar o melhor
                tratamento para seus associados.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-3 sm:mt-4">
                Integramos estudos científicos com pesquisas agrícolas e
                laboratoriais de ponta, garantindo excelência em nossos
                processos.
              </p>
            </div>
          </div>

          {/* Nossa Trajetória */}
          <div className="relative group overflow-hidden rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-[#16829E]/10">
            <div className="relative h-40 sm:h-44 md:h-48 w-full">
              <Image
                src="/images/trajetoria.webp"
                alt="Nossa Trajetória"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#16829E] mb-3 sm:mb-4">
                Nossa Trajetória
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Fundada em São Paulo em 2021, a ABECMED é uma associação
                autorizada judicialmente, garantindo segurança aos profissionais
                que prescrevem nossos produtos.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-3 sm:mt-4">
                Em 2022, expandimos nossas atividades para o sertão nordestino,
                às margens do Rio São Francisco.
              </p>
            </div>
          </div>

          {/* Impacto Social */}
          <div className="relative group overflow-hidden rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-[#16829E]/10 md:col-span-3 lg:col-span-1">
            <div className="relative h-40 sm:h-44 md:h-48 w-full">
              <Image
                src="/images/social.webp"
                alt="Impacto Social"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 sm:p-5 md:p-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#16829E] mb-3 sm:mb-4">
                Impacto Social
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Desenvolvemos projetos sociais que beneficiam a população local,
                onde cada associado contribui para a distribuição gratuita de
                óleos a famílias em vulnerabilidade.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-3 sm:mt-4">
                Geramos empregos diretos e indiretos, capacitando colaboradores
                locais e de outros estados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroH2;
