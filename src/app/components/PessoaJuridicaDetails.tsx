import { ApiResponse } from "../../types/api";

interface PessoaJuridicaDetailsProps {
  apiResponse: ApiResponse;
}

export function PessoaJuridicaDetails({
  apiResponse,
}: PessoaJuridicaDetailsProps) {
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

  if (!apiResponse?.data?.resultados?.pessoaAtualizada?.[0]) {
    return null;
  }

  const pessoa = apiResponse.data.resultados.pessoaAtualizada[0].responseData;
  const endereco = apiResponse.data.resultados.endereco?.[0]?.responseData;
  const enderecoCorrespondencia =
    apiResponse.data.resultados.enderecoPessoal?.[0]?.responseData;
  const contatos = apiResponse.data.resultados.contatos || [];
  const socios = apiResponse.data.resultados.socios || [];
  const ramo = apiResponse.data.resultados.ramo?.[0]?.responseData;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      {/* Cabeçalho */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {pessoa.nomePessoa}
        </h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <span className="text-gray-500">CNPJ:</span>
            <span className="ml-2 text-gray-700">{pessoa.numeroCic}</span>
          </div>
          <div>
            <span className="text-gray-500">Código Cliente:</span>
            <span className="ml-2 text-gray-700">{pessoa.codigoCliente}</span>
          </div>
        </div>
      </div>

      {/* Grid de informações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações da Empresa */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Informações da Empresa
          </h3>
          <div className="bg-gray-50 rounded p-4 space-y-2">
            <div>
              <span className="text-gray-500">Cliente Desde:</span>
              <span className="ml-2 text-gray-700">
                {new Date(pessoa.dataClienteDesde).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Renovação Cadastral:</span>
              <span className="ml-2 text-gray-700">
                {new Date(pessoa.dataRenovacaoCadastral).toLocaleDateString(
                  "pt-BR"
                )}
              </span>
            </div>
            {ramo && (
              <div>
                <span className="text-gray-500">Ramo de Atividade:</span>
                <span className="ml-2 text-gray-700">
                  {ramo.siglaAtividade}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Endereço */}
        {endereco && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Endereço Comercial
            </h3>
            <div className="bg-gray-50 rounded p-4 space-y-2">
              <div>
                <span className="text-gray-500">Logradouro:</span>
                <span className="ml-2 text-gray-700">
                  {endereco.siglaTipoLogradouro} {endereco.nomeLogradouro},{" "}
                  {endereco.numeroEndereco}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Bairro:</span>
                <span className="ml-2 text-gray-700">
                  {endereco.nomeBairro}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Cidade/UF:</span>
                <span className="ml-2 text-gray-700">
                  {endereco.nomeCidade}/{endereco.siglaUf}
                </span>
              </div>
              <div>
                <span className="text-gray-500">CEP:</span>
                <span className="ml-2 text-gray-700">{endereco.codigoCep}</span>
              </div>
              <div>
                <span className="text-gray-500">Telefone:</span>
                <span className="ml-2 text-gray-700">
                  ({endereco.numeroDdd}) {endereco.numeroTelefone}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contatos */}
      {contatos.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Contatos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contatos.map((contato, index) => (
              <div key={index} className="bg-gray-50 rounded p-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  {contato.responseData.codigoTipoContato === "EML"
                    ? "E-mail"
                    : "Telefone"}
                </h4>
                <p className="text-sm text-gray-600">
                  {contato.responseData.codigoTipoContato === "EML"
                    ? contato.responseData.descricaoEmail
                    : contato.responseData.telefoneCompletoDescription}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sócios */}
      {socios.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Sócios</h3>
          <div className="grid grid-cols-1 gap-4">
            {socios.map((socio, index) => (
              <div key={index} className="bg-gray-50 rounded p-4">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informações Adicionais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="text-center p-3 bg-blue-50 rounded">
          <span className="text-sm text-gray-500 block">Segmento</span>
          <span className="font-medium text-blue-600">{pessoa.segmento}</span>
        </div>
        <div className="text-center p-3 bg-green-50 rounded">
          <span className="text-sm text-gray-500 block">
            Nível de Relacionamento
          </span>
          <span className="font-medium text-green-600">
            {pessoa.indicadorNivelRelacionamento ? "Sim" : "Não"}
          </span>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded">
          <span className="text-sm text-gray-500 block">Isenção IOF</span>
          <span className="font-medium text-purple-600">
            {pessoa.indicadorIsencaoIof ? "Sim" : "Não"}
          </span>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded">
          <span className="text-sm text-gray-500 block">Isenção IRF</span>
          <span className="font-medium text-orange-600">
            {pessoa.indicadorIsencaoIrf ? "Sim" : "Não"}
          </span>
        </div>
      </div>
    </div>
  );
}
