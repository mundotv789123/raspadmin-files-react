import { useMemo } from "react";
import ApiBaseService from "../api-base-service";
import { LoginRequest, LoginResponse, RefreshTokenRequest } from "../models/auth-models";

export class AuthService extends ApiBaseService {
  private static timeoutRefreshToken: NodeJS.Timeout | null = null;

  constructor() {
    super();
    if (!AuthService.timeoutRefreshToken) {
      if (typeof window !== 'undefined' && window.localStorage) {
        this.timeoutToRefreshToken(0.5)
      }
    }
  }

  async login(request: LoginRequest) {
    const response = await this.post<LoginResponse>('/auth/login', { ...request, loginType: 'CREDENTIALS' });
    localStorage.setItem("token", response.refreshToken)

    const tokenData = this.decodeJwtToken(response.token);
    const currentTime = Math.round(Date.now() / 1000);
    this.timeoutToRefreshToken(tokenData.exp - currentTime);
    return response;
  }

  async refresh(request: RefreshTokenRequest) {
    const response = await this.post<LoginResponse>('/auth/login', { ...request, loginType: 'REFRESH_TOKEN' });
    localStorage.setItem("token", response.refreshToken)

    const tokenData = this.decodeJwtToken(response.token);
    const currentTime = Math.round(Date.now() / 1000);
    this.timeoutToRefreshToken(tokenData.exp - currentTime);
    return response;
  }

  private timeoutToRefreshToken(time: number) {
    time = time < 0 ? 0 : time * .9
    if (AuthService.timeoutRefreshToken) {
      clearTimeout(AuthService.timeoutRefreshToken);
    }
    AuthService.timeoutRefreshToken = setTimeout(() => {
      const refreshToken = localStorage.getItem('token');
      if (refreshToken) {
        this.refresh({ token: refreshToken });
      }
    }, time * 1000);
  }

  private decodeJwtToken(jwtStr: string) {
    const base64Splited = jwtStr.split(".");
    if (base64Splited.length === 3) {
      return JSON.parse(atob(base64Splited[1]))
    }
    return null;
  }
}

export default function useFilesService() {
  return useMemo(() => new AuthService(), []);
}