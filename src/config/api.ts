// Configurações da API Externa - ABEC Med
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://abecmed-api.22aczq.easypanel.host",
  ENDPOINTS: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/me",
    VALIDATE_TOKEN: "/auth/validate",
    REFRESH_TOKEN: "/auth/refresh",
    DOCS: "/api-docs",
  },
  ALTERNATIVE_ENDPOINTS: {
    LOGIN: [
      "/auth/login",
      "/api/auth/login",
      "/api/login",
      "/login",
      "/api/user/login",
    ],
    PROFILE: [
      "/api/auth/me",
      "/api/user/me",
      "/api/user/profile",
      "/api/auth/user",
      "/me",
    ],
  },
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
};

// Configurações do Banco de Dados
export const DB_CONFIG = {
  HOST: process.env.DB_HOST || "",
  DATABASE: process.env.DB_NAME || "",
  USERNAME: process.env.DB_USER || "",
  PASSWORD: process.env.DB_PASSWORD || "",
};

// Função para obter a URL completa de um endpoint
export function getApiUrl(endpoint: keyof typeof API_CONFIG.ENDPOINTS): string {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
}

// Função para obter headers padrão
export function getApiHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { ...API_CONFIG.HEADERS };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// Função para testar múltiplos endpoints e encontrar o correto
export async function findWorkingEndpoint(
  endpointType: keyof typeof API_CONFIG.ALTERNATIVE_ENDPOINTS,
  method: string = "GET",
  body?: Record<string, unknown>
): Promise<string | null> {
  const endpoints = API_CONFIG.ALTERNATIVE_ENDPOINTS[endpointType];

  for (const endpoint of endpoints) {
    try {
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      console.log(`Testando endpoint: ${url}`);

      const response = await fetch(url, {
        method,
        headers: getApiHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });

      // Se não for 404, consideramos que o endpoint existe
      if (response.status !== 404) {
        console.log(
          `✅ Endpoint encontrado: ${endpoint} (Status: ${response.status})`
        );
        return endpoint;
      }
    } catch (error) {
      console.log(`❌ Erro ao testar ${endpoint}:`, error);
      continue;
    }
  }

  return null;
}
