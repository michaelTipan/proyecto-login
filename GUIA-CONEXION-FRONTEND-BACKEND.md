# 📚 Guía: Conectar Frontend Angular con Backend para Registrar Usuarios

## 🎯 Objetivo de Aprendizaje

Al finalizar esta guía, los alumnos podrán:
- Entender cómo Angular se comunica con APIs REST
- Crear servicios para manejar peticiones HTTP
- Configurar HttpClient en Angular
- Implementar el registro de usuarios conectando frontend y backend
- Manejar respuestas y errores del servidor

---

## 📖 Conceptos Clave que Debes Explicar

### 1. **HttpClient de Angular**
- Es el módulo que permite hacer peticiones HTTP (GET, POST, PUT, DELETE)
- Se importa desde `@angular/common/http`
- Devuelve **Observables** (RxJS), no Promesas
- Permite comunicarse con APIs REST

### 2. **Servicios en Angular**
- Los servicios son clases que contienen lógica reutilizable
- Se usan para:
  - Comunicación con APIs
  - Compartir datos entre componentes
  - Lógica de negocio
- Se inyectan en componentes mediante **Dependency Injection**

### 3. **Observables (RxJS)**
- Representan flujos de datos asíncronos
- Se suscriben con `.subscribe()` para recibir datos
- Se pueden transformar con operadores (`.pipe()`, `.map()`, etc.)
- Siempre hay que desuscribirse para evitar memory leaks

### 4. **Dependency Injection (DI)**
- Angular inyecta automáticamente las dependencias
- Se declara en el constructor: `constructor(private servicio: MiServicio)`
- Permite reutilizar código y facilitar testing

### 5. **Interfaces TypeScript**
- Definen la estructura de datos
- Ayudan con autocompletado y detección de errores
- Ya tienes `User` definida, pero puedes crear una para las respuestas del API

---

## 📁 Archivos que Debes Configurar/Crear

### **Archivos a Modificar:**
1. ✅ `app.config.ts` - Configurar HttpClient
2. ✅ `sing-in.ts` - Llamar al servicio desde el componente
3. ✅ `interfaces/user.ts` - Asegurar que la interfaz coincida con el backend

### **Archivos a Crear:**
1. 🆕 `services/auth.service.ts` - Servicio para peticiones de autenticación
2. 🆕 `interfaces/api-response.ts` - Interfaz para respuestas del API (opcional pero recomendado)

---

## 🔧 Paso a Paso: Implementación

### **PASO 1: Configurar HttpClient en app.config.ts**

**Ubicación:** `frontend/src/app/app.config.ts`

**¿Por qué?** Angular necesita que HttpClient esté disponible en toda la aplicación.

**Código a agregar:**

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // 👈 NUEVO IMPORT

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient() // 👈 NUEVO PROVIDER
  ]
};
```

**Concepto a explicar:**
- `provideHttpClient()` hace que HttpClient esté disponible en toda la app
- Es parte del sistema de providers de Angular
- Sin esto, no podrás hacer peticiones HTTP

---

### **PASO 2: Crear Interfaz para Respuesta del API (Opcional pero Recomendado)**

**Ubicación:** `frontend/src/app/interfaces/api-response.ts`

**¿Por qué?** TypeScript nos ayuda a saber qué estructura tiene la respuesta del servidor.

**Código:**

```typescript
export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface RegisterResponse {
  id: number;
  email: string;
  rol: string;
}
```

**Concepto a explicar:**
- Las interfaces definen contratos de datos
- `<T>` es un genérico que permite reutilizar la interfaz
- Ayuda a detectar errores en tiempo de desarrollo

---

### **PASO 3: Crear el Servicio de Autenticación**

**Ubicación:** `frontend/src/app/services/auth.service.ts`

**¿Por qué?** Separar la lógica de comunicación HTTP del componente. Esto permite:
- Reutilizar el código en otros componentes
- Facilitar testing
- Mantener el código organizado

**Código completo:**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, RegisterResponse } from '../interfaces/api-response';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root' // 👈 Hace que el servicio sea singleton (una sola instancia)
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // 👈 URL base del backend

  constructor(private http: HttpClient) { } // 👈 Inyección de dependencia

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
      `${this.apiUrl}/registrar`, // 👈 Endpoint del backend
      body,
      {
        headers: {
          'Content-Type': 'application/json' // 👈 Indica que enviamos JSON
        }
      }
    );
  }
}
```

**Conceptos clave a explicar:**

1. **`@Injectable({ providedIn: 'root' })`**
   - Hace que Angular cree una sola instancia del servicio
   - Disponible en toda la aplicación
   - No necesitas agregarlo manualmente a providers

2. **`constructor(private http: HttpClient)`**
   - Dependency Injection: Angular inyecta HttpClient automáticamente
   - `private` crea la propiedad automáticamente

3. **`Observable<ApiResponse<RegisterResponse>>`**
   - El método devuelve un Observable
   - El tipo genérico indica qué estructura tiene la respuesta
   - No se ejecuta hasta que alguien se suscriba

4. **`http.post<...>(url, body, options)`**
   - Método POST para enviar datos
   - `<...>` es el tipo de respuesta esperada
   - `body` son los datos a enviar
   - `options` permite configurar headers, etc.

---

### **PASO 4: Actualizar el Componente Sign-In**

**Ubicación:** `frontend/src/app/components/sing-in/sing-in.ts`

**¿Por qué?** El componente debe usar el servicio para comunicarse con el backend.

**Código actualizado:**

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; // 👈 Agregar Router
import { AuthService } from '../../services/auth.service'; // 👈 Importar el servicio

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
  isLoading: boolean = false; // 👈 Para mostrar loading

  // 👇 Inyectar el servicio y el router
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() { }

  addUser() {
    // Validaciones
    if (this.rol == "Seleccione un rol" || this.rol == '' || this.email == '' || this.password == '' || this.repeatPassword == '') {
      alert("Por favor, complete todos los campos");
      return;
    }

    if (this.password !== this.repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // 👇 Convertir el rol del select a string
    const rolString = this.rol === "1" ? "usuario" : "admin";

    // 👇 Activar loading
    this.isLoading = true;

    // 👇 Llamar al servicio y suscribirse
    this.authService.registrarUsuario(this.email, this.password, rolString)
      .subscribe({
        // 👇 Callback cuando la petición es exitosa
        next: (response) => {
          console.log('Usuario registrado:', response);
          alert(response.message); // "Usuario registrado correctamente"
          this.isLoading = false;
          
          // 👇 Redirigir al login después del registro exitoso
          this.router.navigate(['/logIn']);
        },
        // 👇 Callback cuando hay un error
        error: (error) => {
          console.error('Error al registrar:', error);
          alert(error.error?.message || 'Error al registrar usuario');
          this.isLoading = false;
        }
      });
  }
}
```

**Conceptos clave a explicar:**

1. **Inyección en el constructor:**
   ```typescript
   constructor(
     private authService: AuthService,
     private router: Router
   ) { }
   ```
   - Angular inyecta automáticamente las dependencias
   - `private` crea propiedades de clase automáticamente

2. **Suscribirse al Observable:**
   ```typescript
   .subscribe({
     next: (response) => { ... },  // Éxito
     error: (error) => { ... }      // Error
   })
   ```
   - Los Observables son "lazy": no se ejecutan hasta suscribirse
   - `next`: se ejecuta cuando la petición es exitosa
   - `error`: se ejecuta cuando hay un error

3. **Manejo de errores:**
   - `error.error?.message` accede al mensaje del servidor
   - El `?` es optional chaining (evita errores si `error.error` es null)

4. **Navegación con Router:**
   - `this.router.navigate(['/logIn'])` redirige a otra ruta
   - Mejor UX que solo mostrar un alert

---

### **PASO 5: Actualizar el HTML para Mostrar Loading (Opcional pero Recomendado)**

**Ubicación:** `frontend/src/app/components/sing-in/sing-in.html`

**Mejora al botón:**

```html
<button 
  class="btn btn-danger" 
  (click)="addUser()" 
  type="button"
  [disabled]="isLoading">
  {{ isLoading ? 'Registrando...' : 'Registrar' }}
</button>
```

**Concepto:**
- `[disabled]` desactiva el botón mientras carga
- `{{ }}` es interpolación de Angular
- Mejora la experiencia de usuario

---

## 🔍 Verificación: Cómo Probar que Funciona

### 1. **Verificar que el Backend esté corriendo:**
```bash
# En la carpeta backend
npm start
# Debe mostrar: "Servidor escuchando en el puerto 3000"
```

### 2. **Verificar que el Frontend esté corriendo:**
```bash
# En la carpeta frontend
npm start
# Debe abrir en http://localhost:4200 (o puerto similar)
```

### 3. **Probar el registro:**
1. Ir a la página de registro (`/signIn`)
2. Llenar el formulario
3. Hacer clic en "Registrar"
4. Abrir la consola del navegador (F12)
5. Verificar:
   - ✅ En Network tab: petición POST a `http://localhost:3000/api/registrar`
   - ✅ En Console: mensaje de éxito o error
   - ✅ Redirección al login si fue exitoso

---

## ⚠️ Problemas Comunes y Soluciones

### **Error: "HttpClient is not provided"**
**Solución:** Verificar que agregaste `provideHttpClient()` en `app.config.ts`

### **Error: "CORS policy" o "Access to fetch blocked by CORS policy"**
**Solución:** El backend debe permitir peticiones desde el frontend. 

**⚠️ IMPORTANTE:** Si ves este error, necesitas configurar CORS en el backend:

1. **Verificar que el paquete `cors` esté instalado:**
   ```bash
   cd backend
   npm list cors
   ```

2. **Actualizar `backend/src/index.js` para usar CORS:**
   ```javascript
   const cors = require('cors'); // 👈 Agregar al inicio
   
   // ... código existente ...
   
   const corsOptions = {
     origin: 'http://localhost:4200', // 👈 Puerto del frontend Angular (típicamente 4200)
     credentials: true
   }
   
   app.use(cors(corsOptions)); // 👈 AGREGAR ESTA LÍNEA (antes de las rutas)
   app.use(express.json());
   ```

3. **Reiniciar el servidor backend**

**Nota:** Si tu frontend corre en otro puerto, cambia `4200` por el puerto correcto.

### **Error: "Cannot find module"**
**Solución:** Verificar que los imports estén correctos y que los archivos existan

### **La petición no se ejecuta**
**Solución:** Verificar que te suscribiste al Observable con `.subscribe()`

### **Error 500 del servidor**
**Solución:** Revisar la consola del backend para ver el error específico

---

## 📊 Flujo Completo de la Petición

```
1. Usuario llena formulario
   ↓
2. Usuario hace clic en "Registrar"
   ↓
3. Componente ejecuta addUser()
   ↓
4. Componente llama authService.registrarUsuario()
   ↓
5. Servicio hace petición HTTP POST al backend
   ↓
6. Backend procesa la petición
   ↓
7. Backend responde con JSON
   ↓
8. Observable emite la respuesta
   ↓
9. Componente recibe respuesta en subscribe.next()
   ↓
10. Componente muestra mensaje y redirige
```

---

## 🎓 Preguntas para Evaluar Comprensión

1. **¿Por qué usamos servicios en lugar de hacer peticiones directamente en el componente?**
   - Respuesta: Para reutilizar código, facilitar testing y mantener separación de responsabilidades

2. **¿Qué es un Observable?**
   - Respuesta: Un flujo de datos asíncrono que se ejecuta cuando alguien se suscribe

3. **¿Por qué debemos suscribirnos al Observable?**
   - Respuesta: Porque los Observables son "lazy" y no se ejecutan hasta que alguien se suscribe

4. **¿Qué hace `providedIn: 'root'`?**
   - Respuesta: Crea una sola instancia del servicio disponible en toda la aplicación

5. **¿Qué es Dependency Injection?**
   - Respuesta: Patrón donde Angular inyecta automáticamente las dependencias en el constructor

---

## 📝 Resumen de Archivos Modificados/Creados

| Archivo | Acción | Propósito |
|---------|--------|-----------|
| `app.config.ts` | Modificar | Configurar HttpClient |
| `services/auth.service.ts` | Crear | Servicio para peticiones HTTP |
| `interfaces/api-response.ts` | Crear (opcional) | Tipos para respuestas del API |
| `components/sing-in/sing-in.ts` | Modificar | Usar el servicio para registrar |
| `components/sing-in/sing-in.html` | Modificar (opcional) | Mejorar UX con loading |

---

## 🚀 Siguiente Paso: Login

Una vez que el registro funcione, puedes aplicar los mismos conceptos para:
- Crear método `login()` en `AuthService`
- Implementar `login()` en el componente `Login`
- Guardar el token JWT en localStorage
- Crear un interceptor para agregar el token automáticamente a las peticiones

---

## 📚 Recursos Adicionales

- [Angular HttpClient](https://angular.io/guide/http)
- [RxJS Observables](https://rxjs.dev/guide/observable)
- [Angular Services](https://angular.io/guide/services)
- [Dependency Injection](https://angular.io/guide/dependency-injection)

---

**¡Éxito con tu curso! 🎉**

