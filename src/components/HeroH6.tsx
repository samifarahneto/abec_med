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
      className={`relative w-full min-h-[700px] sm:min-h-[800px] md:min-h-[900px] flex items-center justify-center bg-white ${className}`}
    >
      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Título Principal */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 pt-6 sm:pt-8 md:pt-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#16829E] mb-3 sm:mb-4">
            <span className="block text-[#16829E]/80 font-light mb-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              Tire Suas Dúvidas
            </span>
            <span className="[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] text-lg sm:text-xl md:text-2xl lg:text-3xl">
              Dúvidas Frequentes
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 sm:px-0">
            Encontre respostas para as principais questões sobre cannabis
            medicinal e nossos serviços
          </p>
          <div className="w-16 sm:w-20 md:w-24 h-0.5 bg-gradient-to-r from-transparent via-[#16829E]/50 to-transparent mx-auto mt-3 sm:mt-4" />
        </div>

        {/* Grid de FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Lista de FAQs */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100 overflow-hidden relative h-fit">
            <div className="p-3 sm:p-4 space-y-2">
              {faqs.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => setActiveFaq(faq.id)}
                  className={`w-full p-3 sm:p-4 flex items-center rounded-lg transition-all duration-300 relative ${
                    activeFaq === faq.id
                      ? "bg-[#16829E] text-white shadow-lg"
                      : "hover:bg-gray-50 text-gray-800 hover:shadow-md"
                  }`}
                >
                  <faq.icon
                    className={`text-lg sm:text-xl md:text-2xl mr-2 sm:mr-3 flex-shrink-0 ${
                      activeFaq === faq.id ? "text-white" : "text-[#16829E]"
                    }`}
                  />
                  <h3
                    className={`text-sm sm:text-base md:text-lg font-semibold text-left ${
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
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100 overflow-hidden relative min-h-[350px] sm:min-h-[400px]">
            <div className="p-4 sm:p-5 md:p-6">
              {activeFaqData && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <activeFaqData.icon className="text-[#16829E] text-lg sm:text-xl md:text-2xl mr-2 sm:mr-3 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#16829E]">
                      {activeFaqData.title}
                    </h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {activeFaqData.questions.map(
                      (item: Question, index: number) => (
                        <div
                          key={index}
                          className="border-b border-gray-100 last:border-0 pb-3 sm:pb-4 last:pb-0"
                        >
                          <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                            {item.question}
                          </h4>
                          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                            {item.answer}
                          </p>
                          {item.list && (
                            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 text-sm sm:text-base">
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

        {/* Seção de Call to Action */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16 pb-6 sm:pb-8">
          <div className="bg-gradient-to-r from-[#16829E] to-[#1E3A8A] p-6 sm:p-8 md:p-12 rounded-lg sm:rounded-xl text-white">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              Não encontrou sua resposta?
            </h3>
            <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 opacity-90 max-w-2xl mx-auto">
              Nossa equipe está pronta para esclarecer todas as suas dúvidas
              sobre tratamentos com cannabis medicinal
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <button className="w-full sm:w-auto bg-white text-[#16829E] px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base">
                Fale Conosco
              </button>
              <button className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-white hover:text-[#16829E] transition-all duration-200 text-sm sm:text-base">
                Agendar Consulta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroH6;
