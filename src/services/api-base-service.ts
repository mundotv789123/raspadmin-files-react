export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

export default class ApiBaseService {
  protected baseUri: string = process.env.NEXT_PUBLIC_API_URL ?? "/api";

  protected async get<T>(url: string): Promise<T> {
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetch(`${this.baseUri}${url}`, { method: 'GET', headers });
    return this.handlerResponse<T>(response);
  }

  protected async post<T>(url: string, body: object): Promise<T> {
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetch(`${this.baseUri}${url}`, { method: 'POST', body: JSON.stringify(body), headers });
    return this.handlerResponse<T>(response);
  }

  private async handlerResponse<T>(response: Response) {
    let responseData;

    try {
      responseData = await response.json()
    } catch (error) {
      console.error(error);
    }

    if (response.status >= 200 && response.status <= 299) {
      if (responseData) {
        return responseData as T;
      }
      throw new Error("Ocorreu um erro ao deserializar json")
    }
    
    throw new ApiError(responseData?.message ?? `Ocorreu um erro ao enviar requisição, status: ${response.status}`, response.status )
  }
}