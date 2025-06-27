import { ApiResponse, SearchParams } from "../../types/api";
import axios from "axios";
import Cookies from "js-cookie";

// Utilize a variável de ambiente se disponível, caso contrário use o IP local
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.10.88:4001";

// Configuração global do axios
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

// Interceptor para log de requisições
apiClient.interceptors.request.use(
  (config) => {
    // Adiciona o username do cookie nos headers
    const userName =
      Cookies.get("username") || Cookies.get("displayName") || "Usuario";
    if (config.headers) {
      config.headers["x-user-name"] = userName;
    }

    console.log("Enviando requisição:", {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      data: config.data,
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", {
      message: error.message,
      code: error.code,
      config: error.config,
    });
    return Promise.reject(error);
  }
);

// Interceptor para log de respostas
apiClient.interceptors.response.use(
  (response) => {
    console.log("Resposta recebida:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Timeout na requisição:", {
        url: error.config?.url,
        timeout: error.config?.timeout,
      });
    } else if (error.code === "ERR_NETWORK") {
      console.error("Erro de rede:", {
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    } else {
      console.error("Erro na resposta:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code,
      });
    }
    return Promise.reject(error);
  }
);

export const api = {
  searchPessoaJuridica: async ({ documento, status }: SearchParams) => {
    try {
      const response = await apiClient.get("/enviar-dados-producao", {
        params: {
          cnpj: documento,
          status: status?.toLowerCase(),
        },
      });

      if (!response.data) {
        throw new Error("Resposta vazia do servidor");
      }

      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error("Erro na resposta do servidor:", {
          status: error.response.status,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error("Sem resposta do servidor:", {
          message: error.message,
          url: error.config?.url,
        });
      } else {
        console.error("Erro ao configurar a requisição:", error.message);
      }
      throw error;
    }
  },

  searchPessoaFisica: async ({ documento, status }: SearchParams) => {
    try {
      const response = await apiClient.get("/enviar-dados-fisicos-producao", {
        params: {
          cpf: documento,
          status: status?.toLowerCase(),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro na busca de pessoa física:", error);
      throw error;
    }
  },

  searchSocios: async ({ documento, status }: SearchParams) => {
    try {
      const response = await apiClient.get("/cadastroSocios-producao", {
        params: {
          nome: documento,
          status: status?.toLowerCase(),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro na busca de sócios:", error);
      throw error;
    }
  },

  enviarDados: async (dados: SearchParams) => {
    try {
      const response = await apiClient.post("/enviar-dados-producao", dados);
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      throw error;
    }
  },

  atualizarDados: async (dados: SearchParams) => {
    try {
      const response = await apiClient.post("/atualizar-dados-producao", dados);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      throw error;
    }
  },
};
