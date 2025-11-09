import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, RegisterResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Registra un nuevo usuario en el backend
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @param rol - Rol del usuario ('usuario' o 'admin')
   * @returns Observable con la respuesta del servidor
   */
  registrarUsuario(email: string, password: string, rol: string): Observable<ApiResponse<RegisterResponse>> {
    const body = {
      email: email,
      password: password,
      rol: rol
    };

    return this.http.post<ApiResponse<RegisterResponse>>(
      `${this.apiUrl}/registrar`,
      body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

