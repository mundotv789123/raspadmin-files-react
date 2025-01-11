import axios, { AxiosInstance } from "axios";

export class LoginService {
  private API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${this.API_URL}/auth`,
      timeout: 5000
    })
  }

  async login(username: string, password: string) {
    try {
      return await this.api.post(`/login`, { username, password }, { auth: { username, password } });
    } catch (error: unknown) {
      let message = 'Erro interno ao processar requisição';

      const errorObj = error as {request?: {response?: string}} | null;
      if (!errorObj?.request?.response) {
        throw message;
      }

      try {
        const json = JSON.parse(errorObj?.request?.response);
        if (json.message)
          message = json.message;
      } catch {
      }
      throw message;
    }
  }
}