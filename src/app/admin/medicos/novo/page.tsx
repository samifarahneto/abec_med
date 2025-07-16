"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStates, State } from "@/hooks/useStates";
import { useCities, City } from "@/hooks/useCities";
import { useDebounce } from "@/hooks/useDebounce";
import { normalizeForSearch } from "@/utils/stringUtils";
import {
  FaArrowLeft,
  FaSave,
  FaUser,
  FaMapMarkerAlt,
  FaKey,
} from "react-icons/fa";
import MainLayout from "@/components/MainLayout";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormAutocomplete,
  Button,
} from "@/components/ui";

interface Medico {
  id: string;
  name: string;
  cpf: string;
  documentDoctorType: string;
  documentDoctorNumber: string;
  documentDoctorUf: string;
  phone: string;
  email: string;
  observations: string;
  status: "ACTIVE" | "INACTIVE";
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
  cityId?: number;
  stateId?: number;
}

export default function CadastrarMedicoPage() {
  const router = useRouter();

  const [medico, setMedico] = useState<Medico>({
    id: "",
    name: "",
    cpf: "",
    documentDoctorType: "",
    documentDoctorNumber: "",
    documentDoctorUf: "",
    phone: "",
    email: "",
    observations: "",
    status: "ACTIVE",
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

  const [userPassword, setUserPassword] = useState("");
  const [userPasswordConfirm, setUserPasswordConfirm] = useState("");

  // Estados para autocomplete
  const [stateQuery, setStateQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // Hooks para API
  const {
    searchStates,
    loading: statesLoading,
    error: statesError,
  } = useStates();
  const {
    searchCities,
    fetchCitiesByState,
    clearCities,
    loading: citiesLoading,
    error: citiesError,
  } = useCities();

  // Debounce para otimizar buscas
  const debouncedStateQuery = useDebounce(stateQuery, 300);
  const debouncedCityQuery = useDebounce(cityQuery, 300);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Efeito para buscar cidades quando estado é selecionado
  useEffect(() => {
    if (selectedState) {
      console.log(
        `🏛️ Estado selecionado: ${selectedState.name} (ID: ${selectedState.id})`
      );
      fetchCitiesByState(selectedState.id);
    } else {
      console.log("🗑️ Limpando cidades - nenhum estado selecionado");
      clearCities();
      setSelectedCity(null);
      setCityQuery("");
    }
  }, [selectedState, fetchCitiesByState, clearCities]);

  // Efeito para atualizar o endereço quando estado/cidade são selecionados
  useEffect(() => {
    if (selectedState) {
      setAddress((prev) => ({
        ...prev,
        state: selectedState.name,
        stateId: selectedState.id,
      }));
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity) {
      setAddress((prev) => ({
        ...prev,
        city: selectedCity.name,
        cityId: selectedCity.id,
      }));
    }
  }, [selectedCity]);

  const handleMedicoChange = (field: keyof Medico, value: string) => {
    setMedico((prev) => ({
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

  // Funções para autocomplete de estados
  const handleStateChange = (value: string) => {
    setStateQuery(value);

    // Verificar se o valor é uma seleção completa do dropdown (formato "Nome (UF)")
    const isCompleteSelection = value.includes("(") && value.includes(")");

    if (isCompleteSelection) {
      // Extrair o nome do estado do formato "Nome (UF)"
      const stateName = value.split(" (")[0];
      const matchedStates = searchStates(stateName);
      const exactMatch = matchedStates.find(
        (state) =>
          normalizeForSearch(state.name) === normalizeForSearch(stateName)
      );

      if (exactMatch && exactMatch !== selectedState) {
        console.log(
          `✅ Estado selecionado do dropdown: ${exactMatch.name} (${exactMatch.uf})`
        );
        setSelectedState(exactMatch);
        // Limpar cidade quando estado muda
        setSelectedCity(null);
        setCityQuery("");
      }
    } else if (value.length > 0) {
      // Busca normal por digitação
      const matchedStates = searchStates(value);
      const exactMatch = matchedStates.find(
        (state) =>
          normalizeForSearch(state.name) === normalizeForSearch(value) ||
          normalizeForSearch(state.uf) === normalizeForSearch(value)
      );

      if (exactMatch && exactMatch !== selectedState) {
        console.log(
          `✅ Estado selecionado por digitação: ${exactMatch.name} (${exactMatch.uf})`
        );
        setSelectedState(exactMatch);
        // Limpar cidade quando estado muda
        setSelectedCity(null);
        setCityQuery("");
      } else if (!exactMatch) {
        // Não limpar o selectedState se o usuário ainda está digitando
        // Só limpar se o valor for muito diferente
        const currentStateName = selectedState?.name || "";
        const currentStateUf = selectedState?.uf || "";
        const inputValue = value;

        if (
          !normalizeForSearch(currentStateName).includes(
            normalizeForSearch(inputValue)
          ) &&
          !normalizeForSearch(currentStateUf).includes(
            normalizeForSearch(inputValue)
          )
        ) {
          console.log(`🗑️ Limpando estado - valor não encontrado: ${value}`);
          setSelectedState(null);
        }
      }
    } else if (value.length === 0) {
      // Se o campo foi limpo, resetar tudo
      console.log("🗑️ Limpando todos os campos - campo vazio");
      setSelectedState(null);
      setSelectedCity(null);
      setCityQuery("");
    }
  };

  // Funções para autocomplete de cidades
  const handleCityChange = (value: string) => {
    setCityQuery(value);

    // Buscar cidade correspondente
    if (selectedState && value.length > 0) {
      const matchedCities = searchCities(value);
      const exactMatch = matchedCities.find(
        (city) => normalizeForSearch(city.name) === normalizeForSearch(value)
      );

      if (exactMatch && exactMatch !== selectedCity) {
        setSelectedCity(exactMatch);
      } else if (!exactMatch) {
        // Não limpar o selectedCity se o usuário ainda está digitando
        const currentCityName = selectedCity?.name || "";
        const inputValue = value;

        if (
          !normalizeForSearch(currentCityName).includes(
            normalizeForSearch(inputValue)
          )
        ) {
          setSelectedCity(null);
        }
      }
    } else if (value.length === 0) {
      // Se o campo foi limpo, resetar cidade
      setSelectedCity(null);
    }
  };

  // Obter opções filtradas para o FormAutocomplete
  const getStateOptions = () => {
    if (debouncedStateQuery.length > 0) {
      return searchStates(debouncedStateQuery).map((state) => ({
        value: `${state.name} (${state.uf})`,
        label: `${state.name} (${state.uf})`,
      }));
    }
    return [];
  };

  const getCityOptions = () => {
    if (selectedState && debouncedCityQuery.length > 0) {
      const filteredCities = searchCities(debouncedCityQuery);
      console.log(
        `🔍 Buscando cidades para "${debouncedCityQuery}" no estado ${selectedState.name}:`,
        filteredCities
      );
      return filteredCities.map((city) => ({
        value: city.name,
        label: city.name,
      }));
    }
    return [];
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validações básicas
      if (!medico.name.trim()) {
        throw new Error("Nome é obrigatório");
      }
      if (!medico.cpf.trim()) {
        throw new Error("CPF é obrigatório");
      }
      if (!medico.documentDoctorType.trim()) {
        throw new Error("Tipo de documento é obrigatório");
      }
      if (!medico.documentDoctorNumber.trim()) {
        throw new Error("Número do documento é obrigatório");
      }
      if (!medico.documentDoctorUf.trim()) {
        throw new Error("UF do documento é obrigatória");
      }
      if (!medico.email.trim()) {
        throw new Error("Email é obrigatório");
      }
      if (!userPassword) {
        throw new Error("Senha é obrigatória");
      }
      if (userPassword !== userPasswordConfirm) {
        throw new Error("As senhas não coincidem");
      }
      if (!selectedState) {
        throw new Error("Estado é obrigatório");
      }
      if (!selectedCity) {
        throw new Error("Cidade é obrigatória");
      }

      // Mock de fluxo de cadastro: User -> Address -> Doctor
      // Preparar payload no formato correto
      const payload = {
        address: {
          street: address.street,
          number: parseInt(address.number) || 0,
          complement: address.complement || null,
          neighborhood: address.neighborhood,
          cityId: selectedCity?.id || null,
          stateId: selectedState?.id || null,
          zipCode: address.zip_code,
        },
        doctor: {
          personal_information: {
            name: medico.name,
            cpf: parseInt(medico.cpf.replace(/\D/g, "")) || 0, // Remove caracteres não numéricos
            email: medico.email,
            documentDoctorType: medico.documentDoctorType,
            documentDoctorNumber: medico.documentDoctorNumber,
            documentDoctorUf: medico.documentDoctorUf,
            phone: medico.phone || null,
            observations: medico.observations || null,
            status: medico.status,
          },
        },
        user: {
          email: medico.email,
          password: userPassword,
        },
      };

      console.log("Payload para cadastro:", payload);
      // await fetch('/api/doctors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push("/admin/medicos");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Erro ao cadastrar médico"
      );
    } finally {
      setSaving(false);
    }
  };

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
                Cadastrar Médico
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
              {/* Primeira linha: Nome, CPF, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Nome Completo"
                  type="text"
                  value={medico.name}
                  onChange={(e) => handleMedicoChange("name", e.target.value)}
                  placeholder="Digite o nome completo"
                  required
                />
                <FormInput
                  label="CPF"
                  type="text"
                  value={medico.cpf}
                  onChange={(e) => handleMedicoChange("cpf", e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
                <FormSelect
                  label="Status"
                  value={medico.status}
                  onChange={(e) =>
                    handleMedicoChange(
                      "status",
                      e.target.value as "ACTIVE" | "INACTIVE"
                    )
                  }
                  required
                  options={[
                    { value: "ACTIVE", label: "Ativo" },
                    { value: "INACTIVE", label: "Inativo" },
                  ]}
                />
              </div>
              {/* Segunda linha: Tipo de Documento, UF do Documento, Número do Documento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormSelect
                  label="Tipo de Documento"
                  value={medico.documentDoctorType}
                  onChange={(e) =>
                    handleMedicoChange("documentDoctorType", e.target.value)
                  }
                  required
                  placeholder="Selecione..."
                  options={[
                    { value: "CRM", label: "CRM" },
                    { value: "CRMV", label: "CRMV" },
                  ]}
                />
                <FormAutocomplete
                  label="UF do Documento"
                  value={medico.documentDoctorUf}
                  onChange={(value) =>
                    handleMedicoChange("documentDoctorUf", value)
                  }
                  placeholder="Digite ou selecione a UF..."
                  required
                  options={[
                    { value: "AC", label: "Acre" },
                    { value: "AL", label: "Alagoas" },
                    { value: "AP", label: "Amapá" },
                    { value: "AM", label: "Amazonas" },
                    { value: "BA", label: "Bahia" },
                    { value: "CE", label: "Ceará" },
                    { value: "DF", label: "Distrito Federal" },
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
                  label="Número do Documento"
                  type="text"
                  value={medico.documentDoctorNumber}
                  onChange={(e) =>
                    handleMedicoChange("documentDoctorNumber", e.target.value)
                  }
                  placeholder="Número do CRM/CRMV"
                  required
                  autoComplete="off"
                />
              </div>
              {/* Terceira linha: Email, Telefone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Email"
                  type="email"
                  value={medico.email}
                  onChange={(e) => handleMedicoChange("email", e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
                <FormInput
                  label="Telefone"
                  type="tel"
                  value={medico.phone}
                  onChange={(e) => handleMedicoChange("phone", e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
              {/* Observações */}
              <div>
                <FormTextarea
                  label="Observações"
                  value={medico.observations}
                  onChange={(e) =>
                    handleMedicoChange("observations", e.target.value)
                  }
                  rows={3}
                  placeholder="Observações sobre o médico..."
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
                    autoComplete="off"
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
                    autoComplete="street-address"
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
                    autoComplete="off"
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
                  autoComplete="off"
                />
                <FormInput
                  label="Bairro"
                  type="text"
                  value={address.neighborhood}
                  onChange={(e) =>
                    handleAddressChange("neighborhood", e.target.value)
                  }
                  placeholder="Nome do bairro"
                  autoComplete="off"
                />
                <FormAutocomplete
                  label="Estado"
                  value={stateQuery}
                  onChange={handleStateChange}
                  placeholder="Digite para buscar estados..."
                  options={getStateOptions()}
                  disabled={statesLoading}
                  helperText={statesError ? statesError : undefined}
                  error={statesError ? statesError : undefined}
                  required
                />
                <FormAutocomplete
                  label="Cidade"
                  value={cityQuery}
                  onChange={handleCityChange}
                  placeholder={
                    selectedState
                      ? "Digite para buscar cidades..."
                      : "Selecione um estado primeiro"
                  }
                  options={getCityOptions()}
                  disabled={!selectedState || citiesLoading}
                  helperText={
                    citiesError
                      ? citiesError
                      : !selectedState
                      ? "Selecione um estado primeiro"
                      : undefined
                  }
                  error={citiesError ? citiesError : undefined}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        {/* Bloco de Informações do Usuário */}
        <div className="space-y-6 h-full">
          <div className="bg-white rounded-lg shadow-sm border p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaKey className="w-5 h-5 mr-2 text-[#16829E]" />
              Informações do Usuário
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Senha"
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Digite a senha"
                required
              />
              <FormInput
                label="Confirmação de Senha"
                type="password"
                value={userPasswordConfirm}
                onChange={(e) => setUserPasswordConfirm(e.target.value)}
                placeholder="Confirme a senha"
                required
              />
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
            {saving ? "Cadastrando..." : "Cadastrar Médico"}
          </Button>
          <Button
            onClick={() => router.push("/admin/medicos")}
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
