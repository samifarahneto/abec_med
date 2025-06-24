"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaSave,
  FaUserShield,
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

interface Administrador {
  id: string;
  name: string;
  cpf: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
  observations: string;
  nivel: "Master" | "Admin";
  address_id: string;
  companies_id: string;
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

export default function CadastrarAdministradorPage() {
  const router = useRouter();

  const [administrador, setAdministrador] = useState<Administrador>({
    id: "",
    name: "",
    cpf: "",
    date_of_birth: "",
    gender: "",
    email: "",
    phone: "",
    observations: "",
    nivel: "Admin",
    address_id: "",
    companies_id: "",
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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    field: keyof Administrador,
    value: string | string[]
  ) => {
    setAdministrador((prev) => ({
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
      if (!administrador.name.trim()) {
        throw new Error("Nome é obrigatório");
      }
      if (!administrador.cpf.trim()) {
        throw new Error("CPF é obrigatório");
      }
      if (!administrador.date_of_birth) {
        throw new Error("Data de nascimento é obrigatória");
      }
      if (!administrador.email.trim()) {
        throw new Error("Email é obrigatório");
      }

      // Mock de salvamento - substituir por chamada real da API
      console.log("Cadastrando administrador:", { administrador, address });

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect back to administradores list
      router.push("/admin/administradores");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar administrador"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
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
                Cadastrar Administrador
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
              <FaUserShield className="w-5 h-5 mr-2 text-[#16829E]" />
              Informações Pessoais
            </h2>
            <div className="space-y-4">
              {/* Primeira linha: Nome, CPF, Data de Nascimento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Nome Completo"
                  type="text"
                  value={administrador.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Digite o nome completo"
                  required
                />
                <FormInput
                  label="CPF"
                  type="text"
                  value={administrador.cpf}
                  onChange={(e) => handleChange("cpf", e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
                <FormInput
                  label="Data de Nascimento"
                  type="date"
                  value={administrador.date_of_birth}
                  onChange={(e) =>
                    handleChange("date_of_birth", e.target.value)
                  }
                  required
                />
              </div>
              {/* Segunda linha: Email, Telefone, Gênero, Nível */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormInput
                  label="Email"
                  type="email"
                  value={administrador.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
                <FormInput
                  label="Telefone"
                  type="tel"
                  value={administrador.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="(00) 00000-0000"
                />
                <FormSelect
                  label="Gênero"
                  value={administrador.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  required
                  placeholder="Selecione..."
                  options={[
                    { value: "Masculino", label: "Masculino" },
                    { value: "Feminino", label: "Feminino" },
                    { value: "Outro", label: "Outro" },
                  ]}
                />
                <FormSelect
                  label="Nível"
                  value={administrador.nivel}
                  onChange={(e) =>
                    handleChange("nivel", e.target.value as "Master" | "Admin")
                  }
                  required
                  placeholder="Selecione..."
                  options={[
                    { value: "Admin", label: "Admin" },
                    { value: "Master", label: "Master" },
                  ]}
                />
              </div>
              {/* Observações */}
              <div>
                <FormTextarea
                  label="Observações"
                  value={administrador.observations}
                  onChange={(e) => handleChange("observations", e.target.value)}
                  rows={3}
                  placeholder="Observações sobre o administrador..."
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
              <div className="flex flex-col md:flex-row gap-4 md:col-span-2">
                <div className="md:w-[20%]">
                  <FormInput
                    label="CEP"
                    type="text"
                    value={address.zip_code}
                    onChange={(e) =>
                      handleAddressChange("zip_code", e.target.value)
                    }
                    placeholder="00000-000"
                  />
                </div>
                <div className="md:w-[70%]">
                  <FormInput
                    label="Rua/Avenida"
                    type="text"
                    value={address.street}
                    onChange={(e) =>
                      handleAddressChange("street", e.target.value)
                    }
                    placeholder="Nome da rua ou avenida"
                  />
                </div>
                <div className="md:w-[10%]">
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

        {/* Botões */}
        <div className="flex justify-end gap-4 mt-8">
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="primary"
            size="md"
            icon={<FaSave />}
            loading={saving}
          >
            {saving ? "Cadastrando..." : "Cadastrar Administrador"}
          </Button>
          <Button
            onClick={() => router.push("/admin/administradores")}
            disabled={saving}
            variant="secondary"
            size="md"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
