import { ApiResponse } from "@/types/api";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from "react";

interface SocioDetailsProps {
  apiResponse: ApiResponse;
}

export function SocioDetails({ apiResponse }: SocioDetailsProps) {
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

  const getPessoaData = () => {
    const pessoaAtualizada =
      apiResponse.data?.resultados?.pessoaAtualizada?.[0]?.responseData;
    const pessoa = apiResponse.data?.resultados?.pessoa?.[0]?.responseData;
    return pessoaAtualizada || pessoa;
  };

  const getContatos = () => {
    return apiResponse.data?.resultados?.contatos || [];
  };

  const getEnderecoPessoal = () => {
    return apiResponse.data?.resultados?.enderecoPessoal?.[0]?.responseData;
  };

  const getEnderecoEmpresa = () => {
    return apiResponse.data?.resultados?.enderecoEmpresa?.[0]?.responseData;
  };

  const getFamiliar = (tipo: string) => {
    const familiares =
      apiResponse.data?.resultados?.[tipo.toLowerCase()]?.[0]?.responseData;
    return familiares;
  };

  // Função auxiliar para garantir que o valor seja uma string
  const ensureString = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const pessoaData = getPessoaData();
  const contatos = getContatos();
  const enderecoPessoal = getEnderecoPessoal();
  const enderecoEmpresa = getEnderecoEmpresa();
  const mae = getFamiliar("mae");
  const pai = getFamiliar("pai");
  const conjuge = getFamiliar("conjuge");

  if (!pessoaData) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md space-y-4">
      {/* Informações Pessoais */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Informações Pessoais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Nome</p>
            <p className="text-sm text-gray-800">
              {ensureString(pessoaData.nomePessoa)}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">CPF</p>
            <p className="text-sm text-gray-800">
              {ensureString(pessoaData.numeroCic)}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Código do Cliente</p>
            <p className="text-sm text-gray-800">
              {ensureString(pessoaData.codigoCliente)}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Cliente Desde</p>
            <p className="text-sm text-gray-800">
              {ensureString(pessoaData.dataClienteDesde)}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Renovação Cadastral</p>
            <p className="text-sm text-gray-800">
              {ensureString(pessoaData.dataRenovacaoCadastral)}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Localização</p>
            <p className="text-sm text-gray-800">
              {ensureString(pessoaData.descricaoLocalizacao)}
            </p>
          </div>
        </div>
      </div>

      {/* Grid com 3 colunas para as principais seções */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Contatos */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Contatos</h2>
          <div className="space-y-2">
            {contatos.map(
              (
                contato: {
                  responseData: {
                    codigoTipoContato: string;
                    descricaoEmail: string;
                    telefoneCompletoDescription: string;
                  };
                },
                index: Key | null | undefined
              ) => {
                // Verifica se responseData existe antes de renderizar
                if (!contato?.responseData) return null;

                const {
                  codigoTipoContato,
                  descricaoEmail,
                  telefoneCompletoDescription,
                } = contato.responseData;

                return (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-md shadow-sm"
                  >
                    <p className="text-xs text-gray-600">
                      {codigoTipoContato === "EML" ? "Email" : "Telefone"}
                    </p>
                    <p className="text-sm text-gray-800">
                      {codigoTipoContato === "EML"
                        ? ensureString(descricaoEmail)
                        : ensureString(telefoneCompletoDescription)}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Endereços */}
        <div className="space-y-4">
          {/* Endereço Pessoal */}
          {enderecoPessoal && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Endereço Pessoal
              </h2>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-800">
                  {ensureString(enderecoPessoal.nomeLogradouro)},{" "}
                  {ensureString(enderecoPessoal.numeroEndereco)}
                </p>
                <p className="text-xs text-gray-600">
                  {ensureString(enderecoPessoal.nomeBairro)} -{" "}
                  {ensureString(enderecoPessoal.nomeCidade)}/
                  {ensureString(enderecoPessoal.siglaUf)}
                </p>
                <p className="text-xs text-gray-600">
                  CEP: {ensureString(enderecoPessoal.codigoCep)}
                </p>
                <p className="text-xs text-gray-600">
                  Tel: ({ensureString(enderecoPessoal.numeroDdd)}){" "}
                  {ensureString(enderecoPessoal.numeroTelefone)}
                </p>
              </div>
            </div>
          )}

          {/* Endereço Empresa */}
          {enderecoEmpresa && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Endereço Empresa
              </h2>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-800">
                  {ensureString(enderecoEmpresa.nomeLogradouro)},{" "}
                  {ensureString(enderecoEmpresa.numeroEndereco)}
                </p>
                <p className="text-xs text-gray-600">
                  {ensureString(enderecoEmpresa.nomeBairro)} -{" "}
                  {ensureString(enderecoEmpresa.nomeCidade)}/
                  {ensureString(enderecoEmpresa.siglaUf)}
                </p>
                <p className="text-xs text-gray-600">
                  CEP: {ensureString(enderecoEmpresa.codigoCep)}
                </p>
                <p className="text-xs text-gray-600">
                  Tel: ({ensureString(enderecoEmpresa.numeroDdd)}){" "}
                  {ensureString(enderecoEmpresa.numeroTelefone)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Informações Familiares */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Informações Familiares
          </h2>
          <div className="space-y-2">
            {mae && (
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-xs text-gray-600">Mãe</p>
                <p className="text-sm text-gray-800">
                  {ensureString(mae.nomeParente)}
                </p>
                <p className="text-xs text-gray-600">
                  {mae.parentePoliticamenteExposto ? "PEP" : "Não PEP"}
                </p>
              </div>
            )}
            {pai && (
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-xs text-gray-600">Pai</p>
                <p className="text-sm text-gray-800">
                  {ensureString(pai.nomeParente)}
                </p>
                <p className="text-xs text-gray-600">
                  {pai.parentePoliticamenteExposto ? "PEP" : "Não PEP"}
                </p>
              </div>
            )}
            {conjuge && (
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-xs text-gray-600">Cônjuge</p>
                <p className="text-sm text-gray-800">
                  {ensureString(conjuge.nomeParente)}
                </p>
                <p className="text-xs text-gray-600">
                  CPF: {ensureString(conjuge.cpfParente)}
                </p>
                <p className="text-xs text-gray-600">
                  {conjuge.parentePoliticamenteExposto ? "PEP" : "Não PEP"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informações Adicionais em grid de 4 colunas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Informações Adicionais
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Segmento</p>
            <p className="text-sm text-gray-800">
              {ensureString(pessoaData.segmento)}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Nível de Relacionamento</p>
            <p className="text-sm text-gray-800">
              {pessoaData.indicadorNivelRelacionamento ? "Sim" : "Não"}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Isenção IOF</p>
            <p className="text-sm text-gray-800">
              {pessoaData.indicadorIsencaoIof ? "Sim" : "Não"}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-600">Isenção IRF</p>
            <p className="text-sm text-gray-800">
              {pessoaData.indicadorIsencaoIrf ? "Sim" : "Não"}
            </p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm col-span-2">
            <p className="text-xs text-gray-600">Tipo de Ligação</p>
            <p className="text-sm text-gray-800">
              {ensureString(pessoaData.tipoLigacao?.description)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
