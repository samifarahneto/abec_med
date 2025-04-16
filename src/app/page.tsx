/**
 * Página inicial (Home) do site
 * Rota: "/"
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Conteúdo Principal - Mobile First */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#16829E]">
            Bem-vindo ao ABEC Med
          </h2>
          <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-gray-600">
            Sua saúde em primeiro lugar
          </p>
        </div>

        {/* Grid de Serviços - Mobile First */}
        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-6 border border-[#16829E]/10">
            <h3 className="text-base sm:text-lg font-medium text-[#16829E]">
              Consulta Médica
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Agende sua consulta com nossos especialistas
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-6 border border-[#16829E]/10">
            <h3 className="text-base sm:text-lg font-medium text-[#16829E]">
              Exames
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Realize seus exames com comodidade
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-6 border border-[#16829E]/10">
            <h3 className="text-base sm:text-lg font-medium text-[#16829E]">
              Atendimento 24h
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Suporte médico quando você precisar
            </p>
          </div>

          {/* Card 4 - Visível apenas em telas maiores */}
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-6 border border-[#16829E]/10 hidden xl:block">
            <h3 className="text-base sm:text-lg font-medium text-[#16829E]">
              Telemedicina
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Consultas online com nossos especialistas
            </p>
          </div>
        </div>
      </main>

      {/* Footer - Mobile First */}
      <footer className="bg-[#16829E] mt-8 sm:mt-12">
        <div className="max-w-[1440px] mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white/80 tracking-wider uppercase">
                Contato
              </h3>
              <p className="mt-2 sm:mt-4 text-sm sm:text-base text-white">
                (11) 1234-5678
              </p>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white/80 tracking-wider uppercase">
                Endereço
              </h3>
              <p className="mt-2 sm:mt-4 text-sm sm:text-base text-white">
                Rua Exemplo, 123 - São Paulo, SP
              </p>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white/80 tracking-wider uppercase">
                Horário
              </h3>
              <p className="mt-2 sm:mt-4 text-sm sm:text-base text-white">
                Segunda a Sexta: 8h às 18h
              </p>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white/80 tracking-wider uppercase">
                Redes Sociais
              </h3>
              <div className="mt-2 sm:mt-4 flex space-x-4">
                <a
                  href="#"
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
