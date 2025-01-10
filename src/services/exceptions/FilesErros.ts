
export function getErrorMessage(code: number): string {
  switch (code) {
    case 404:
      return 'Arquivo ou diretório não encontrado!';
    case 403:
      return 'Você não tem permissão para acessar esse arquivo ou diretório!';
    case 502:
    case 503:
      return 'Serviço indisponível no momento, tente novamente mais tarde!';
    case 500:
      return 'Erro interno ao processar arquivo!';
    default:
      return 'Erro desconhecido ao processar requisição!'
  }
}

export class FileError extends Error {
  constructor(public code: number) {
    super(getErrorMessage(code));
  }
}
