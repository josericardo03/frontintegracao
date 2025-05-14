import { ApiResponse } from "@/types/api";

interface ErrosEncontradosProps {
  apiResponse: ApiResponse;
}

export function ErrosEncontrados({ apiResponse }: ErrosEncontradosProps) {
  // Função para extrair mensagens de erro de forma segura
  const extrairErros = () => {
    const erros: string[] = [];

    // Verifica se há erro geral na resposta
    if (!apiResponse.success) {
      erros.push(apiResponse.message || "Erro desconhecido");
    }

    // Verifica erros nos resultados
    if (apiResponse.data?.resultados) {
      Object.entries(apiResponse.data.resultados).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item: any) => {
            if (!item.sucesso && item.mensagem) {
              erros.push(`Erro em ${key}: ${item.mensagem}`);
            }
          });
        }
      });
    }

    return erros;
  };

  const erros = extrairErros();

  // Se não houver erros, não renderiza nada
  if (erros.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-red-800 mb-2">
        Erros Encontrados
      </h2>
      <ul className="space-y-2">
        {erros.map((erro, index) => (
          <li key={index} className="text-sm text-red-700">
            • {typeof erro === "string" ? erro : "Erro desconhecido"}
          </li>
        ))}
      </ul>
    </div>
  );
}
