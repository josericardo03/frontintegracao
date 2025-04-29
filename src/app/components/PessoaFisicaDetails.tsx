import { ApiResponse } from "../../types/api";

interface PessoaFisicaDetailsProps {
  apiResponse: ApiResponse;
}

export function PessoaFisicaDetails({ apiResponse }: PessoaFisicaDetailsProps) {
  // Se não houver sucesso e a mensagem for de nenhum registro, mostra mensagem amigável
  if (
    !apiResponse.success &&
    apiResponse.message === "Nenhum registro encontrado"
  ) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-md">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Nenhum Registro Encontrado
        </h2>
        <p className="text-gray-600">
          Não foram encontrados dados para esta pesquisa.
        </p>
      </div>
    );
  }

  if (!apiResponse?.data?.resultados?.pessoa?.[0]) {
    return null;
  }

  const pessoa = apiResponse.data.resultados.pessoa[0].responseData;
  const endereco = apiResponse.data.resultados.endereco?.[0]?.responseData;
  const enderecoPessoal =
    apiResponse.data.resultados.enderecoPessoal?.[0]?.responseData;
  const mae = apiResponse.data.resultados.mae?.[0]?.responseData;
  const pai = apiResponse.data.resultados.pai?.[0]?.responseData;
  const conjuge = apiResponse.data.resultados.conjuge?.[0]?.responseData;

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md space-y-4">
      {/* Cabeçalho com Informações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-3 rounded-md shadow-sm col-span-3">
          <p className="text-xs text-gray-600">Nome</p>
          <p className="text-base font-semibold text-gray-800">
            {pessoa.nomePessoa}
          </p>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-xs text-gray-600">CPF</p>
          <p className="text-sm text-gray-800">{pessoa.numeroCic}</p>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-xs text-gray-600">Código Cliente</p>
          <p className="text-sm text-gray-800">{pessoa.codigoCliente}</p>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-xs text-gray-600">Localização</p>
          <p className="text-sm text-gray-800">{pessoa.descricaoLocalizacao}</p>
        </div>
      </div>

      {/* Grid com 3 colunas para as principais seções */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Informações Pessoais */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Informações Pessoais
          </h3>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-xs text-gray-600">Cliente Desde</p>
              <p className="text-sm text-gray-800">
                {new Date(pessoa.dataClienteDesde).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-xs text-gray-600">Renovação Cadastral</p>
              <p className="text-sm text-gray-800">
                {new Date(pessoa.dataRenovacaoCadastral).toLocaleDateString(
                  "pt-BR"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Endereço */}
        {endereco && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Endereço
            </h3>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-800">
                {endereco.nomeLogradouro}, {endereco.numeroEndereco}
              </p>
              <p className="text-xs text-gray-600">
                {endereco.nomeBairro} - {endereco.nomeCidade}/{endereco.siglaUf}
              </p>
              <p className="text-xs text-gray-600">CEP: {endereco.codigoCep}</p>
              <p className="text-xs text-gray-600">
                Tel: ({endereco.numeroDdd}) {endereco.numeroTelefone}
              </p>
            </div>
          </div>
        )}

        {/* Informações Familiares */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Informações Familiares
          </h3>
          <div className="space-y-2">
            {mae && (
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-xs text-gray-600">Mãe</p>
                <p className="text-sm text-gray-800">{mae.nomeParente}</p>
              </div>
            )}
            {pai && (
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-xs text-gray-600">Pai</p>
                <p className="text-sm text-gray-800">{pai.nomeParente}</p>
              </div>
            )}
            {conjuge && (
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-xs text-gray-600">Cônjuge</p>
                <p className="text-sm text-gray-800">{conjuge.nomeParente}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informações Adicionais em grid de 4 colunas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Informações Adicionais
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Segmento</p>
            <p className="text-sm text-gray-800">{pessoa.segmento}</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Nível de Relacionamento</p>
            <p className="text-sm text-gray-800">
              {pessoa.indicadorNivelRelacionamento ? "Sim" : "Não"}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Isenção IOF</p>
            <p className="text-sm text-gray-800">
              {pessoa.indicadorIsencaoIof ? "Sim" : "Não"}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Isenção IRF</p>
            <p className="text-sm text-gray-800">
              {pessoa.indicadorIsencaoIrf ? "Sim" : "Não"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
