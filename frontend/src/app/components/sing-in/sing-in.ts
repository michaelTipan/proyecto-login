import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sing-in',
  imports: [RouterLink, FormsModule],
  templateUrl: './sing-in.html',
  styleUrl: './sing-in.css',
})
export class SingIn {
  rol: string = "";
  email: string = "";
  password: string = "";
  repeatPassword: string = "";
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() { }

  addUser() {
    if (this.rol == "Seleccione un rol" || this.rol == '' || this.email == '' || this.password == '' || this.repeatPassword == '') {
      alert("Por favor, complete todos los campos");
      return;
    }

    if (this.password !== this.repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Convertir el rol del select a string
    const rolString = this.rol === "1" ? "usuario" : "admin";

    // Activar loading
    this.isLoading = true;

    // Llamar al servicio y suscribirse
    this.authService.registrarUsuario(this.email, this.password, rolString)
      .subscribe({
        next: (response) => {
          console.log('Usuario registrado:', response);
          alert(response.message);
          this.isLoading = false;
          // Redirigir al login después del registro exitoso
          this.router.navigate(['/logIn']);
        },
        error: (error) => {
          console.error('Error al registrar:', error);
          alert(error.error?.message || 'Error al registrar usuario');
          this.isLoading = false;
        }
      });
  }
}
