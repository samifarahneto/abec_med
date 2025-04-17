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
      className={`relative w-full min-h-[800px] flex items-center justify-center bg-[#16829E] ${className}`}
    >
      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-4">
        {/* Título Principal */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            <span className="block text-white/80 font-light mb-2 text-4xl sm:text-5xl md:text-6xl">
              Números que Fazem a Diferença
            </span>
            <span className="[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] text-2xl sm:text-3xl">
              Nossa dedicação em transformar vidas através da medicina canábica
              reflete-se em nossos resultados
            </span>
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto" />
        </div>

        {/* Grid de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pacientes Atendidos */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-300 text-center group">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <FaUserFriends className="text-white text-3xl" />
            </div>
            <div className="text-5xl font-bold text-white mb-2 group-hover:text-white/90">
              2000+
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white/90">
              Pacientes Atendidos
            </h3>
          </div>

          {/* Médicos Parceiros */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-300 text-center group">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <FaUserMd className="text-white text-3xl" />
            </div>
            <div className="text-5xl font-bold text-white mb-2 group-hover:text-white/90">
              50+
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white/90">
              Médicos Parceiros
            </h3>
          </div>

          {/* Taxa de Satisfação */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-300 text-center group">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <FaChartLine className="text-white text-3xl" />
            </div>
            <div className="text-5xl font-bold text-white mb-2 group-hover:text-white/90">
              95%
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white/90">
              Taxa de Satisfação
            </h3>
          </div>

          {/* Cobertura Nacional */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-300 text-center group">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
              <FaGlobeAmericas className="text-white text-3xl" />
            </div>
            <div className="text-5xl font-bold text-white mb-2 group-hover:text-white/90">
              Brasil
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white/90">
              Cobertura Nacional
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroH5;
