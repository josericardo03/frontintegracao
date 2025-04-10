import { ApiResponse } from "../../types/api";

interface SocioDetailsProps {
  apiResponse: ApiResponse;
}

export function SocioDetails({ apiResponse }: SocioDetailsProps) {
  // Verifica se temos dados em pessoaAtualizada ou pessoa
  const pessoaData =
    apiResponse?.data?.resultados?.pessoaAtualizada?.[0]?.responseData ||
    apiResponse?.data?.resultados?.pessoa?.[0]?.responseData;

  if (!pessoaData || !apiResponse?.data?.resultados) {
    return null;
  }

  const contatos = apiResponse.data.resultados.contatos || [];
  const mae = apiResponse.data.resultados.mae?.[0]?.responseData;
  const pai = apiResponse.data.resultados.pai?.[0]?.responseData;
  const conjuge = apiResponse.data.resultados.conjuge?.[0]?.responseData;
  const enderecoEmpresa = apiResponse.data.resultados.enderecoEmpresa?.[0];

  // Função para extrair a mensagem de erro
  const getErrorMessage = (error: any) => {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error?.erro) return error.erro;
    return "Erro desconhecido";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      {/* Cabeçalho */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {pessoaData.nomePessoa}
        </h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <span className="text-gray-500">CPF:</span>
            <span className="ml-2 text-gray-700">{pessoaData.numeroCic}</span>
          </div>
          <div>
            <span className="text-gray-500">Código Cliente:</span>
            <span className="ml-2 text-gray-700">
              {pessoaData.codigoCliente}
            </span>
          </div>
        </div>
      </div>

      {/* Grid de informações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Pessoais */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Informações Pessoais
          </h3>
          <div className="bg-gray-50 rounded p-4 space-y-2">
            <div>
              <span className="text-gray-500">Cliente Desde:</span>
              <span className="ml-2 text-gray-700">
                {new Date(pessoaData.dataClienteDesde).toLocaleDateString(
                  "pt-BR"
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Renovação Cadastral:</span>
              <span className="ml-2 text-gray-700">
                {new Date(pessoaData.dataRenovacaoCadastral).toLocaleDateString(
                  "pt-BR"
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Localização:</span>
              <span className="ml-2 text-gray-700">
                {pessoaData.descricaoLocalizacao}
              </span>
            </div>
          </div>
        </div>

        {/* Contatos */}
        {contatos.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Contatos</h3>
            <div className="bg-gray-50 rounded p-4 space-y-2">
              {contatos.map((contato, index) => (
                <div key={index}>
                  {contato.responseData.codigoTipoContato === "EML" ? (
                    <div>
                      <span className="text-gray-500">E-mail:</span>
                      <span className="ml-2 text-gray-700">
                        {contato.responseData.descricaoEmail}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-gray-500">Telefone:</span>
                      <span className="ml-2 text-gray-700">
                        {contato.responseData.telefoneCompletoDescription}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Informações Familiares */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Informações Familiares
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mae && (
            <div className="bg-gray-50 rounded p-4">
              <h4 className="font-medium text-gray-700 mb-2">Mãe</h4>
              <p className="text-sm text-gray-600">{mae.nomeParente}</p>
              <p className="text-sm text-gray-500 mt-1">
                PEP: {mae.parentePoliticamenteExposto ? "Sim" : "Não"}
              </p>
            </div>
          )}
          {pai && (
            <div className="bg-gray-50 rounded p-4">
              <h4 className="font-medium text-gray-700 mb-2">Pai</h4>
              <p className="text-sm text-gray-600">{pai.nomeParente}</p>
              <p className="text-sm text-gray-500 mt-1">
                PEP: {pai.parentePoliticamenteExposto ? "Sim" : "Não"}
              </p>
            </div>
          )}
          {conjuge && (
            <div className="bg-gray-50 rounded p-4">
              <h4 className="font-medium text-gray-700 mb-2">Cônjuge</h4>
              <p className="text-sm text-gray-600">{conjuge.nomeParente}</p>
              <p className="text-sm text-gray-500">CPF: {conjuge.cpfParente}</p>
              <p className="text-sm text-gray-500 mt-1">
                PEP: {conjuge.parentePoliticamenteExposto ? "Sim" : "Não"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Endereço da Empresa */}
      {enderecoEmpresa && enderecoEmpresa.responseData && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Endereço da Empresa
          </h3>
          <div className="bg-gray-50 rounded p-4 space-y-2">
            <div>
              <span className="text-gray-500">Logradouro:</span>
              <span className="ml-2 text-gray-700">
                {enderecoEmpresa.responseData.nomeLogradouro},{" "}
                {enderecoEmpresa.responseData.numeroEndereco}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Bairro:</span>
              <span className="ml-2 text-gray-700">
                {enderecoEmpresa.responseData.nomeBairro}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Cidade/UF:</span>
              <span className="ml-2 text-gray-700">
                {enderecoEmpresa.responseData.nomeCidade}/
                {enderecoEmpresa.responseData.siglaUf}
              </span>
            </div>
            <div>
              <span className="text-gray-500">CEP:</span>
              <span className="ml-2 text-gray-700">
                {enderecoEmpresa.responseData.codigoCep}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Telefone:</span>
              <span className="ml-2 text-gray-700">
                ({enderecoEmpresa.responseData.numeroDdd}){" "}
                {enderecoEmpresa.responseData.numeroTelefone}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Informações Adicionais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="text-center p-3 bg-blue-50 rounded">
          <span className="text-sm text-gray-500 block">Segmento</span>
          <span className="font-medium text-blue-600">
            {pessoaData.segmento}
          </span>
        </div>
        <div className="text-center p-3 bg-green-50 rounded">
          <span className="text-sm text-gray-500 block">
            Nível de Relacionamento
          </span>
          <span className="font-medium text-green-600">
            {pessoaData.indicadorNivelRelacionamento ? "Sim" : "Não"}
          </span>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded">
          <span className="text-sm text-gray-500 block">Isenção IOF</span>
          <span className="font-medium text-purple-600">
            {pessoaData.indicadorIsencaoIof ? "Sim" : "Não"}
          </span>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded">
          <span className="text-sm text-gray-500 block">Isenção IRF</span>
          <span className="font-medium text-orange-600">
            {pessoaData.indicadorIsencaoIrf ? "Sim" : "Não"}
          </span>
        </div>
      </div>
    </div>
  );
}
