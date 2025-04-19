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
      className={`relative w-full min-h-[600px] bg-white py-16 ${className}`}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-0 sm:px-8 md:px-12 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#16829E] mb-4">
            <span className="block text-[#16829E]/80 font-light mb-2 text-2xl sm:text-3xl">
              Depoimentos
            </span>
            <span className="[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
              O que nossos pacientes dizem
            </span>
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#16829E]/50 to-transparent mx-auto" />
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4 sm:px-0">
                  <div className="bg-white rounded-none sm:rounded-xl shadow-lg p-8 mx-0 sm:mx-4">
                    <div className="flex items-center mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                        <Image
                          src={slide.image}
                          alt={slide.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#16829E]">
                          {slide.name}
                        </h3>
                        <p className="text-gray-500">
                          Associado desde {slide.since}
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(slide.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {slide.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#16829E] p-2 rounded-full shadow-lg z-10"
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + slides.length) % slides.length
              )
            }
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#16829E] p-2 rounded-full shadow-lg z-10"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % slides.length)
            }
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroH4;
