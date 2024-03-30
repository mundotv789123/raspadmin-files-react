import HttpClient from "./HttpClient";

export class LoginService {
    constructor(private client = new HttpClient()) { }

    login(username: string, password: string, callback: (() => void), callbackError?: ((errorMessage: string) => void)) {
        var formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        this.client.api.post(`/auth/login`, formData, {auth: {username, password}}).then(callback)
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