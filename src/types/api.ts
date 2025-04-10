export interface ResultadoOperacao {
  sucesso: boolean;
  mensagem?: string;
  cnpj?: string;
  cpf?: string;
  responseData?: any;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    registrosProcessados?: number;
    cnpjEnviados?: string[];
    cnpjAtualizados?: string[];
    cpfEnviados?: string[];
    cpfAtualizados?: string[];
    documentosEnviados?: string[];
    documentosAtualizados?: string[];
    erros?: {
      cnpj: string;
      erro: string;
    }[];
    resultados?: {
      pessoa?: ResultadoOperacao[];
      pessoaAtualizada?: ResultadoOperacao[];
      endereco?: ResultadoOperacao[];
      enderecoPessoal?: ResultadoOperacao[];
      mae?: ResultadoOperacao[];
      pai?: ResultadoOperacao[];
      conjuge?: ResultadoOperacao[];
      contatos?: ResultadoOperacao[];
      socios?: ResultadoOperacao[];
      ramo?: ResultadoOperacao[];
      [key: string]: ResultadoOperacao[] | undefined;
    };
  };
}

export interface SearchParams {
  documento: string;
  status?: string;
}
