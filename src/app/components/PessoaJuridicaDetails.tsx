import React from "react";
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

  // Verifica se existe dados em pessoaAtualizada ou pessoas
  const pessoaAtualizada =
    apiResponse?.data?.resultados?.pessoaAtualizada?.[0]?.responseData;
  const pessoa = apiResponse?.data?.resultados?.pessoa?.[0]?.responseData;

  // Se não houver dados em nenhum dos dois, retorna null
  if (!pessoaAtualizada && !pessoa) {
    return null;
  }

  // Usa os dados de pessoaAtualizada se existirem, caso contrário usa os dados de pessoas
  const dadosPessoa = pessoaAtualizada || pessoa;
  const endereco = apiResponse.data.resultados.endereco?.[0]?.responseData;
  const enderecoCorrespondencia =
    apiResponse.data.resultados.enderecoPessoal?.[0]?.responseData;
  const contatos = apiResponse.data.resultados.contatos || [];
  const socios = apiResponse.data.resultados.socios || [];
  const ramo = apiResponse.data.resultados.ramo?.[0]?.responseData;

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md space-y-4">
      {/* Cabeçalho com Informações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-3 rounded-md shadow-sm col-span-3">
          <p className="text-xs text-gray-600">Nome</p>
          <p className="text-base font-semibold text-gray-800">
            {dadosPessoa.nomePessoa}
          </p>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-xs text-gray-600">CNPJ</p>
          <p className="text-sm text-gray-800">{dadosPessoa.numeroCic}</p>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-xs text-gray-600">Código Cliente</p>
          <p className="text-sm text-gray-800">{dadosPessoa.codigoCliente}</p>
        </div>
        {ramo && (
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Ramo de Atividade</p>
            <p className="text-sm text-gray-800">{ramo.siglaAtividade}</p>
          </div>
        )}
      </div>

      {/* Grid com 3 colunas para as principais seções */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Informações da Empresa */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Informações da Empresa
          </h3>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-xs text-gray-600">Cliente Desde</p>
              <p className="text-sm text-gray-800">
                {new Date(dadosPessoa.dataClienteDesde).toLocaleDateString(
                  "pt-BR"
                )}
              </p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-xs text-gray-600">Renovação Cadastral</p>
              <p className="text-sm text-gray-800">
                {new Date(
                  dadosPessoa.dataRenovacaoCadastral
                ).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>

        {/* Endereço */}
        {endereco && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Endereço Comercial
            </h3>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-sm text-gray-800">
                {endereco.siglaTipoLogradouro} {endereco.nomeLogradouro},{" "}
                {endereco.numeroEndereco}
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

        {/* Contatos */}
        {contatos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Contatos
            </h3>
            <div className="space-y-2">
              {contatos.map(
                (
                  contato: {
                    responseData: {
                      codigoTipoContato: string;
                      descricaoEmail:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactPortal
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      telefoneCompletoDescription:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactPortal
                            | React.ReactElement<
                                unknown,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                    };
                  },
                  index: React.Key | null | undefined
                ) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-md shadow-sm"
                  >
                    <p className="text-xs text-gray-600">
                      {contato.responseData.codigoTipoContato === "EML"
                        ? "E-mail"
                        : "Telefone"}
                    </p>
                    <p className="text-sm text-gray-800">
                      {contato.responseData.codigoTipoContato === "EML"
                        ? contato.responseData.descricaoEmail
                        : contato.responseData.telefoneCompletoDescription}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sócios */}
      {socios.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Sócios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {socios.map(
              (
                socio: {
                  responseData: {
                    nomePessoa:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactPortal
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                    numeroCicSocio:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactPortal
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                    percentualParticipacaoCapitalTotal:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactPortal
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                    representanteLegal: any;
                  };
                },
                index: React.Key | null | undefined
              ) => (
                <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                  <div className="space-y-1">
                    <div>
                      <p className="text-xs text-gray-600">Nome</p>
                      <p className="text-sm text-gray-800">
                        {socio.responseData.nomePessoa}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">CPF</p>
                      <p className="text-sm text-gray-800">
                        {socio.responseData.numeroCicSocio}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Participação</p>
                      <p className="text-sm text-gray-800">
                        {socio.responseData.percentualParticipacaoCapitalTotal}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">
                        Representante Legal
                      </p>
                      <p className="text-sm text-gray-800">
                        {socio.responseData.representanteLegal ? "Sim" : "Não"}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Informações Adicionais em grid de 4 colunas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Informações Adicionais
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Segmento</p>
            <p className="text-sm text-gray-800">{dadosPessoa.segmento}</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Nível de Relacionamento</p>
            <p className="text-sm text-gray-800">
              {dadosPessoa.indicadorNivelRelacionamento ? "Sim" : "Não"}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Isenção IOF</p>
            <p className="text-sm text-gray-800">
              {dadosPessoa.indicadorIsencaoIof ? "Sim" : "Não"}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Isenção IRF</p>
            <p className="text-sm text-gray-800">
              {dadosPessoa.indicadorIsencaoIrf ? "Sim" : "Não"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
