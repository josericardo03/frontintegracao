import { ApiResponse } from "../../types/api";

interface ErrosEncontradosProps {
  apiResponse: ApiResponse;
}

export function ErrosEncontrados({ apiResponse }: ErrosEncontradosProps) {
  // Função para extrair erros de forma segura
  const getErros = () => {
    const erros: { documento: string; mensagem: string }[] = [];

    // Erros gerais da API
    if (apiResponse.data?.erros) {
      apiResponse.data.erros.forEach((erro) => {
        erros.push({
          documento: erro.cnpj,
          mensagem: erro.erro,
        });
      });
    }

    // Erros nos resultados
    if (apiResponse.data?.resultados) {
      Object.entries(apiResponse.data.resultados).forEach(
        ([tipo, operacoes]) => {
          if (Array.isArray(operacoes)) {
            operacoes.forEach((op) => {
              if (!op?.sucesso) {
                erros.push({
                  documento: op.cnpj || op.cpf || "Documento não especificado",
                  mensagem: op.mensagem || "Erro não especificado",
                });
              }
            });
          }
        }
      );
    }

    return erros;
  };

  const erros = getErros();

  if (erros.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 p-4 rounded-lg shadow">
      <h4 className="font-medium mb-2 text-red-600">Erros Encontrados</h4>
      <div className="space-y-2">
        {erros.map((erro, index) => (
          <div key={index} className="border-b border-red-200 pb-2">
            <p className="text-red-600">Documento: {erro.documento}</p>
            <p className="text-red-600">Mensagem: {erro.mensagem}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
