"use client";

import { useState } from "react";
import { FaUser, FaLock, FaBell } from "react-icons/fa";
import MainLayout from "@/components/MainLayout";
import { Input } from "@/components/ui";

export default function Perfil() {
  const [usuario, setUsuario] = useState({
    nome: "Dr. João Silva",
    email: "joao.silva@clinica.com",
    telefone: "(11) 99999-9999",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
    cargo: "Médico",
    especialidade: "Cardiologia",
    crm: "12345-SP",
  });

  const [notificacoes, setNotificacoes] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const [senha, setSenha] = useState({
    atual: "",
    nova: "",
    confirmacao: "",
  });

  const handleSalvarPerfil = () => {
    // Implementar lógica de salvamento
    console.log("Salvando perfil:", usuario);
  };

  const handleAlterarSenha = () => {
    // Implementar lógica de alteração de senha
    console.log("Alterando senha:", senha);
  };

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#16829E]">
          Meu Perfil
        </h1>

        {/* Informações Pessoais */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-[#16829E]" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Informações Pessoais
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Input
                label="Nome Completo"
                type="text"
                value={usuario.nome}
                onChange={(e) =>
                  setUsuario({ ...usuario, nome: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                label="Email"
                type="email"
                value={usuario.email}
                onChange={(e) =>
                  setUsuario({ ...usuario, email: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                label="Telefone"
                type="tel"
                value={usuario.telefone}
                onChange={(e) =>
                  setUsuario({ ...usuario, telefone: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                label="Endereço"
                type="text"
                value={usuario.endereco}
                onChange={(e) =>
                  setUsuario({ ...usuario, endereco: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                label="CRM"
                type="text"
                value={usuario.crm}
                onChange={(e) =>
                  setUsuario({ ...usuario, crm: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                label="Especialidade"
                type="text"
                value={usuario.especialidade}
                onChange={(e) =>
                  setUsuario({ ...usuario, especialidade: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mt-4 sm:mt-6">
            <button
              onClick={handleSalvarPerfil}
              className="w-full sm:w-auto bg-[#16829E] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-[#126a7e] transition-colors text-sm sm:text-base font-medium"
            >
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* Notificações */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <FaBell className="w-4 h-4 sm:w-5 sm:h-5 text-[#16829E]" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Preferências de Notificação
            </h2>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                  Notificações por Email
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Receba atualizações por email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificacoes.email}
                  onChange={(e) =>
                    setNotificacoes({
                      ...notificacoes,
                      email: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16829E] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16829E]"></div>
              </label>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                  Notificações Push
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Receba notificações no navegador
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificacoes.push}
                  onChange={(e) =>
                    setNotificacoes({ ...notificacoes, push: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16829E] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16829E]"></div>
              </label>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                  Notificações SMS
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Receba mensagens de texto
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificacoes.sms}
                  onChange={(e) =>
                    setNotificacoes({ ...notificacoes, sms: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#16829E] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16829E]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Alteração de Senha */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <FaLock className="w-4 h-4 sm:w-5 sm:h-5 text-[#16829E]" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Alterar Senha
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <Input
                label="Senha Atual"
                type="password"
                value={senha.atual}
                onChange={(e) => setSenha({ ...senha, atual: e.target.value })}
              />
            </div>
            <div>
              <Input
                label="Nova Senha"
                type="password"
                value={senha.nova}
                onChange={(e) => setSenha({ ...senha, nova: e.target.value })}
              />
            </div>
            <div>
              <Input
                label="Confirme a Nova Senha"
                type="password"
                value={senha.confirmacao}
                onChange={(e) =>
                  setSenha({ ...senha, confirmacao: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mt-4 sm:mt-6">
            <button
              onClick={handleAlterarSenha}
              className="w-full sm:w-auto bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base font-medium"
            >
              Alterar Senha
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
