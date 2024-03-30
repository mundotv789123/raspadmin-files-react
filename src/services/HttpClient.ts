import axios, { AxiosInstance } from "axios";

export default class HttpClient {
    public API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

    public api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: `${this.API_URL}`,
            timeout: 5000
        })
    }
}