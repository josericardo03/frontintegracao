import { ApiResponse } from "../../types/api";

interface SocioDetailsProps {
  apiResponse: ApiResponse;
}

export function SocioDetails({ apiResponse }: SocioDetailsProps) {
  if (!apiResponse?.data?.resultados?.socios?.length) {
    return null;
  }

  const socios = apiResponse.data.resultados.socios;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Detalhes dos Sócios
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {socios.map((socio, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">Nome:</span>
                <span className="ml-2 text-gray-700">
                  {socio.responseData.nomePessoa}
                </span>
              </div>
              <div>
                <span className="text-gray-500">CPF:</span>
                <span className="ml-2 text-gray-700">
                  {socio.responseData.numeroCicSocio}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Participação:</span>
                <span className="ml-2 text-gray-700">
                  {socio.responseData.percentualParticipacaoCapitalTotal}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">Representante Legal:</span>
                <span className="ml-2 text-gray-700">
                  {socio.responseData.representanteLegal ? "Sim" : "Não"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Data de Entrada:</span>
                <span className="ml-2 text-gray-700">
                  {new Date(socio.responseData.dataEntrada).toLocaleDateString(
                    "pt-BR"
                  )}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Qualificação:</span>
                <span className="ml-2 text-gray-700">
                  {socio.responseData.qualificacao}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
