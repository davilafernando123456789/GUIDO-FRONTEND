import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { ReportService } from 'src/app/services/report.service';
import { Router } from '@angular/router';
import { swalWithCustomOptions } from 'src/app/sweetalert2-config'; // Importa la instancia personalizada

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  menuActive = false;
  menuSubscription: Subscription | undefined;

  alumnos: any[] = [];
  report = {
    Profesor_id: null as number | null,
    Alumno_id: null as number | null,
    Apoderado_id: null as number | null,
    asistencia: false,
    participacion: false,
    comprension: false,
    comportamiento: false,
    observaciones: '',
    recomendaciones: '',
  };

  constructor(
    private reportService: ReportService,
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.fetchAlumnos();
    this.menuSubscription = this.menuService.menuActive$.subscribe((active) => {
      this.menuActive = active;
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }

  fetchAlumnos(): void {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      const usuarioId = usuario.id as string;

      this.reportService.obtenerInscripcionesPorProfesorId(usuarioId).subscribe(
        (inscripciones: any[]) => {
          console.log(
            'Respuesta de obtenerInscripcionesPorProfesorId:',
            inscripciones
          );
          const alumnosRegistrados: Set<number> = new Set<number>();

          inscripciones.forEach((inscripcion) => {
            const alumnoIdObj = inscripcion as any;
            let alumnoIdString: string;

            if (alumnoIdObj.hasOwnProperty('Alumnos_id')) {
              alumnoIdString = alumnoIdObj.Alumnos_id.toString();
            } else {
              console.error(
                'El objeto inscripcion no tiene la propiedad "Alumnos_id":',
                inscripcion
              );
              return;
            }

            const alumnoIdNumber: number = parseInt(alumnoIdString, 10);
            if (!alumnosRegistrados.has(alumnoIdNumber)) {
              alumnosRegistrados.add(alumnoIdNumber);
              this.reportService.obtenerAlumnoPorId(alumnoIdString).subscribe(
                (alumno: any) => {
                  console.log('Alumno obtenido:', alumno);
                  this.alumnos.push(alumno);
                },
                (error) => {
                  console.error('Error al obtener alumno por ID:', error);
                }
              );
            }
          });
        },
        (error) => {
          console.error(
            'Error al obtener inscripciones por profesor ID:',
            error
          );
        }
      );
    } else {
      console.error('No se encontró información de usuario en la sesión.');
    }
  }

  submitReport(): void {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.report.Profesor_id = usuario.id;
      console.log('Profesor ID:', this.report.Profesor_id);

      console.log(
        'Lista de alumnos antes de buscar Apoderado_id:',
        this.alumnos
      );
      console.log('Alumno seleccionado ID:', this.report.Alumno_id);

      const apoderadoId = this.getApoderadoId(Number(this.report.Alumno_id));
      if (apoderadoId !== null) {
        this.report.Apoderado_id = apoderadoId;
        console.log('Apoderado ID:', this.report.Apoderado_id);

        console.log('Datos del reporte antes de enviar:', this.report);
        this.reportService.createReport(this.report).subscribe(
          (response) => {
            console.log('Reporte creado exitosamente:', response);
            swalWithCustomOptions.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Reporte enviado',
            });
            this.router.navigate(['/reportes']); // Redirige a la página de reportes
          },
          (error) => {
            console.error('Error al crear el reporte:', error);
            swalWithCustomOptions.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al enviar el reporte. Inténtalo nuevamente.',
            });
          }
        );
      } else {
        console.error(
          'No se pudo encontrar el apoderado correspondiente al alumno.'
        );
        swalWithCustomOptions.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo encontrar el apoderado correspondiente al alumno.',
        });
      }
    } else {
      console.error('No se encontró información de usuario en la sesión.');
      swalWithCustomOptions.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró información de usuario en la sesión.',
      });
    }
  }

  getApoderadoId(alumnoId: number): number | null {
    console.log('Buscando Apoderado_id para Alumno_id:', alumnoId);
    console.log('Lista de alumnos:', this.alumnos);

    const alumno = this.alumnos.find((a) => a.id === alumnoId);
    if (alumno) {
      console.log('Apoderado encontrado:', alumno.Apoderado_id);
    } else {
      console.log('Alumno no encontrado en la lista de alumnos.');
    }
    return alumno ? alumno.Apoderado_id : null;
  }
}


// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { MenuService } from 'src/app/services/menu.service';
// import { ReportService } from 'src/app/services/report.service';
// import { Router } from '@angular/router';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-reports',
//   templateUrl: './reports.component.html',
//   styleUrls: ['./reports.component.css'],
// })
// export class ReportsComponent implements OnInit, OnDestroy {
//   menuActive = false;
//   menuSubscription: Subscription | undefined;

//   alumnos: any[] = [];
//   report = {
//     Profesor_id: null as number | null,
//     Alumno_id: null as number | null,
//     Apoderado_id: null as number | null,
//     asistencia: false,
//     participacion: false,
//     comprension: false,
//     comportamiento: false,
//     observaciones: '',
//     recomendaciones: '',
//   };

//   constructor(
//     private reportService: ReportService,
//     private router: Router,
//     private menuService: MenuService
//   ) {}

//   ngOnInit(): void {
//     this.fetchAlumnos();
//     this.menuSubscription = this.menuService.menuActive$.subscribe((active) => {
//       this.menuActive = active;
//     });
//   }

//   ngOnDestroy(): void {
//     this.menuSubscription?.unsubscribe();
//   }

//   fetchAlumnos(): void {
//     const usuarioString = sessionStorage.getItem('usuario');
//     if (usuarioString) {
//       const usuario = JSON.parse(usuarioString);
//       const usuarioId = usuario.id as string;

//       this.reportService.obtenerInscripcionesPorProfesorId(usuarioId).subscribe(
//         (inscripciones: any[]) => {
//           console.log(
//             'Respuesta de obtenerInscripcionesPorProfesorId:',
//             inscripciones
//           );
//           const alumnosRegistrados: Set<number> = new Set<number>();

//           inscripciones.forEach((inscripcion) => {
//             const alumnoIdObj = inscripcion as any;
//             let alumnoIdString: string;

//             if (alumnoIdObj.hasOwnProperty('Alumnos_id')) {
//               alumnoIdString = alumnoIdObj.Alumnos_id.toString();
//             } else {
//               console.error(
//                 'El objeto inscripcion no tiene la propiedad "Alumnos_id":',
//                 inscripcion
//               );
//               return;
//             }

//             const alumnoIdNumber: number = parseInt(alumnoIdString, 10);
//             if (!alumnosRegistrados.has(alumnoIdNumber)) {
//               alumnosRegistrados.add(alumnoIdNumber);
//               this.reportService.obtenerAlumnoPorId(alumnoIdString).subscribe(
//                 (alumno: any) => {
//                   console.log('Alumno obtenido:', alumno);
//                   this.alumnos.push(alumno);
//                 },
//                 (error) => {
//                   console.error('Error al obtener alumno por ID:', error);
//                 }
//               );
//             }
//           });
//         },
//         (error) => {
//           console.error(
//             'Error al obtener inscripciones por profesor ID:',
//             error
//           );
//         }
//       );
//     } else {
//       console.error('No se encontró información de usuario en la sesión.');
//     }
//   }

//   submitReport(): void {
//     const usuarioString = sessionStorage.getItem('usuario');
//     if (usuarioString) {
//       const usuario = JSON.parse(usuarioString);
//       this.report.Profesor_id = usuario.id;
//       console.log('Profesor ID:', this.report.Profesor_id);

//       console.log(
//         'Lista de alumnos antes de buscar Apoderado_id:',
//         this.alumnos
//       );
//       console.log('Alumno seleccionado ID:', this.report.Alumno_id);

//       const apoderadoId = this.getApoderadoId(Number(this.report.Alumno_id));
//       if (apoderadoId !== null) {
//         this.report.Apoderado_id = apoderadoId;
//         console.log('Apoderado ID:', this.report.Apoderado_id);

//         console.log('Datos del reporte antes de enviar:', this.report);
//         this.reportService.createReport(this.report).subscribe(
//           (response) => {
//             console.log('Reporte creado exitosamente:', response);
//             Swal.fire({
//               icon: 'success',
//               title: 'Éxito',
//               text: 'Reporte enviado',
//             });
//             this.router.navigate(['/reportes']); // Redirige a la página de reportes
//           },
//           (error) => {
//             console.error('Error al crear el reporte:', error);
//             Swal.fire({
//               icon: 'error',
//               title: 'Error',
//               text: 'Hubo un problema al enviar el reporte. Inténtalo nuevamente.',
//             });
//           }
//         );
//       } else {
//         console.error(
//           'No se pudo encontrar el apoderado correspondiente al alumno.'
//         );
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: 'No se pudo encontrar el apoderado correspondiente al alumno.',
//         });
//       }
//     } else {
//       console.error('No se encontró información de usuario en la sesión.');
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'No se encontró información de usuario en la sesión.',
//       });
//     }
//   }

//   getApoderadoId(alumnoId: number): number | null {
//     console.log('Buscando Apoderado_id para Alumno_id:', alumnoId);
//     console.log('Lista de alumnos:', this.alumnos);

//     const alumno = this.alumnos.find((a) => a.id === alumnoId);
//     if (alumno) {
//       console.log('Apoderado encontrado:', alumno.Apoderado_id);
//     } else {
//       console.log('Alumno no encontrado en la lista de alumnos.');
//     }
//     return alumno ? alumno.Apoderado_id : null;
//   }
// }
