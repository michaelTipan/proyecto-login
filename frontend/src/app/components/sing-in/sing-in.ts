import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sing-in',
  imports: [RouterLink, FormsModule],
  templateUrl: './sing-in.html',
  styleUrl: './sing-in.css',
})
export class SingIn {
  rol: string = "";
  email: string = "";           // Email del usuario
  password: string = "";   // Contraseña (sin encriptar, el backend la hashea)
  repeatPassword: string = "";   // Contraseña (sin encriptar, el backend la hashea)

  constructor() { }
  ngOnInit() { }

  addUser() {
    if (this.rol == "Selecione un rol" || this.rol == '' || this.email == '' || this.password == '' || this.repeatPassword == '') {
      alert("Por favor, complete todos los campos");
      return;
    }

    if (this.password !== this.repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
  }
}
