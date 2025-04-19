"use client";

import React, { useState } from "react";
import { FaUserPlus, FaHeartbeat, FaCannabis, FaFlask } from "react-icons/fa";

interface HeroH6Props {
  className?: string;
}

interface Question {
  question: string;
  answer: string;
  list?: string[];
}

interface Faq {
  id: string;
  icon: React.ElementType;
  title: string;
  questions: Question[];
}

const HeroH6: React.FC<HeroH6Props> = ({ className = "" }) => {
  const [activeFaq, setActiveFaq] = useState<string>("associacao");

  const faqs: Faq[] = [
    {
      id: "associacao",
      icon: FaUserPlus,
      title: "Processo de Associação",
      questions: [
        {
          question: "Como me associar a ABEC?",
          answer:
            "O processo de associação é simples. Basta agendar uma consulta com um de nossos médicos parceiros, que avaliará seu caso e indicará o tratamento mais adequado.",
        },
        {
          question: "Quanto tempo leva o processo de associação?",
          answer:
            "Após a consulta médica, o processo de associação é concluído em até 48 horas úteis.",
        },
      ],
    },
    {
      id: "beneficios",
      icon: FaHeartbeat,
      title: "Benefícios Terapêuticos",
      questions: [
        {
          question: "Quais condições podem ser tratadas?",
          answer:
            "A cannabis medicinal pode auxiliar no tratamento de diversas condições, incluindo dor crônica, ansiedade, epilepsia, esclerose múltipla, entre outras.",
        },
        {
          question: "Quanto tempo leva para ver resultados?",
          answer:
            "Os resultados variam de acordo com cada paciente e condição, mas muitos relatam melhoras significativas nas primeiras semanas de tratamento.",
        },
      ],
    },
    {
      id: "cbd",
      icon: FaCannabis,
      title: "Sobre o CBD",
      questions: [
        {
          question: "O que é o CBD e como funciona?",
          answer:
            "O CBD (canabidiol) é um dos principais componentes da cannabis, com propriedades terapêuticas e sem efeitos psicoativos. Ele interage com o sistema endocanabinoide do corpo, auxiliando no equilíbrio de diversas funções.",
        },
        {
          question: "O tratamento é seguro?",
          answer:
            "Sim, quando prescrito e acompanhado por profissionais qualificados, o tratamento com cannabis medicinal é seguro e eficaz.",
        },
      ],
    },
    {
      id: "tratamentos",
      icon: FaFlask,
      title: "Tratamentos/Aplicações",
      questions: [
        {
          question: "Quais produtos estão disponíveis?",
          answer:
            "Oferecemos uma variedade de produtos para atender diferentes necessidades:",
          list: [
            "Óleos full spectrum",
            "Óleos isolados de CBD",
            "Flores in natura",
            "Extratos concentrados",
            "Produtos tópicos",
          ],
        },
        {
          question: "Como é feito o acompanhamento do tratamento?",
          answer:
            "O acompanhamento é realizado por nossa equipe médica, com consultas regulares para ajuste de dosagem e avaliação dos resultados.",
        },
      ],
    },
  ];

  const activeFaqData = faqs.find((faq) => faq.id === activeFaq);

  return (
    <div
      className={`relative w-full min-h-[900px] flex items-center justify-center bg-white ${className}`}
    >
      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-0 sm:px-8 md:px-12 lg:px-16">
        {/* Título Principal */}
        <div className="text-center mb-16 pt-8 md:pt-0">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#16829E] mb-4">
            <span className="block text-[#16829E]/80 font-light mb-2 text-4xl sm:text-5xl md:text-6xl">
              Tire Suas Dúvidas
            </span>
            <span className="[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] text-2xl sm:text-3xl">
              Dúvidas Frequentes
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Encontre respostas para as principais questões sobre cannabis
            medicinal e nossos serviços
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#16829E]/50 to-transparent mx-auto mt-4" />
        </div>

        {/* Grid de FAQs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lista de FAQs */}
          <div className="bg-white rounded-none sm:rounded-xl shadow-md border border-gray-100 overflow-hidden relative h-fit">
            <div className="p-4 space-y-2">
              {faqs.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => setActiveFaq(faq.id)}
                  className={`w-full p-4 flex items-center rounded-none sm:rounded-lg transition-all duration-300 relative ${
                    activeFaq === faq.id
                      ? "bg-[#16829E] text-white shadow-lg"
                      : "hover:bg-gray-50 text-gray-800 hover:shadow-md"
                  }`}
                >
                  <faq.icon
                    className={`text-2xl mr-3 ${
                      activeFaq === faq.id ? "text-white" : "text-[#16829E]"
                    }`}
                  />
                  <h3
                    className={`text-lg font-semibold ${
                      activeFaq === faq.id ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {faq.title}
                  </h3>
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo da FAQ Ativa */}
          <div className="bg-white rounded-none sm:rounded-xl shadow-md border border-gray-100 overflow-hidden relative min-h-[400px]">
            <div className="p-6">
              {activeFaqData && (
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <activeFaqData.icon className="text-[#16829E] text-2xl mr-3" />
                    <h3 className="text-xl font-semibold text-[#16829E]">
                      {activeFaqData.title}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {activeFaqData.questions.map(
                      (item: Question, index: number) => (
                        <div
                          key={index}
                          className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                        >
                          <h4 className="font-semibold text-gray-800 mb-2">
                            {item.question}
                          </h4>
                          <p className="text-gray-600">{item.answer}</p>
                          {item.list && (
                            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                              {item.list.map(
                                (listItem: string, listIndex: number) => (
                                  <li key={listIndex}>{listItem}</li>
                                )
                              )}
                            </ul>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Efeito de Balão */}
      <style jsx>{`
        @media (min-width: 768px) {
          .bg-white.rounded-xl:first-of-type button.bg-\\[\\#16829E\\]::after {
            content: "";
            position: absolute;
            right: -16px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-top: 12px solid transparent;
            border-bottom: 12px solid transparent;
            border-left: 16px solid #16829e;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroH6;
