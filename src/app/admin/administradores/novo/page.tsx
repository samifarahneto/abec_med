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
  FaUserShield,
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
  cityId?: number;
  stateId?: number;
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

      // Mock de salvamento - substituir por chamada real da API
      console.log("Cadastrando administrador:", {
        administrador,
        address: {
          ...address,
          stateId: selectedState.id,
          cityId: selectedCity.id,
        },
        userPassword,
      });

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
                  autoComplete="email"
                  name="email"
                />
                <FormInput
                  label="Telefone"
                  type="tel"
                  value={administrador.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="(00) 00000-0000"
                  autoComplete="tel"
                  name="phone"
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
                    autoComplete="postal-code"
                    name="zip_code"
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
                    name="street"
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
                    name="number"
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
                  name="complement"
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
                  name="neighborhood"
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
                autoComplete="new-password"
                name="password"
              />
              <FormInput
                label="Confirmação de Senha"
                type="password"
                value={userPasswordConfirm}
                onChange={(e) => setUserPasswordConfirm(e.target.value)}
                placeholder="Confirme a senha"
                required
                autoComplete="new-password"
                name="password-confirm"
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
