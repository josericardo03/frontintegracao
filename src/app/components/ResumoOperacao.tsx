import { ApiResponse } from "../../types/api";

interface ResumoOperacaoProps {
  apiResponse: ApiResponse;
}

export function ResumoOperacao({ apiResponse }: ResumoOperacaoProps) {
  // Função para extrair dados de forma segura
  const getTotalRegistros = () => {
    if (apiResponse.data?.registrosProcessados) {
      return apiResponse.data.registrosProcessados;
    }
    if (apiResponse.data?.resultados) {
      return Object.keys(apiResponse.data.resultados).length;
    }
    return 0;
  };

  const getTotalEnviados = () => {
    if (apiResponse.data?.cnpjEnviados) {
      return apiResponse.data.cnpjEnviados.length;
    }
    if (apiResponse.data?.cpfEnviados) {
      return apiResponse.data.cpfEnviados.length;
    }
    if (apiResponse.data?.documentosEnviados) {
      return apiResponse.data.documentosEnviados.length;
    }
    return 0;
  };

  const getTotalAtualizados = () => {
    if (apiResponse.data?.cnpjAtualizados) {
      return apiResponse.data.cnpjAtualizados.length;
    }
    if (apiResponse.data?.cpfAtualizados) {
      return apiResponse.data.cpfAtualizados.length;
    }
    if (apiResponse.data?.documentosAtualizados) {
      return apiResponse.data.documentosAtualizados.length;
    }
    return 0;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-medium mb-2 text-gray-600">Resumo da Operação</h4>
      <div className="space-y-2">
        <p className={apiResponse.success ? "text-green-600" : "text-red-600"}>
          Status: {apiResponse.success ? "Sucesso" : "Erro"}
        </p>
        <p className="text-gray-600">Mensagem: {apiResponse.message}</p>
        <p className="text-gray-600">
          Total de Registros: {getTotalRegistros()}
        </p>
        <p className="text-gray-600">
          Documentos Enviados: {getTotalEnviados()}
        </p>
        <p className="text-gray-600">
          Documentos Atualizados: {getTotalAtualizados()}
        </p>
      </div>
    </div>
  );
}
