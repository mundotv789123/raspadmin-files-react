import { useMemo } from "react";
import ApiBaseService from "../api-base-service";
import { LoginRequest, LoginResponse, RefreshTokenRequest } from "../models/auth-models";

export class AuthService extends ApiBaseService {
  async login(request: LoginRequest) {
    const response = await this.post<LoginResponse>('/auth/login', {...request, loginType: 'CREDENTIALS'});
    localStorage.setItem("token", response.refreshToken)
    return response;
  }

  async refresh(request: RefreshTokenRequest) {
    const response = await this.post<LoginResponse>('/auth/login', {...request, loginType: 'REFRESH_TOKEN'});
    localStorage.setItem("token", response.refreshToken)
    return response;
  }
}

export default function useAuthService() {
  return useMemo(() => new AuthService(), []);
}