import { ApiResponse } from "@/types/api";

interface SocioDetailsProps {
  apiResponse: ApiResponse;
}

export function SocioDetails({ apiResponse }: SocioDetailsProps) {
  const getPessoaData = () => {
    const pessoaAtualizada =
      apiResponse.data?.resultados?.pessoaAtualizada?.[0];
    return pessoaAtualizada?.responseData;
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

  const pessoaData = getPessoaData();
  const contatos = getContatos();
  const enderecoPessoal = getEnderecoPessoal();
  const enderecoEmpresa = getEnderecoEmpresa();
  const mae = getFamiliar("mae");
  const pai = getFamiliar("pai");
  const conjuge = getFamiliar("conjuge");

  if (!pessoaData) return null;

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-6">
      {/* Informações Pessoais */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Informações Pessoais
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nome</p>
            <p className="text-gray-800">{pessoaData.nomePessoa}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">CPF</p>
            <p className="text-gray-800">{pessoaData.numeroCic}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Código do Cliente</p>
            <p className="text-gray-800">{pessoaData.codigoCliente}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cliente Desde</p>
            <p className="text-gray-800">{pessoaData.dataClienteDesde}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Renovação Cadastral</p>
            <p className="text-gray-800">{pessoaData.dataRenovacaoCadastral}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Localização</p>
            <p className="text-gray-800">{pessoaData.descricaoLocalizacao}</p>
          </div>
        </div>
      </div>

      {/* Contatos */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contatos</h2>
        <div className="space-y-4">
          {contatos.map((contato, index) => (
            <div key={index} className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm text-gray-600">
                {contato.responseData.codigoTipoContato === "EML"
                  ? "Email"
                  : "Telefone"}
              </p>
              <p className="text-gray-800">
                {contato.responseData.codigoTipoContato === "EML"
                  ? contato.responseData.descricaoEmail
                  : contato.responseData.telefoneCompletoDescription}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Endereço Pessoal */}
      {enderecoPessoal && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Endereço Pessoal
          </h2>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-gray-800">
              {enderecoPessoal.nomeLogradouro}, {enderecoPessoal.numeroEndereco}
            </p>
            <p className="text-gray-600">
              {enderecoPessoal.nomeBairro} - {enderecoPessoal.nomeCidade}/
              {enderecoPessoal.siglaUf}
            </p>
            <p className="text-gray-600">CEP: {enderecoPessoal.codigoCep}</p>
            <p className="text-gray-600">
              Telefone: ({enderecoPessoal.numeroDdd}){" "}
              {enderecoPessoal.numeroTelefone}
            </p>
          </div>
        </div>
      )}

      {/* Endereço Empresa */}
      {enderecoEmpresa && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Endereço Empresa
          </h2>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-gray-800">
              {enderecoEmpresa.nomeLogradouro}, {enderecoEmpresa.numeroEndereco}
            </p>
            <p className="text-gray-600">
              {enderecoEmpresa.nomeBairro} - {enderecoEmpresa.nomeCidade}/
              {enderecoEmpresa.siglaUf}
            </p>
            <p className="text-gray-600">CEP: {enderecoEmpresa.codigoCep}</p>
            <p className="text-gray-600">
              Telefone: ({enderecoEmpresa.numeroDdd}){" "}
              {enderecoEmpresa.numeroTelefone}
            </p>
          </div>
        </div>
      )}

      {/* Informações Familiares */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Informações Familiares
        </h2>
        <div className="space-y-4">
          {mae && (
            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm text-gray-600">Mãe</p>
              <p className="text-gray-800">{mae.nomeParente}</p>
              <p className="text-sm text-gray-600">
                {mae.parentePoliticamenteExposto
                  ? "Pessoa Politicamente Exposta"
                  : "Não é Pessoa Politicamente Exposta"}
              </p>
            </div>
          )}
          {pai && (
            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm text-gray-600">Pai</p>
              <p className="text-gray-800">{pai.nomeParente}</p>
              <p className="text-sm text-gray-600">
                {pai.parentePoliticamenteExposto
                  ? "Pessoa Politicamente Exposta"
                  : "Não é Pessoa Politicamente Exposta"}
              </p>
            </div>
          )}
          {conjuge && (
            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm text-gray-600">Cônjuge</p>
              <p className="text-gray-800">{conjuge.nomeParente}</p>
              <p className="text-sm text-gray-600">CPF: {conjuge.cpfParente}</p>
              <p className="text-sm text-gray-600">
                {conjuge.parentePoliticamenteExposto
                  ? "Pessoa Politicamente Exposta"
                  : "Não é Pessoa Politicamente Exposta"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Informações Adicionais
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Segmento</p>
            <p className="text-gray-800">{pessoaData.segmento}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Nível de Relacionamento</p>
            <p className="text-gray-800">
              {pessoaData.indicadorNivelRelacionamento ? "Sim" : "Não"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Isenção IOF</p>
            <p className="text-gray-800">
              {pessoaData.indicadorIsencaoIof ? "Sim" : "Não"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Isenção IRF</p>
            <p className="text-gray-800">
              {pessoaData.indicadorIsencaoIrf ? "Sim" : "Não"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tipo de Ligação</p>
            <p className="text-gray-800">
              {pessoaData.tipoLigacao?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
