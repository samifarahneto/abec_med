"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  FaArrowLeft,
  FaSave,
  FaUser,
  FaTrash,
  FaMapMarkerAlt,
} from "react-icons/fa";
import MainLayout from "@/components/MainLayout";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormAutocomplete,
  Button,
} from "@/components/ui";

interface Paciente {
  id: string;
  identifier: string;
  name: string;
  date_of_birth: string;
  cpf: string;
  gender: string;
  email: string;
  phone: string;
  observations: string;
  status: "ativo" | "inativo" | "suspenso";
  doctors_id?: string;
  users_id?: string;
  companies_id?: string;
  address_id?: string;
}

interface Address {
  id: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  complement?: string;
}

export default function EditPacientePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pacienteId = searchParams.get("id") || "1"; // Fallback para ID 1 se não houver parâmetro

  const [paciente, setPaciente] = useState<Paciente>({
    id: "",
    identifier: "",
    name: "",
    date_of_birth: "",
    cpf: "",
    gender: "",
    email: "",
    phone: "",
    observations: "",
    status: "ativo",
  });

  const [address, setAddress] = useState<Address>({
    id: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zip_code: "",
    complement: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        setLoading(true);

        // Mock data - substituir por chamada real da API
        const mockPaciente: Paciente = {
          id: pacienteId,
          identifier: "PAC001",
          name: "Maria Silva Santos",
          date_of_birth: "1985-03-15",
          cpf: "123.456.789-00",
          gender: "Feminino",
          email: "maria.santos@email.com",
          phone: "(11) 99999-9999",
          observations: "Paciente regular, sem alergias conhecidas",
          status: "ativo",
          doctors_id: "1",
          users_id: "1",
          companies_id: "1",
          address_id: "1",
        };

        const mockAddress: Address = {
          id: "1",
          street: "Rua das Flores",
          number: "123",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
          zip_code: "01234-567",
          complement: "Apto 45",
        };

        setPaciente(mockPaciente);
        setAddress(mockAddress);
      } catch (error) {
        setError("Erro ao carregar paciente");
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadData = async () => {
      await fetchPaciente();
    };

    loadData();
  }, [pacienteId]);

  const handlePacienteChange = (field: keyof Paciente, value: string) => {
    setPaciente((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validações básicas
      if (!paciente.name.trim()) {
        throw new Error("Nome é obrigatório");
      }
      if (!paciente.cpf.trim()) {
        throw new Error("CPF é obrigatório");
      }
      if (!paciente.date_of_birth) {
        throw new Error("Data de nascimento é obrigatória");
      }

      // Mock de salvamento - substituir por chamada real da API
      console.log("Salvando paciente:", { paciente, address });

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect back to patients list
      router.push("/admin/pacientes");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Erro ao salvar paciente"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      // Mock de exclusão - substituir por chamada real da API
      console.log("Excluindo paciente:", pacienteId);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/admin/pacientes");
    } catch {
      setError("Erro ao excluir paciente");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#16829E]"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 bg-transparent">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Editar Paciente
              </h1>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Informações Pessoais */}
        <div className="space-y-6 h-full">
          <div className="bg-white rounded-lg shadow-sm border p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaUser className="w-5 h-5 mr-2 text-[#16829E]" />
              Informações Pessoais
            </h2>
            <div className="space-y-4">
              {/* Primeira linha: Nome, CPF, Data de Nascimento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Nome Completo"
                  type="text"
                  value={paciente.name}
                  onChange={(e) => handlePacienteChange("name", e.target.value)}
                  placeholder="Digite o nome completo"
                  required
                />
                <FormInput
                  label="CPF"
                  type="text"
                  value={paciente.cpf}
                  onChange={(e) => handlePacienteChange("cpf", e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
                <FormInput
                  label="Data de Nascimento"
                  type="date"
                  value={paciente.date_of_birth}
                  onChange={(e) =>
                    handlePacienteChange("date_of_birth", e.target.value)
                  }
                  required
                />
              </div>
              {/* Segunda linha: Gênero, Telefone, Status */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormInput
                  label="Email"
                  type="email"
                  value={paciente.email}
                  onChange={(e) =>
                    handlePacienteChange("email", e.target.value)
                  }
                  placeholder="email@exemplo.com"
                />
                <FormInput
                  label="Telefone"
                  type="tel"
                  value={paciente.phone}
                  onChange={(e) =>
                    handlePacienteChange("phone", e.target.value)
                  }
                  placeholder="(00) 00000-0000"
                />
                <FormSelect
                  label="Gênero"
                  value={paciente.gender}
                  onChange={(e) =>
                    handlePacienteChange("gender", e.target.value)
                  }
                  required
                  placeholder="Selecione..."
                  options={[
                    { value: "Masculino", label: "Masculino" },
                    { value: "Feminino", label: "Feminino" },
                    { value: "Outro", label: "Outro" },
                  ]}
                />
                <FormSelect
                  label="Status"
                  value={paciente.status}
                  onChange={(e) =>
                    handlePacienteChange(
                      "status",
                      e.target.value as "ativo" | "inativo" | "suspenso"
                    )
                  }
                  required
                  options={[
                    { value: "ativo", label: "Ativo" },
                    { value: "inativo", label: "Inativo" },
                    { value: "suspenso", label: "Suspenso" },
                  ]}
                />
              </div>
              {/* Observações */}
              <div>
                <FormTextarea
                  label="Observações"
                  value={paciente.observations}
                  onChange={(e) =>
                    handlePacienteChange("observations", e.target.value)
                  }
                  rows={3}
                  placeholder="Observações sobre o paciente..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-6 h-full">
          <div className="bg-white rounded-lg shadow-sm border p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaMapMarkerAlt className="w-5 h-5 mr-2 text-[#16829E]" />
              Endereço
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {/* Primeira linha: CEP, Rua, Número */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                <FormInput
                  label="CEP"
                  type="text"
                  value={address.zip_code}
                  onChange={(e) =>
                    handleAddressChange("zip_code", e.target.value)
                  }
                  placeholder="00000-000"
                />
                <FormInput
                  label="Rua/Avenida"
                  type="text"
                  value={address.street}
                  onChange={(e) =>
                    handleAddressChange("street", e.target.value)
                  }
                  placeholder="Nome da rua ou avenida"
                />
                <FormInput
                  label="Número"
                  type="text"
                  value={address.number}
                  onChange={(e) =>
                    handleAddressChange("number", e.target.value)
                  }
                  placeholder="Número"
                />
              </div>

              {/* Segunda linha: Complemento, Bairro, Estado, Cidade */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:col-span-2">
                <FormInput
                  label="Complemento"
                  type="text"
                  value={address.complement || ""}
                  onChange={(e) =>
                    handleAddressChange("complement", e.target.value)
                  }
                  placeholder="Apto, sala, etc."
                />
                <FormInput
                  label="Bairro"
                  type="text"
                  value={address.neighborhood}
                  onChange={(e) =>
                    handleAddressChange("neighborhood", e.target.value)
                  }
                  placeholder="Nome do bairro"
                />
                <FormAutocomplete
                  label="Estado"
                  value={address.state}
                  onChange={(value) => handleAddressChange("state", value)}
                  placeholder="Digite ou selecione o estado..."
                  options={[
                    { value: "AC", label: "Acre" },
                    { value: "AL", label: "Alagoas" },
                    { value: "AP", label: "Amapá" },
                    { value: "AM", label: "Amazonas" },
                    { value: "BA", label: "Bahia" },
                    { value: "CE", label: "Ceará" },
                    { value: "DF", label: "Distrito Federal (Brasília)" },
                    { value: "ES", label: "Espírito Santo" },
                    { value: "GO", label: "Goiás" },
                    { value: "MA", label: "Maranhão" },
                    { value: "MT", label: "Mato Grosso" },
                    { value: "MS", label: "Mato Grosso do Sul" },
                    { value: "MG", label: "Minas Gerais" },
                    { value: "PA", label: "Pará" },
                    { value: "PB", label: "Paraíba" },
                    { value: "PR", label: "Paraná" },
                    { value: "PE", label: "Pernambuco" },
                    { value: "PI", label: "Piauí" },
                    { value: "RJ", label: "Rio de Janeiro" },
                    { value: "RN", label: "Rio Grande do Norte" },
                    { value: "RS", label: "Rio Grande do Sul" },
                    { value: "RO", label: "Rondônia" },
                    { value: "RR", label: "Roraima" },
                    { value: "SC", label: "Santa Catarina" },
                    { value: "SP", label: "São Paulo" },
                    { value: "SE", label: "Sergipe" },
                    { value: "TO", label: "Tocantins" },
                  ]}
                />
                <FormInput
                  label="Cidade"
                  type="text"
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  placeholder="Nome da cidade"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botões centralizados abaixo das divs */}
        <div className="flex justify-end gap-4 mt-8">
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="primary"
            size="md"
            icon={<FaSave />}
            loading={saving}
          >
            {saving ? "Salvando..." : "Salvar"}
          </Button>
          <Button
            onClick={handleDelete}
            disabled={saving}
            variant="danger"
            size="md"
            icon={<FaTrash />}
          >
            Excluir
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
