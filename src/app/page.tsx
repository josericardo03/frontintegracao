"use client";
import { useState } from "react";
import Image from "next/image";
import { FaSearch, FaBars } from "react-icons/fa";
import logo from "../assets/logobranca 1.png";
import { api } from "./services/api";
import { ApiResponse, SearchParams } from "../types/api";
import { PessoaFisicaDetails } from "./components/PessoaFisicaDetails";
import { PessoaJuridicaDetails } from "./components/PessoaJuridicaDetails";
import { SocioDetails } from "./components/SocioDetails";
import { ResumoOperacao } from "./components/ResumoOperacao";
import { ErrosEncontrados } from "./components/ErrosEncontrados";

interface TableItem {
  label: string;
  message: string;
}

interface RouteData {
  [key: string]: TableItem[];
}

/**
 * Exemplo de uso:
 * 1. Selecione "Pessoa Jurídica" no menu suspenso
 * 2. Digite um CNPJ no campo de busca (ex: 12345678000190)
 * 3. (Opcional) Selecione um status (ex: "deferido")
 * 4. Clique em "Buscar"
 *
 * O sistema retornará:
 * - Total de registros processados
 * - CNPJs enviados
 * - CNPJs atualizados
 * - Detalhes do resultado com status e mensagens
 */
export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [selectedRoute, setSelectedRoute] =
    useState<keyof RouteData>("default");
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<RouteData>({
    default: [
      { label: "Status", message: "Aguardando busca..." },
      { label: "Registros Processados", message: "0" },
      { label: "CNPJs/CPFs Enviados", message: "0" },
      { label: "CNPJs/CPFs Atualizados", message: "0" },
      { label: "Erros", message: "0" },
    ],
    pessoaFisica: [
      { label: "Status", message: "Aguardando busca..." },
      { label: "Registros Processados", message: "0" },
      { label: "CPFs Enviados", message: "0" },
      { label: "CPFs Atualizados", message: "0" },
      { label: "Erros", message: "0" },
    ],
    pessoaJuridica: [
      { label: "Status", message: "Aguardando busca..." },
      { label: "Registros Processados", message: "0" },
      { label: "CNPJs Enviados", message: "0" },
      { label: "CNPJs Atualizados", message: "0" },
      { label: "Erros", message: "0" },
    ],
    socio: [
      { label: "Status", message: "Aguardando busca..." },
      { label: "Registros Processados", message: "0" },
      { label: "Documentos Enviados", message: "0" },
      { label: "Documentos Atualizados", message: "0" },
      { label: "Erros", message: "0" },
    ],
  });

  const [searchParams, setSearchParams] = useState<SearchParams>({
    documento: "",
    status: "",
  });

  const handleSearch = async () => {
    if (selectedRoute === "default") {
      setError("Por favor, selecione um tipo de busca");
      return;
    }

    if (!search && selectedRoute !== "default") {
      setError("Por favor, insira um documento para buscar");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response: ApiResponse;
      const searchParams = {
        documento: search,
        ...(status && { status: status.toLowerCase() }),
      };

      switch (selectedRoute) {
        case "pessoaFisica":
          response = await api.searchPessoaFisica(searchParams);
          break;
        case "pessoaJuridica":
          response = await api.searchPessoaJuridica(searchParams);
          break;
        case "socio":
          response = await api.searchSocios(searchParams);
          break;
        default:
          throw new Error("Selecione uma rota válida");
      }

      // Verifica se é uma mensagem de documento já existente
      const isDocumentoExistente = response.message
        .toLowerCase()
        .includes("já existe");

      if (isDocumentoExistente) {
        setError(response.message);
        const newData = [...routeData[selectedRoute]];
        newData[0].message = "Documento já cadastrado";
        newData[1].message = "0";
        newData[2].message = "0";
        newData[3].message = "0";
        newData[4].message = "0";

        setRouteData((prev) => ({
          ...prev,
          [selectedRoute]: newData,
        }));
      } else {
        setApiResponse(response);
        updateTableData(response);
      }
    } catch (err: any) {
      console.error("Erro na busca:", err);

      // Se for erro 404, trata como "Nenhum registro encontrado"
      if (err.response?.status === 404) {
        const notFoundResponse: ApiResponse = {
          success: false,
          message: "Nenhum registro encontrado",
        };
        setApiResponse(notFoundResponse);
        setError(null); // Remove a mensagem de erro
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : "Erro ao processar a requisição";
      setError(errorMessage);

      // Atualiza a tabela com valores zerados em caso de erro
      const newData = [...routeData[selectedRoute]];
      newData[0].message = "Erro";
      newData[1].message = "0";
      newData[2].message = "0";
      newData[3].message = "0";
      newData[4].message = "0";

      setRouteData((prev) => ({
        ...prev,
        [selectedRoute]: newData,
      }));
    } finally {
      setLoading(false);
    }
  };

  const updateTableData = (response: ApiResponse) => {
    const newData = [...routeData[selectedRoute]];

    // Verifica se há erros nos resultados
    const errosOperacoes = response.data?.resultados
      ? Object.values(response.data.resultados)
          .flat()
          .filter((op) => !op?.sucesso).length
      : 0;

    const errosGerais = response.data?.erros?.length || 0;
    const totalErros = errosOperacoes + errosGerais;

    newData[0].message = response.success ? "Sucesso" : "Erro";
    newData[1].message = String(response.data?.registrosProcessados || 0);
    newData[2].message = String(response.data?.cnpjEnviados?.length || 0);
    newData[3].message = String(response.data?.cnpjAtualizados?.length || 0);
    newData[4].message = String(totalErros);

    setRouteData((prev) => ({
      ...prev,
      [selectedRoute]: newData,
    }));
  };

  const handleRouteSelect = (route: keyof RouteData) => {
    setSelectedRoute(route);
    setShowMenu(false);
    setApiResponse(null);
    setError(null);
  };

  const handleEnviarDados = async () => {
    try {
      setLoading(true);
      setError(null);

      // Log para debug
      console.log("Iniciando envio de dados:", {
        documento: searchParams?.documento,
        status: searchParams?.status,
      });

      // Primeiro tenta enviar os dados
      const response = await api.enviarDados({
        documento: searchParams?.documento || "",
        status: searchParams?.status || "",
      });

      // Log da resposta
      console.log("Resposta da API:", response);

      if (response.success) {
        setApiResponse(response);
        setError(null);
      } else {
        // Se falhar no envio, tenta atualizar
        console.log("Falha no envio, tentando atualizar...");
        const updateResponse = await api.atualizarDados({
          documento: searchParams?.documento || "",
          status: searchParams?.status || "",
        });

        // Log da resposta da atualização
        console.log("Resposta da atualização:", updateResponse);

        if (updateResponse.success) {
          setApiResponse(updateResponse);
          setError(null);
        } else {
          setError(updateResponse.message || "Erro ao processar requisição");
          setApiResponse(null);
        }
      }
    } catch (err) {
      // Log do erro
      console.error("Erro ao processar requisição:", err);
      setError(
        "Erro ao processar requisição. Verifique o console para mais detalhes."
      );
      setApiResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#273C65] text-white flex flex-col items-center p-8">
      {/* Logo */}
      <div className="mb-10">
        <Image
          src={logo}
          alt="Logo"
          width={200}
          height={60}
          className="mx-auto"
        />
      </div>

      {/* Container Principal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-8">
        {/* Barra de Pesquisa e Filtros */}
        <div className="flex items-center space-x-4 mb-8">
          {/* Campo de Busca */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Digite o documento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-700 text-sm"
            />
          </div>

          {/* Dropdown Status */}
          <div className="relative min-w-[150px]">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-12 px-4 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-700 appearance-none cursor-pointer text-sm"
            >
              <option value="">Sem Status</option>
              <option value="deferido">Deferido</option>
              <option value="pendente">Pendente</option>
              <option value="indeferido">Indeferido</option>
              <option value="em_analise">Em Análise</option>
              <option value="desistente">Desistente</option>
              <option value="pendencias-analise">Pendências Análise</option>
              <option value="garantias">Garantias</option>
              <option value="vencida">Vencida</option>
              <option value="proposta_inicial">Proposta Inicial</option>
              <option value="aguardando_documentacao">
                Aguardando Documentação
              </option>
              <option value="favoravel_media_e_grande_empresa">
                Favorável Média e Grande
              </option>
              <option value="indeferido-gerente">Indeferido Gerente</option>
            </select>
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              ▼
            </span>
          </div>

          {/* Botões */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                className="h-12 px-6 rounded-full border-2 border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-gray-700"
                onClick={() => setShowMenu(!showMenu)}
              >
                <FaBars className="text-gray-400" />
                <span className="text-sm">
                  {selectedRoute === "default"
                    ? "Tipo de Busca"
                    : selectedRoute === "pessoaFisica"
                    ? "Pessoa Física"
                    : selectedRoute === "pessoaJuridica"
                    ? "Pessoa Jurídica"
                    : "Sócio"}
                </span>
              </button>

              {/* Menu Suspenso */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10">
                  <ul className="text-sm text-gray-700">
                    <li
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRouteSelect("pessoaFisica")}
                    >
                      Pessoa Física
                    </li>
                    <li
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRouteSelect("pessoaJuridica")}
                    >
                      Pessoa Jurídica
                    </li>
                    <li
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRouteSelect("socio")}
                    >
                      Sócio
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors text-sm disabled:bg-blue-300"
            >
              {loading ? "Processando..." : "Buscar"}
            </button>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Erro:</p>
            <p>{error}</p>
            <p className="text-sm mt-2">
              Verifique o console do navegador para mais detalhes.
            </p>
          </div>
        )}

        {/* Tipo de Busca Selecionado */}
        <div className="mb-4">
          <span className="text-gray-600 text-sm">
            Tipo de busca selecionado:{" "}
            {selectedRoute === "default" ? "Nenhum" : selectedRoute}
          </span>
        </div>

        {/* Conteúdo Principal */}
        {selectedRoute === "pessoaFisica" && !error && apiResponse && (
          <PessoaFisicaDetails apiResponse={apiResponse} />
        )}
        {selectedRoute === "pessoaJuridica" && !error && apiResponse && (
          <PessoaJuridicaDetails apiResponse={apiResponse} />
        )}
        {selectedRoute === "socio" && !error && apiResponse && (
          <SocioDetails apiResponse={apiResponse} />
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <p className="text-gray-700">Processando sua solicitação...</p>
            </div>
          </div>
        )}

        {apiResponse && (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResumoOperacao apiResponse={apiResponse} />
              <ErrosEncontrados apiResponse={apiResponse} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
