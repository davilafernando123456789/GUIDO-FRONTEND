import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './adminlte.min.css'],
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  mensaje: string = '';
  passwordFieldType: string = 'password';
  submitted: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onPasswordInput(event: Event) {
    this.password = (event.target as HTMLInputElement).value;
  }

  submitForm() {
    this.submitted = true;
    if (!this.usuario || !this.password) {
      return;
    }


    const data = { usuario: this.usuario, password: this.password };
    this.http
      .post<any>('http://3.84.155.125:4000/api/usuarios/auth', data)
      .subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response);
          if (response.mensaje === 'OK') {
            // Almacena los datos de sesión en sessionStorage
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem(
              'usuario',
              JSON.stringify({ ...response.usuario, rol: response.rol })
            );
            let navigationExtras: NavigationExtras = {
              state: { usuario: response.usuario },
            };

            if (response.rol === 1) {
              console.log('Redirigiendo al componente del alumno');
              sessionStorage.setItem('firstTimeLogin', 'false');
              this.router.navigate(['/home'], navigationExtras);
            } else if (response.rol === 2) {
              console.log('Redirigiendo al componente del profesor');
              sessionStorage.setItem('firstTimeLogin', 'false');
              this.router.navigate(['/home'], navigationExtras);
            } else if (response.rol === 3) {
              console.log('Redirigiendo al componente del admin');
              sessionStorage.setItem('firstTimeLogin', 'false');
              this.router.navigate(['/dashboard'], navigationExtras);
            }
          } else {
            this.mensaje = response.mensaje;
          }
        },
        (error) => {
          console.error('Error al enviar los datos:', error);
          if (error.status === 401) {
            this.mensaje = error.error.mensaje; // Contraseña incorrecta
          } else if (error.status === 404) {
            this.mensaje = error.error.mensaje; // Usuario no encontrado
          } else {
            this.mensaje = 'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
          }
        }
      );
  }
}




// import { Component } from '@angular/core';
// import { Router, NavigationExtras } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css', './adminlte.min.css'],
// })
// export class LoginComponent {
//   usuario: string = '';
//   password: string = '';
//   mensaje: string = '';
//   passwordFieldType: string = 'password';
//   submitted: boolean = false;

//   constructor(private http: HttpClient, private router: Router) {}

//   togglePasswordVisibility() {
//     this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
//   }

//   submitForm() {
//     this.submitted = true;
//     if (!this.usuario || !this.password) {
//       return;
//     }

//     const data = { usuario: this.usuario, password: this.password };
//     this.http
//       .post<any>('http://3.84.155.125:4000/api/usuarios/auth', data)
//       .subscribe(
//         (response) => {
//           console.log('Respuesta del servidor:', response);
//           if (response.mensaje === 'OK') {
//             // Almacena los datos de sesión en sessionStorage
//             sessionStorage.setItem('token', response.token);
//             sessionStorage.setItem(
//               'usuario',
//               JSON.stringify({ ...response.usuario, rol: response.rol })
//             );
//             let navigationExtras: NavigationExtras = {
//               state: { usuario: response.usuario },
//             };

//             if (response.rol === 1) {
//               console.log('Redirigiendo al componente del alumno');
//               sessionStorage.setItem('firstTimeLogin', 'false');
//               this.router.navigate(['/home'], navigationExtras);
//             } else if (response.rol === 2) {
//               console.log('Redirigiendo al componente del profesor');
//               sessionStorage.setItem('firstTimeLogin', 'false');
//               this.router.navigate(['/home'], navigationExtras);
//             } else if (response.rol === 3) {
//               console.log('Redirigiendo al componente del admin');
//               sessionStorage.setItem('firstTimeLogin', 'false');
//               this.router.navigate(['/dashboard'], navigationExtras);
//             } else {
//               console.log('Credenciales incorrectas');
//               this.mensaje = 'Credenciales incorrectas';
//             }
//           } else {
//             console.log('Credenciales incorrectas');
//             this.mensaje = 'Credenciales incorrectas';
//           }
//         },
//         (error) => {
//           console.error('Error al enviar los datos:', error);
//           this.mensaje =
//             'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
//         }
//       );
//   }
// }
