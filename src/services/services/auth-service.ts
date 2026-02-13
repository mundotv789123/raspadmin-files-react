import { useMemo } from "react";
import ApiBaseService, { ApiError } from "../api-base-service";
import { LoginRequest, LoginResponse, RefreshTokenRequest } from "../models/auth-models";

export class AuthService extends ApiBaseService {
  private timeoutRefreshToken: NodeJS.Timeout | null = null;

  constructor() {
    super();
    if (globalThis.window !== undefined && globalThis.localStorage) {
      this.timeoutToRefreshToken(1)
    }
  }

  async login(request: LoginRequest) {
    const response = await this.post<LoginResponse>('/auth/login', { ...request, loginType: 'CREDENTIALS' });
    localStorage.setItem("token", response.refreshToken)

    const tokenData = this.decodeJwtToken(response.token);
    localStorage.setItem('token_exp', tokenData!.exp.toString());

    this.timeoutToRefreshToken();

    return response;
  }

  async refresh(request: RefreshTokenRequest) {
    try {
      const response = await this.post<LoginResponse>('/auth/login', { ...request, loginType: 'REFRESH_TOKEN' });
      localStorage.setItem("token", response.refreshToken)

      const tokenData = this.decodeJwtToken(response.token);
      localStorage.setItem('token_exp', tokenData!.exp.toString());

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token_exp');
        }
      }
      throw error;
    }
  }

  private timeoutToRefreshToken(timePlus: number = 0) {
    const tokenExp = Number(localStorage.getItem('token_exp') ?? '0');
    const currentTime = Math.round(Date.now() / 1000);

    let time = tokenExp - currentTime;
    time = (time < 0 ? 0 : time * .9) + timePlus

    if (this.timeoutRefreshToken) {
      clearTimeout(this.timeoutRefreshToken);
    }
    this.timeoutRefreshToken = setTimeout(() => {
      const refreshToken = localStorage.getItem('token');
      if (refreshToken) {
        this.refresh({ token: refreshToken })
          .then(() => this.timeoutToRefreshToken())
          .catch(() => {
            setTimeout(() => {
              this.timeoutToRefreshToken();
            }, 5000);
          });
      }
    }, time * 1000);
  }

  private decodeJwtToken(jwtStr: string): { exp: number } | null {
    const base64Splited = jwtStr.split(".");
    if (base64Splited.length === 3) {
      return JSON.parse(atob(base64Splited[1]))
    }
    return null;
  }
}

const authService = new AuthService();

export default function useAuthService() {
  return useMemo(() => authService, []);
}