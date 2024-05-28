import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css', './adminlte.min.css'],
})
export class TeacherComponent {
  profesores: any = {
    especialidad: '',
  };
  especialidades = ['Matemática', 'Comunicación', 'Ciencias Sociales'];
  educativos: any = {};
  direccion: any = {};
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  toggleEspecialidad(especialidad: string) {
    this.profesores.especialidad = especialidad;
  }

  submitForm() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      this.http
        .post<any>('http://localhost:4000/api/imagen/upload-image', formData)
        .subscribe(
          (response) => {
            this.profesores.foto = response.imageUrl;
            this.saveProfesor();
          },
          (error) => {
            console.error('Error al subir la imagen:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al subir la imagen',
              text: 'Por favor, seleccione una imagen en el formato adecuado.',
            });
          }
        );
    } else {
      console.error('No se ha seleccionado ningún archivo.');
      Swal.fire({
        icon: 'warning',
        title: 'No se ha seleccionado ninguna imagen',
        text: 'Por favor, seleccione una imagen antes de enviar el formulario.',
      });
    }
  }

  saveProfesor() {
    const data = {
      email: this.profesores.email,
      usuario: this.profesores.usuario,
      password: this.profesores.password,
      nombre: this.profesores.nombre,
      apellido: this.profesores.apellido,
      genero: this.profesores.genero,
      dni: this.profesores.dni,
      descripcion: this.profesores.descripcion,
      telefono: this.profesores.telefono,
      fecha_nac: this.profesores.fecha_nac,
      Roles_id: 2,
      especialidad: this.profesores.especialidad,
      foto: this.profesores.foto,
      educativos: this.educativos,
      direccion: this.direccion,
    };
    this.http.post<any>('http://localhost:4000/api/profesores', data).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        Swal.fire({
          icon: 'success',
          title: 'Se ha registrado exitosamente a nuestra plataforma',
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          // Almacena los datos de sesión en sessionStorage
          const usuarioLogueado = {
            id: response.usuario.id,
            usuario: response.usuario.usuario,
            nombre: response.usuario.nombre,
            apellido: response.usuario.apellido,
            genero: response.usuario.genero,
            dni: response.usuario.dni,
            telefono: response.usuario.telefono,
            fecha_nac: response.usuario.fecha_nac,
            especialidad: response.usuario.especialidad,
            descripcion: response.usuario.descripcion,
            foto: response.usuario.foto,
            rol: response.rol,
            sala: response.usuario.sala,
          };
          sessionStorage.setItem('usuario', JSON.stringify(usuarioLogueado));
          // Redirige a la vista de suscripción
          this.router.navigate(['/suscripcion']);
        });
      },
      (error) => {
        console.error('Error al enviar los datos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar los datos',
        });
      }
    );
  }
}



// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-register-teacher',
//   templateUrl: './teacher.component.html',
//   styleUrls: ['./teacher.component.css', './adminlte.min.css'],
// })
// export class TeacherComponent {
//   profesores: any = {
//     especialidad: '',
//   };
//   especialidades = ['Matemática', 'Comunicación', 'Ciencias Sociales'];
//   educativos: any = {};
//   direccion: any = {};
//   selectedFile: File | null = null;

//   constructor(private http: HttpClient, private router: Router) {}

//   onFileSelected(event: any) {
//     if (event.target.files.length > 0) {
//       this.selectedFile = event.target.files[0];
//     }
//   }

//   toggleEspecialidad(especialidad: string) {
//     this.profesores.especialidad = especialidad;
//   }

//   submitForm() {
//     if (this.selectedFile) {
//       const formData = new FormData();
//       formData.append('image', this.selectedFile);
//       this.http
//         .post<any>('http://localhost:4000/api/imagen/upload-image', formData)
//         .subscribe(
//           (response) => {
//             this.profesores.foto = response.imageUrl;
//             this.saveProfesor();
//           },
//           (error) => {
//             console.error('Error al subir la imagen:', error);
//             Swal.fire({
//               icon: 'error',
//               title: 'Error al subir la imagen',
//               text: 'Por favor, seleccione una imagen en el formato adecuado.',
//             });
//           }
//         );
//     } else {
//       console.error('No se ha seleccionado ningún archivo.');
//       Swal.fire({
//         icon: 'warning',
//         title: 'No se ha seleccionado ninguna imagen',
//         text: 'Por favor, seleccione una imagen antes de enviar el formulario.',
//       });
//     }
//   }

//   saveProfesor() {
//     const data = {
//       email: this.profesores.email,
//       usuario: this.profesores.usuario,
//       password: this.profesores.password,
//       nombre: this.profesores.nombre,
//       apellido: this.profesores.apellido,
//       genero: this.profesores.genero,
//       dni: this.profesores.dni,
//       descripcion: this.profesores.descripcion,
//       telefono: this.profesores.telefono,
//       fecha_nac: this.profesores.fecha_nac,
//       Roles_id: 2,
//       especialidad: this.profesores.especialidad,
//       foto: this.profesores.foto,
//       educativos: this.educativos,
//       direccion: this.direccion,
//     };
//     this.http.post<any>('http://localhost:4000/api/profesores', data).subscribe(
//       (response) => {
//         console.log('Respuesta del servidor:', response);
//         Swal.fire({
//           icon: 'success',
//           title: 'Se ha registrado exitosamente a nuestra plataforma',
//           showConfirmButton: false,
//           timer: 3000,
//         }).then(() => {
//           // Almacena los datos de sesión en sessionStorage
//           sessionStorage.setItem('usuario', JSON.stringify(response.usuario));
//           // Redirige a la vista de suscripción
//           this.router.navigate(['/suscripcion']);
//         });
//       },
//       (error) => {
//         console.error('Error al enviar los datos:', error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Error al enviar los datos',
//         });
//       }
//     );
//   }
// }
