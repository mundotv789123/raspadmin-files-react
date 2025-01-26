import ApiBaseService from "../api-base-service";
import { LoginRequest } from "../models/auth-models";

export default class AuthService extends ApiBaseService {
  async login(request: LoginRequest) {
    return await this.post('/auth/login', request);
  }
}