"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface HeroH4Props {
  className?: string;
}

const HeroH4: React.FC<HeroH4Props> = ({ className = "" }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      name: "Maria Silva",
      since: "2022",
      image: "/images/profile1.png",
      rating: 5,
      text: "O tratamento com cannabis na Abecmed foi uma verdadeira transformação na minha qualidade de vida. Encontrei alívio para sintomas debilitantes de forma segura e eficaz. A equipe médica foi incrivelmente atenciosa e profissional. Grato pela oportunidade de viver melhor.",
    },
    {
      name: "João Santos",
      since: "2021",
      image: "/images/profile3.png",
      rating: 5,
      text: "Encontrei minha dose faz uns 5 meses. Melhorando meu sono, ansiedade e estabilidade na tendência depressiva. Minha avó, hoje com 85 anos com Alzheimer foi minha maior inspiração. Vendo a melhora dela e o conforto em contar com a cannabis, os riscos e preconceitos ficam pequenos.",
    },
    {
      name: "Ana Oliveira",
      since: "2023",
      image: "/images/profile2.png",
      rating: 5,
      text: "Parabéns pela criação do projeto e todos os seus profissionais, que prestam um serviço tão essencial, ético e imprescindível, pautado na amplitude do olhar sobre o sujeito e na disseminação tão necessária e urgente da Cannabis Medicinal.",
    },
    {
      name: "Carla Mendes",
      since: "2022",
      image: "/images/profile4.png",
      rating: 5,
      text: "Até hoje o único óleo que fez eu me sentir melhor física e psicologicamente foi o da ABEC, até então nenhum outro óleo supriu os dois aspectos. Sono e dores melhoraram consideravelmente. Sou recém tetraplégico com lesão medular, fratura na C5, C6 e C7.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div
      className={`relative w-full min-h-[700px] flex items-center justify-center bg-white ${className}`}
    >
      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-8 md:px-12 lg:px-16">
        {/* Título Principal */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#16829E] mb-4">
            <span className="block text-[#16829E]/80 font-light mb-2 text-4xl sm:text-5xl md:text-6xl">
              Depoimentos
            </span>
            <span className="[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] text-2xl sm:text-3xl">
              O que nossos associados dizem sobre nós
            </span>
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#16829E]/50 to-transparent mx-auto" />
        </div>

        {/* Carrossel de Depoimentos */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 bg-white p-8 rounded-xl shadow-lg border border-[#16829E]/10 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 ring-2 ring-[#16829E]/20">
                      <Image
                        src={slide.image}
                        alt={slide.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#16829E]">
                        {slide.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-1">
                        Paciente desde {slide.since}
                      </p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < slide.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <svg
                      className="absolute -top-2 -left-2 w-8 h-8 text-[#16829E]/20"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                    >
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="text-gray-600 leading-relaxed text-base pl-4">
                      {slide.text}
                    </p>
                    <svg
                      className="absolute -bottom-2 -right-2 w-8 h-8 text-[#16829E]/20 transform rotate-180"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                    >
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`block h-1 cursor-pointer rounded-2xl transition-all ${
                  currentSlide === index
                    ? "w-8 bg-[#16829E]"
                    : "w-4 bg-[#16829E]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroH4;
