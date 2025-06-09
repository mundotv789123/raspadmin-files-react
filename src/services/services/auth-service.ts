import { useMemo } from "react";
import ApiBaseService from "../api-base-service";
import { LoginRequest } from "../models/auth-models";

class AuthService extends ApiBaseService {
  async login(request: LoginRequest) {
    return await this.post('/auth/login', request);
  }
}

export default function useAuthService() {
  return useMemo(() => new AuthService(), []);
}