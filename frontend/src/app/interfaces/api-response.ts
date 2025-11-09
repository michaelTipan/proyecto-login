export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface RegisterResponse {
  id: number;
  email: string;
  rol: string;
}

