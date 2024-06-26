import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { NgForm } from '@angular/forms';
import { RecomendacionesService } from '../../services/recomendaciones.service';
import { CursoService } from '../students/services/courses.service';
import { swalWithCustomOptions } from 'src/app/sweetalert2-config'; // Importa la instancia personalizada
import { Router } from '@angular/router';

@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.component.html',
  styleUrls: ['./recomendaciones.component.css'],
})
export class RecomendacionesComponent implements OnInit, OnDestroy {
  menuActive = false;
  menuSubscription: Subscription | undefined;

  estrellas: number = 0;
  comentario: string = '';
  Alumnos_id: number = 0;
  Profesores_id: number = 0;
  profesores: any[] = [];
  usuarioLogueado: any;

  constructor(
    private recomendacionesService: RecomendacionesService,
    private cursoService: CursoService,
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.usuarioLogueado = JSON.parse(sessionStorage.getItem('usuario') || '{}');
    this.Alumnos_id = this.usuarioLogueado.id;

    // Convertir Alumnos_id a cadena antes de llamar al método
    this.cursoService
      .obtenerProfesoresPorAlumnoId(this.Alumnos_id.toString())
      .subscribe((profesores) => {
        // Filtrar profesores para evitar duplicados por ID
        const uniqueProfesores = profesores.filter(
          (profesor, index, self) => index === self.findIndex((t) => t.id === profesor.id)
        );
        this.profesores = uniqueProfesores;
      });

    this.menuSubscription = this.menuService.menuActive$.subscribe((active) => {
      this.menuActive = active;
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }

  setEstrellas(rating: number): void {
    this.estrellas = rating;
  }

  submitRecomendacion(form: NgForm): void {
    if (form.valid) {
      const newRecomendacion = {
        estrellas: this.estrellas,
        comentario: this.comentario,
        Alumnos_id: this.Alumnos_id,
        Profesores_id: this.Profesores_id,
      };

      this.recomendacionesService.createRecomendacion(newRecomendacion).subscribe(
        (data) => {
          console.log('Recomendación creada:', data);
          // Mostrar mensaje de éxito con SweetAlert
          swalWithCustomOptions.fire({
            title: 'Éxito',
            text: 'Recomendación creada exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            // Redirigir a la ruta /home
            this.router.navigate(['/home']);
          });
        },
        (error) => {
          // Manejar errores si es necesario
          swalWithCustomOptions.fire({
            title: 'Error',
            text: 'Ocurrió un error al crear la recomendación',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      );
    }
  }
}

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { MenuService } from 'src/app/services/menu.service';
// import { NgForm } from '@angular/forms';
// import { RecomendacionesService } from '../../services/recomendaciones.service';
// import { CursoService } from '../students/services/courses.service';
// import Swal from 'sweetalert2';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-recomendaciones',
//   templateUrl: './recomendaciones.component.html',
//   styleUrls: ['./recomendaciones.component.css'],
// })
// export class RecomendacionesComponent implements OnInit, OnDestroy {
//   menuActive = false;
//   menuSubscription: Subscription | undefined;

//   estrellas: number = 0;
//   comentario: string = '';
//   Alumnos_id: number = 0;
//   Profesores_id: number = 0;
//   profesores: any[] = [];
//   usuarioLogueado: any;

//   constructor(
//     private recomendacionesService: RecomendacionesService,
//     private cursoService: CursoService,
//     private router: Router,
//     private menuService: MenuService
//   ) {}

//   ngOnInit(): void {
//     this.usuarioLogueado = JSON.parse(
//       sessionStorage.getItem('usuario') || '{}'
//     );
//     this.Alumnos_id = this.usuarioLogueado.id;

//     // Convertir Alumnos_id a cadena antes de llamar al método
//     this.cursoService
//       .obtenerProfesoresPorAlumnoId(this.Alumnos_id.toString())
//       .subscribe((profesores) => {
//         // Filtrar profesores para evitar duplicados por ID
//         const uniqueProfesores = profesores.filter(
//           (profesor, index, self) =>
//             index === self.findIndex((t) => t.id === profesor.id)
//         );
//         this.profesores = uniqueProfesores;
//       });
//     this.menuSubscription = this.menuService.menuActive$.subscribe((active) => {
//       this.menuActive = active;
//     });
//   }

//   ngOnDestroy(): void {
//     this.menuSubscription?.unsubscribe();
//   }

//   setEstrellas(rating: number): void {
//     this.estrellas = rating;
//   }

//   submitRecomendacion(form: NgForm): void {
//     if (form.valid) {
//       const newRecomendacion = {
//         estrellas: this.estrellas,
//         comentario: this.comentario,
//         Alumnos_id: this.Alumnos_id,
//         Profesores_id: this.Profesores_id,
//       };

//       this.recomendacionesService
//         .createRecomendacion(newRecomendacion)
//         .subscribe(
//           (data) => {
//             console.log('Recomendación creada:', data);
//             // Mostrar mensaje de éxito con SweetAlert
//             Swal.fire({
//               title: 'Éxito',
//               text: 'Recomendación creada exitosamente',
//               icon: 'success',
//               confirmButtonText: 'Aceptar',
//             }).then(() => {
//               // Redirigir a la ruta /home
//               this.router.navigate(['/home']);
//             });
//           },
//           (error) => {
//             // Manejar errores si es necesario
//             Swal.fire({
//               title: 'Error',
//               text: 'Ocurrió un error al crear la recomendación',
//               icon: 'error',
//               confirmButtonText: 'Aceptar',
//             });
//           }
//         );
//     }
//   }
// }

