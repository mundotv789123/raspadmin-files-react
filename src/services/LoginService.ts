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

  login(username: string, password: string, callback: (() => void), callbackError?: ((errorMessage: string) => void)) {
    var formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    this.api.post(`/login`, formData, { auth: { username, password } }).then(callback)
      .catch((error) => {
        if (!callbackError)
          return;

        let message = 'Erro interno ao processar requisição';
        try {
          let json = JSON.parse(error.request.response);
          if (json.message)
            message = json.message;
        } catch {
        }

        callbackError(message);
      })
  }
}