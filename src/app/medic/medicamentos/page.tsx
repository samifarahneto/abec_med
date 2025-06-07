"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaSearch } from "react-icons/fa";
import MainLayout from "@/components/MainLayout";

// Interfaces para os tipos de medicamentos
interface Medicamento {
  id: number;
  nome: string;
  tipo: string;
  strain_type?: string;
  canabinoide: string;
  quantidade: number;
  preco: number;
  foto: string;
}

export default function MedicamentosPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [busca, setBusca] = useState("");

  // Estados para cada categoria de medicamento
  const [oleos, setOleos] = useState<Medicamento[]>([]);
  const [flores, setFlores] = useState<Medicamento[]>([]);
  const [concentrados, setConcentrados] = useState<Medicamento[]>([]);
  const [comestiveis, setComestiveis] = useState<Medicamento[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "doctor") {
      router.push("/");
    } else if (status === "authenticated") {
      carregarMedicamentos();
    }
  }, [session, status, router]);

  const carregarMedicamentos = async () => {
    setLoadingData(true);
    setErrorLoading(null);
    try {
      // Usando fetch para carregar os arquivos da pasta public
      const [oleosRes, floresRes, concentradosRes, comestiveisRes] =
        await Promise.all([
          fetch("/oleos.json"),
          fetch("/flores.json"),
          fetch("/concentrados.json"),
          fetch("/comestiveis.json"),
        ]);

      // Verificando se todos os arquivos foram carregados com sucesso
      if (
        !oleosRes.ok ||
        !floresRes.ok ||
        !concentradosRes.ok ||
        !comestiveisRes.ok
      ) {
        throw new Error("Falha ao carregar dados dos medicamentos");
      }

      // Convertendo as respostas para JSON
      const [oleosData, floresData, concentradosData, comestiveisData] =
        await Promise.all([
          oleosRes.json(),
          floresRes.json(),
          concentradosRes.json(),
          comestiveisRes.json(),
        ]);

      // Atualizando os estados com os dados carregados
      setOleos(oleosData.produtos || []);
      setFlores(floresData.produtos || []);
      setConcentrados(concentradosData.produtos || []);
      setComestiveis(comestiveisData.produtos || []);
    } catch (error) {
      console.error("Erro ao carregar medicamentos:", error);
      setErrorLoading(
        "Não foi possível carregar os dados dos medicamentos. Verifique se os arquivos JSON estão na pasta 'public' do projeto."
      );
    } finally {
      setLoadingData(false);
    }
  };

  // Filtragem de medicamentos com base na busca
  const oleosFiltrados = oleos.filter(
    (med) =>
      med.nome.toLowerCase().includes(busca.toLowerCase()) ||
      med.tipo.toLowerCase().includes(busca.toLowerCase()) ||
      (med.canabinoide &&
        med.canabinoide.toLowerCase().includes(busca.toLowerCase()))
  );

  const floresFiltradas = flores.filter(
    (med) =>
      med.nome.toLowerCase().includes(busca.toLowerCase()) ||
      med.tipo.toLowerCase().includes(busca.toLowerCase()) ||
      (med.canabinoide &&
        med.canabinoide.toLowerCase().includes(busca.toLowerCase()))
  );

  const concentradosFiltrados = concentrados.filter(
    (med) =>
      med.nome.toLowerCase().includes(busca.toLowerCase()) ||
      med.tipo.toLowerCase().includes(busca.toLowerCase()) ||
      (med.canabinoide &&
        med.canabinoide.toLowerCase().includes(busca.toLowerCase()))
  );

  const comestiveisFiltrados = comestiveis.filter(
    (med) =>
      med.nome.toLowerCase().includes(busca.toLowerCase()) ||
      med.tipo.toLowerCase().includes(busca.toLowerCase()) ||
      (med.canabinoide &&
        med.canabinoide.toLowerCase().includes(busca.toLowerCase()))
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16829E]"></div>
      </div>
    );
  }

  // Função para renderizar um card de medicamento
  const renderMedicamentoCard = (medicamento: Medicamento) => (
    <div
      key={`${medicamento.tipo}-${medicamento.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      <div className="p-3 sm:p-4 flex-grow">
        <div className="mb-3 sm:mb-4 h-32 sm:h-40 overflow-hidden flex items-center justify-center bg-gray-100 rounded">
          {medicamento.foto ? (
            <div className="relative w-full h-full">
              <div
                className="w-full h-full bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${medicamento.foto})` }}
              />
            </div>
          ) : (
            <div className="text-gray-400 text-xs sm:text-sm">Sem imagem</div>
          )}
        </div>
        <h3
          className="text-sm sm:text-lg font-semibold text-[#16829E] mb-2 truncate"
          title={medicamento.nome}
        >
          {medicamento.nome}
        </h3>

        <div className="space-y-1 text-xs sm:text-sm text-gray-600">
          <p>
            <span className="font-medium">Tipo:</span> {medicamento.tipo}
          </p>
          {medicamento.strain_type && (
            <p>
              <span className="font-medium">Strain Type:</span>{" "}
              {medicamento.strain_type}
            </p>
          )}
          {medicamento.canabinoide && (
            <p>
              <span className="font-medium">Canabinoide:</span>{" "}
              {medicamento.canabinoide}
            </p>
          )}
          <p>
            <span className="font-medium">Quantidade:</span>{" "}
            {medicamento.quantidade}
          </p>
          <p>
            <span className="font-medium">Preço:</span> R${" "}
            {medicamento.preco ? medicamento.preco.toFixed(2) : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );

  // Função para renderizar uma seção de categoria
  const renderCategoria = (titulo: string, medicamentos: Medicamento[]) => {
    if (medicamentos.length === 0) return null;

    return (
      <div className="mb-8 sm:mb-10">
        <h2 className="text-lg sm:text-xl font-bold text-[#16829E] mb-3 sm:mb-4">
          {titulo}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {medicamentos.map(renderMedicamentoCard)}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold text-[#16829E] text-center sm:text-left">
            Medicamentos Disponíveis
          </h1>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar medicamentos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16829E] focus:border-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400 bg-white"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {loadingData ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#16829E]"></div>
          </div>
        ) : errorLoading ? (
          <div className="text-center py-8 sm:py-10 text-red-600 bg-red-50 p-4 rounded-lg">
            <p className="text-sm sm:text-base">{errorLoading}</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {renderCategoria("Óleos", oleosFiltrados)}
            {renderCategoria("Flores", floresFiltradas)}
            {renderCategoria("Concentrados", concentradosFiltrados)}
            {renderCategoria("Comestíveis", comestiveisFiltrados)}

            {oleosFiltrados.length === 0 &&
              floresFiltradas.length === 0 &&
              concentradosFiltrados.length === 0 &&
              comestiveisFiltrados.length === 0 && (
                <div className="text-center py-8 sm:py-10">
                  <p className="text-gray-500 text-sm sm:text-base">
                    Nenhum medicamento encontrado para &quot;{busca}&quot;.
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
