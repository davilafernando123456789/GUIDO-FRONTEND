import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css', './adminlte.min.css']
})
export class StudentComponent {
  alumno: any = {};
  apoderado: any = {};
  direccion: any = {};
  passwordFieldType: string = 'password';
  step: number = 1;
  errorMessage: string | null = null;  // Mensaje de error para mostrar en la UI

  constructor(private http: HttpClient, private router: Router) {}

  validateDate(fecha_nac: string, maxYear: number): boolean {
    const year = new Date(fecha_nac).getFullYear();
    return year <= maxYear;
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  nextStep() {
    if (this.step < 3) {
      this.step++;
    }
  }

  previousStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  submitForm() {
    this.errorMessage = null;  // Limpiar mensaje de error anterior

    if (!this.alumno.usuario || !this.alumno.password) {
      this.errorMessage = 'Los campos de usuario y contraseña son obligatorios.';
      return;
    }
    
    if (!this.alumno.dni) {
      this.errorMessage = 'El DNI es obligatorio.';
      return;
    }
    
    if (!this.validateDate(this.alumno.fecha_nac, 2012)) {
      this.errorMessage = 'La fecha de nacimiento del alumno no debe ser posterior al año 2012.';
      return;
    }

    if (!this.validateDate(this.apoderado.fecha_nac, 2006)) {
      this.errorMessage = 'La fecha de nacimiento del apoderado no debe ser posterior al año 2006.';
      return;
    }

    const data = {
      email: this.alumno.email,
      usuario: this.alumno.usuario,
      password: this.alumno.password,
      nombre: this.alumno.nombre,
      apellido: this.alumno.apellido,
      genero: this.alumno.genero,
      telefono: this.alumno.telefono,
      fecha_nac: this.alumno.fecha_nac,
      Roles_id: 1,
      apoderado: {
        dni: this.apoderado.dni,
        nombre: this.apoderado.nombre,
        apellido: this.apoderado.apellido,
        email: this.apoderado.email,
        fecha_nac: this.apoderado.fecha_nac,
        genero: this.apoderado.genero,
        telefono: this.apoderado.telefono
      },
      direccion: {
        calle: this.direccion.calle,
        distrito: this.direccion.distrito,
        ciudad: this.direccion.ciudad,
        codigo_postal: this.direccion.codigo_postal
      }
    };

    this.http.post<any>('http://3.84.155.125:4000/api/alumnos', data).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        const usuarioLogueado = {
          id: response.usuario.id,
          usuario: response.usuario.usuario,
          nombre: response.usuario.nombre,
          apellido: response.usuario.apellido,
          genero: response.usuario.genero,
          telefono: response.usuario.telefono,
          fecha_nac: response.usuario.fecha_nac,
          direccion: response.usuario.direccion,
          apoderado: response.usuario.apoderado,
          rol: response.rol,
        };
        sessionStorage.setItem('usuario', JSON.stringify(usuarioLogueado));
        sessionStorage.setItem('firstTimeLogin', 'false');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al enviar los datos:', error);
        this.errorMessage = 'Error al crear el alumno. Por favor, inténtalo de nuevo más tarde.';
      }
    });
  }
}


// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-register-student',
//   templateUrl: './student.component.html',
//   styleUrls: ['./student.component.css', './adminlte.min.css']
// })
// export class StudentComponent {
//   alumno: any = {};
//   apoderado: any = {};
//   direccion: any = {};
//   passwordFieldType: string = 'password';
//   step: number = 1;

//   constructor(private http: HttpClient, private router: Router) {}

//   validateDate(fecha_nac: string, maxYear: number): boolean {
//     const year = new Date(fecha_nac).getFullYear();
//     return year <= maxYear;
//   }

//   togglePasswordVisibility() {
//     this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
//   }

//   nextStep() {
//     if (this.step < 3) {
//       this.step++;
//     }
//   }

//   previousStep() {
//     if (this.step > 1) {
//       this.step--;
//     }
//   }

//   submitForm() {
//     if (!this.validateDate(this.alumno.fecha_nac, 2012)) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Fecha de nacimiento del alumno no válida',
//         text: 'La fecha de nacimiento del alumno no debe ser posterior al año 2012.',
//       });
//       return;
//     }

//     if (!this.validateDate(this.apoderado.fecha_nac, 2006)) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Fecha de nacimiento del apoderado no válida',
//         text: 'La fecha de nacimiento del apoderado no debe ser posterior al año 2006.',
//       });
//       return;
//     }

//     const data = {
//       email: this.alumno.email,
//       usuario: this.alumno.usuario,
//       password: this.alumno.password,
//       nombre: this.alumno.nombre,
//       apellido: this.alumno.apellido,
//       genero: this.alumno.genero,
//       telefono: this.alumno.telefono,
//       fecha_nac: this.alumno.fecha_nac,
//       Roles_id: 1,
//       apoderado: {
//         dni: this.apoderado.dni,
//         nombre: this.apoderado.nombre,
//         apellido: this.apoderado.apellido,
//         email: this.apoderado.email,
//         fecha_nac: this.apoderado.fecha_nac,
//         genero: this.apoderado.genero,
//         telefono: this.apoderado.telefono
//       },
//       direccion: {
//         calle: this.direccion.calle,
//         distrito: this.direccion.distrito,
//         ciudad: this.direccion.ciudad,
//         codigo_postal: this.direccion.codigo_postal
//       }
//     };

//     this.http.post<any>('http://3.84.155.125:4000/api/alumnos', data)
//       .subscribe(
//         response => {
//           console.log('Respuesta del servidor:', response);
//           Swal.fire({
//             icon: 'success',
//             title: 'Alumno creado correctamente',
//             showConfirmButton: false,
//             timer: 3000,
//           }).then(() => {
//             const usuarioLogueado = {
//               id: response.usuario.id,
//               usuario: response.usuario.usuario,
//               nombre: response.usuario.nombre,
//               apellido: response.usuario.apellido,
//               genero: response.usuario.genero,
//               telefono: response.usuario.telefono,
//               fecha_nac: response.usuario.fecha_nac,
//               direccion: response.usuario.direccion,
//               apoderado: response.usuario.apoderado,
//               rol: response.rol,
//             };
//             sessionStorage.setItem('usuario', JSON.stringify(usuarioLogueado));
//             sessionStorage.setItem('firstTimeLogin', 'false');
//             this.router.navigate(['/home']);
//           });
//         },
//         error => {
//           console.error('Error al enviar los datos:', error);
//           Swal.fire({
//             icon: 'error',
//             title: 'Error al crear el alumno',
//             text: 'Por favor, inténtalo de nuevo más tarde.',
//           });
//         }
//       );
//   }
// }
