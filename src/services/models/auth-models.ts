export interface LoginRequest {
  username: string,
  password: string,
}

export interface RefreshTokenRequest {
  token: string
}

export interface LoginResponse {
  token: string,
  refreshToken: string
}