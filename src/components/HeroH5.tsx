"use client";

import React from "react";
import {
  FaUserFriends,
  FaUserMd,
  FaChartLine,
  FaGlobeAmericas,
} from "react-icons/fa";

interface HeroH5Props {
  className?: string;
}

const HeroH5: React.FC<HeroH5Props> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-full min-h-[600px] sm:min-h-[700px] md:min-h-[800px] flex items-center justify-center bg-[#16829E] ${className}`}
    >
      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-4">
        {/* Título Principal */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4">
            <span className="block text-white/80 font-light mb-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              Números que Fazem a Diferença
            </span>
            <span className="[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              Nossa dedicação em transformar vidas através da medicina canábica
              reflete-se em nossos resultados
            </span>
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto" />
        </div>

        {/* Grid de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Pacientes Atendidos */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg md:rounded-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-300 text-center group">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <FaUserFriends className="text-white text-xl sm:text-2xl md:text-3xl" />
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:text-white/90">
              2000+
            </div>
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white mb-2 group-hover:text-white/90">
              Pacientes Atendidos
            </h3>
          </div>

          {/* Médicos Parceiros */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg md:rounded-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-300 text-center group">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <FaUserMd className="text-white text-xl sm:text-2xl md:text-3xl" />
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:text-white/90">
              50+
            </div>
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white mb-2 group-hover:text-white/90">
              Médicos Parceiros
            </h3>
          </div>

          {/* Taxa de Satisfação */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg md:rounded-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-300 text-center group">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <FaChartLine className="text-white text-xl sm:text-2xl md:text-3xl" />
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:text-white/90">
              95%
            </div>
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white mb-2 group-hover:text-white/90">
              Taxa de Satisfação
            </h3>
          </div>

          {/* Cobertura Nacional */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg md:rounded-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-300 text-center group sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <FaGlobeAmericas className="text-white text-xl sm:text-2xl md:text-3xl" />
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:text-white/90">
              Brasil
            </div>
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white mb-2 group-hover:text-white/90">
              Cobertura Nacional
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroH5;
