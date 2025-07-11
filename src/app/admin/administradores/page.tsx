"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import MainLayout from "@/components/MainLayout";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import ButtonComponent from "@/components/ui/Button";

interface Administrador extends Record<string, unknown> {
  id: number;
  identifier: string;
  userId: number;
  companyId: number;
  name: string;
  cpf: string;
  dateOfBirth: string;
  gender?: string;
  phone?: string;
  observations?: string;
  status: "ACTIVE" | "INACTIVE";
  addressId: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdministradoresPage() {
  const router = useRouter();
  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [filteredAdministradores, setFilteredAdministradores] = useState<
    Administrador[]
  >([]);

  // Estados dos filtros
  const [filterCpf, setFilterCpf] = useState<string>("");
  const [filterName, setFilterName] = useState<string>("");
  const [filterPhone, setFilterPhone] = useState<string>("");
  const [filterEmail, setFilterEmail] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchAdministradores();
  }, []);

  // Inicializar dados filtrados quando os administradores são carregados
  useEffect(() => {
    setFilteredAdministradores(administradores);
    setTotalItems(administradores.length);
  }, [administradores]);

  const fetchAdministradores = async () => {
    try {
      setLoading(true);
      // Simulando dados de administradores seguindo o modelo do banco
      const mockAdministradores: Administrador[] = [
        {
          id: 1,
          identifier: "550e8400-e29b-41d4-a716-446655440001",
          userId: 1,
          companyId: 1,
          name: "Admin Sistema",
          cpf: "123.456.789-00",
          dateOfBirth: "1985-01-15",
          gender: "M",
          phone: "(11) 99999-0001",
          observations: "Administrador principal do sistema",
          status: "ACTIVE",
          addressId: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-20T00:00:00Z",
        },
        {
          id: 2,
          identifier: "550e8400-e29b-41d4-a716-446655440002",
          userId: 2,
          companyId: 1,
          name: "Carlos Roberto Silva",
          cpf: "987.654.321-00",
          dateOfBirth: "1980-03-20",
          gender: "M",
          phone: "(11) 99999-0002",
          observations: "Coordenador técnico",
          status: "ACTIVE",
          addressId: 2,
          createdAt: "2024-01-05T00:00:00Z",
          updatedAt: "2024-01-19T00:00:00Z",
        },
        {
          id: 3,
          identifier: "550e8400-e29b-41d4-a716-446655440003",
          userId: 3,
          companyId: 1,
          name: "Ana Paula Santos",
          cpf: "456.789.123-00",
          dateOfBirth: "1988-07-10",
          gender: "F",
          phone: "(11) 99999-0003",
          observations: "Supervisora administrativa",
          status: "ACTIVE",
          addressId: 3,
          createdAt: "2024-01-08T00:00:00Z",
          updatedAt: "2024-01-18T00:00:00Z",
        },
        {
          id: 4,
          identifier: "550e8400-e29b-41d4-a716-446655440004",
          userId: 4,
          companyId: 1,
          name: "Ricardo Mendes",
          cpf: "789.123.456-00",
          dateOfBirth: "1975-12-05",
          gender: "M",
          phone: "(11) 99999-0004",
          observations: "Administrador",
          status: "INACTIVE",
          addressId: 4,
          createdAt: "2024-01-03T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        },
      ];

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAdministradores(mockAdministradores);
      setTotalItems(mockAdministradores.length);
    } catch (error) {
      setError("Erro ao carregar administradores");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Administrador["status"]) => {
    const statusConfig = {
      ACTIVE: {
        color: "bg-green-500",
        text: "Ativo",
        bgClass: "bg-green-50 text-green-700 border-green-200",
      },
      INACTIVE: {
        color: "bg-red-500",
        text: "Inativo",
        bgClass: "bg-red-50 text-red-700 border-red-200",
      },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bgClass}`}
      >
        <span className={`w-2 h-2 ${config.color} rounded-full mr-1`}></span>
        {config.text}
      </span>
    );
  };

  const formatCPF = (cpf: string) => {
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/\D/g, "");
    // Aplica máscara
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPhone = (phone: string) => {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, "");
    // Aplica máscara baseada no tamanho
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  };

  const handleEdit = (administrador: Administrador) => {
    // Aqui seria redirecionado para página de edição do administrador
    console.log("Editar administrador:", administrador);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este administrador?")) return;

    try {
      // Aqui seria a chamada para a API real
      setAdministradores(administradores.filter((a) => a.id !== id));
      setTotalItems((prev) => prev - 1);
    } catch (error) {
      setError("Erro ao excluir administrador");
      console.error("Erro:", error);
    }
  };

  // Função para executar pesquisa com filtros
  const handleSearch = () => {
    setCurrentPage(1); // Resetar para primeira página

    const filtered = administradores.filter(
      (admin) =>
        (filterName === "" ||
          String(admin.name)
            .toLowerCase()
            .includes(filterName.toLowerCase())) &&
        (filterCpf === "" ||
          String(admin.cpf).toLowerCase().includes(filterCpf.toLowerCase())) &&
        (filterPhone === "" ||
          (admin.phone &&
            String(admin.phone)
              .toLowerCase()
              .includes(filterPhone.toLowerCase()))) &&
        (filterStatus === "" || admin.status === filterStatus)
    );

    setFilteredAdministradores(filtered);
    setTotalItems(filtered.length);

    console.log("🔍 Filtros aplicados:", {
      cpf: filterCpf,
      name: filterName,
      phone: filterPhone,
      email: filterEmail,
      status: filterStatus,
    });
    console.log(`✅ ${filtered.length} administradores encontrados`);
  };

  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(`Navegando para página ${page}`);
  };

  // Função para limpar filtros
  const handleClearFilters = () => {
    setFilterCpf("");
    setFilterName("");
    setFilterPhone("");
    setFilterEmail("");
    setFilterStatus("");
    setCurrentPage(1); // Resetar para primeira página
    setFilteredAdministradores(administradores); // Mostrar todos os administradores
    setTotalItems(administradores.length);
  };

  // Fatiar administradores filtrados para exibir apenas 10 por página
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const administradoresPaginados = filteredAdministradores.slice(
    startIndex,
    endIndex
  );

  const columns = [
    {
      key: "name" as keyof Administrador,
      header: "Nome",
      render: (admin: Record<string, unknown>) => (
        <span className="text-gray-900 text-sm font-medium">
          {String((admin as Administrador).name)}
        </span>
      ),
    },
    {
      key: "cpf" as keyof Administrador,
      header: "CPF",
      render: (admin: Record<string, unknown>) => (
        <span className="text-gray-900 text-sm font-medium">
          {formatCPF(String((admin as Administrador).cpf))}
        </span>
      ),
    },
    {
      key: "phone" as keyof Administrador,
      header: "Telefone",
      render: (admin: Record<string, unknown>) => (
        <span className="text-gray-900 text-sm font-medium">
          {(admin as Administrador).phone
            ? formatPhone((admin as Administrador).phone!)
            : "-"}
        </span>
      ),
    },
    {
      key: "status" as keyof Administrador,
      header: "Status",
      render: (admin: Record<string, unknown>) =>
        getStatusBadge((admin as Administrador).status),
    },
  ];

  const actions = [
    {
      label: "Editar",
      icon: <FaEdit className="w-4 h-4" />,
      onClick: (admin: Record<string, unknown>) =>
        handleEdit(admin as Administrador),
      variant: "primary" as const,
    },
    {
      label: "Excluir",
      icon: <FaTrash className="w-4 h-4" />,
      onClick: (admin: Record<string, unknown>) =>
        handleDelete((admin as Administrador).id),
      variant: "danger" as const,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 bg-transparent min-h-screen p-2 md:p-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Gerenciar Administradores
          </h1>
          <p className="text-gray-600 text-sm">
            Visualize e gerencie todos os administradores do sistema
          </p>
        </div>

        {/* Stats Section */}
        {!loading && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 md:mb-0">
                Resumo dos Administradores
              </h3>
              <ButtonComponent
                onClick={() => router.push("/admin/administradores/novo")}
                variant="success"
                size="md"
                icon={<FaPlus fontSize="small" />}
              >
                Novo Administrador
              </ButtonComponent>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#f7fafc] p-6 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mb-2"></div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {administradores.length}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">
                  Total
                </div>
              </div>
              <div className="bg-[#f7fafc] p-6 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                <div className="w-3 h-3 bg-green-600 rounded-full mb-2"></div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {administradores.filter((a) => a.status === "ACTIVE").length}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">
                  Ativos
                </div>
              </div>
              <div className="bg-[#f7fafc] p-6 rounded-xl border border-[#e2e8f0] text-center flex flex-col items-center">
                <div className="w-3 h-3 bg-red-600 rounded-full mb-2"></div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {
                    administradores.filter((a) => a.status === "INACTIVE")
                      .length
                  }
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">
                  Inativos
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Filtros de Pesquisa
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
            <div className="form-group">
              <FormInput
                label="CPF"
                value={filterCpf}
                onChange={(e) => setFilterCpf(e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="form-group">
              <FormInput
                label="Telefone"
                value={filterPhone}
                onChange={(e) => setFilterPhone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="form-group">
              <FormInput
                label="Email"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
                placeholder="exemplo@email.com"
              />
            </div>
            <div className="form-group">
              <FormInput
                label="Nome"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Nome do administrador"
              />
            </div>
            <div className="form-group">
              <FormSelect
                label="Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: "", label: "Todos os status" },
                  { value: "ACTIVE", label: "Ativo" },
                  { value: "INACTIVE", label: "Inativo" },
                ]}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <ButtonComponent
              onClick={handleSearch}
              variant="primary"
              size="md"
              icon={<FaSearch fontSize="small" />}
            >
              Pesquisar
            </ButtonComponent>
            <ButtonComponent
              onClick={handleClearFilters}
              variant="secondary"
              size="md"
            >
              Limpar Filtros
            </ButtonComponent>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Administradores Encontrados
            </h3>
          </div>
          <Table
            data={administradoresPaginados}
            columns={columns}
            actions={actions}
            loading={loading}
            emptyMessage="Nenhum administrador encontrado"
          />

          {/* Componente de Paginação */}
          {!loading && totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / 10)} // Assuming 10 items per page
              totalItems={totalItems}
              itemsPerPage={10}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
