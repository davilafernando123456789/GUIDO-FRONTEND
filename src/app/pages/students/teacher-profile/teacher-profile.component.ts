import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from '../services/courses.service';
import { RecomendacionesService } from 'src/app/services/recomendaciones.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventClickArg } from '@fullcalendar/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface ExtendedProps {
  horarioId: string;
  profesorId: string;
}

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.css'],
})
export class TeacherProfileComponent implements OnInit, OnDestroy {
  menuActive = false;
  menuSubscription: Subscription | undefined;

  profesorId: string | null = null;
  profesor: any;
  horarios: any[] = [];
  recomendaciones: any[] = [];
  usuarioLogueado: any | null = null;
  usuarioId!: string;
  rol!: string;

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay',
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    weekends: false,
    plugins: [dayGridPlugin, timeGridPlugin],
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private recomendacionesService: RecomendacionesService,
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.profesorId = this.route.snapshot.paramMap.get('id');
    if (this.profesorId) {
      this.obtenerProfesor(); // Llama a la función para obtener los detalles del profesor
      this.obtenerRecomendacionesPorProfesor();
    } else {
      console.error('ID de profesor no encontrado en la URL');
    }
    this.getUserData();
    this.menuSubscription = this.menuService.menuActive$.subscribe((active) => {
      this.menuActive = active;
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }

  getUserData() {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const userData = JSON.parse(usuarioString);
      this.usuarioLogueado = {
        usuario: userData.usuario,
        nombre: userData.nombre,
        rol: userData.rol,
        foto: userData.foto,
      };
      this.usuarioId = userData.id;
      this.rol = userData.rol;
    }
  }

  handleEventClick(arg: EventClickArg) {
    console.log('Usuario ID:', this.usuarioId);
    console.log('Rol:', this.rol);
    this.cursoService.verificarSuscripcion(this.usuarioId, this.rol).subscribe(
      (suscripcionActiva) => {
        console.log('Suscripción activa:', suscripcionActiva); // Imprimir el valor de suscripcionActiva
        if (suscripcionActiva) {
          this.navigateToRegistration(arg);
        } else {
          this.router.navigate(['/suscripcion']);
        }
      },
      (error) => {
        console.error('Error al verificar suscripción:', error);
        Swal.fire(
          'Error',
          'No se pudo verificar la suscripción. Inténtalo más tarde.',
          'error'
        );
      }
    );
  }

  obtenerProfesor(): void {
    this.cursoService.obtenerProfesorPorId(this.profesorId!).subscribe(
      (data) => {
        this.profesor = data;
        this.obtenerHorariosProfesor();
      },
      (error) => {
        console.error('Error al obtener el profesor:', error);
      }
    );
  }

  obtenerHorariosProfesor(): void {
    this.cursoService.obtenerHorariosPorProfesor(this.profesorId!).subscribe(
      (data) => {
        this.horarios = data;
        this.calendarOptions.events = this.horarios.map((horario) => ({
          title: horario.titulo,
          start: horario.fecha + 'T' + horario.hora_inicio,
          end: horario.fecha + 'T' + horario.hora_fin,
          extendedProps: {
            horarioId: horario.id,
            profesorId: this.profesorId,
          },
        }));
      },
      (error) => {
        console.error('Error al obtener los horarios del profesor:', error);
      }
    );
  }
  obtenerRecomendacionesPorProfesor(): void {
    this.recomendacionesService
      .obtenerRecomendacionesPorProfesorId(this.profesorId!)
      .subscribe(
        (data) => {
          console.log('Datos recibidos:', data); // Log de los datos recibidos
          this.recomendaciones = data;
          console.log('Recomendaciones asignadas:', this.recomendaciones); // Log de las recomendaciones asignadas
        },
        (error) => {
          console.error(
            'Error al obtener las recomendaciones del profesor:',
            error
          );
        }
      );
  }

  navigateToRegistration($event: EventClickArg): void {
    const eventInfo = $event.event;
    const extendedProps = eventInfo.extendedProps as ExtendedProps;
    const horarioId = extendedProps.horarioId;
    const profesorId = extendedProps.profesorId;

    console.log('Horario ID:', horarioId);
    console.log('Profesor ID:', profesorId);

    this.router.navigate(['/confirmation', horarioId, profesorId]);
  }
}

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { CursoService } from '../services/courses.service';
// import { CalendarOptions } from '@fullcalendar/core';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import { EventClickArg } from '@fullcalendar/core';
// import { Router } from '@angular/router';
// import Swal from 'sweetalert2';

// interface ExtendedProps {
//   horarioId: string;
//   profesorId: string;
// }

// @Component({
//   selector: 'app-teacher-profile',
//   templateUrl: './teacher-profile.component.html',
//   styleUrls: ['./teacher-profile.component.css'],
// })
// export class TeacherProfileComponent implements OnInit {
//   profesorId: string | null = null;
//   profesor: any;
//   horarios: any[] = [];
//   usuarioLogueado: any | null = null;
//   usuarioId!: string;
//   rol!: string;

//   calendarOptions: CalendarOptions = {
//     initialView: 'timeGridWeek',
//     headerToolbar: {
//       left: 'prev,next today',
//       center: 'title',
//       right: 'timeGridWeek,timeGridDay',
//     },
//     slotMinTime: '08:00:00',
//     slotMaxTime: '22:00:00',
//     allDaySlot: false,
//     weekends: false,
//     plugins: [dayGridPlugin, timeGridPlugin],
//     eventClick: this.handleEventClick.bind(this),
//   };

//   constructor(
//     private route: ActivatedRoute,
//     private cursoService: CursoService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.profesorId = this.route.snapshot.paramMap.get('id');
//     if (this.profesorId) {
//       this.obtenerProfesor(); // Llama a la función para obtener los detalles del profesor
//     } else {
//       console.error('ID de profesor no encontrado en la URL');
//     }
//     this.getUserData();
//   }
//   getUserData() {
//     const usuarioString = sessionStorage.getItem('usuario');
//     if (usuarioString) {
//       const userData = JSON.parse(usuarioString);
//       this.usuarioLogueado = {
//         usuario: userData.usuario,
//         nombre: userData.nombre,
//         rol: userData.rol,
//         foto: userData.foto,
//       };
//       this.usuarioId = userData.id;
//       this.rol = userData.rol;
//     }
//   }

//   handleEventClick(arg: EventClickArg) {
//     console.log('Usuario ID:', this.usuarioId);
//     console.log('Rol:', this.rol);
//     this.cursoService.verificarSuscripcion(this.usuarioId, this.rol).subscribe(
//       (suscripcionActiva) => {
//         console.log('Suscripción activa:', suscripcionActiva); // Imprimir el valor de suscripcionActiva
//         if (suscripcionActiva) {
//           this.navigateToRegistration(arg);
//         } else {
//           this.router.navigate(['/suscripcion']);
//         }
//       },
//       (error) => {
//         console.error('Error al verificar suscripción:', error);
//         Swal.fire(
//           'Error',
//           'No se pudo verificar la suscripción. Inténtalo más tarde.',
//           'error'
//         );
//       }
//     );
//   }
//   obtenerProfesor(): void {
//     this.cursoService.obtenerProfesorPorId(this.profesorId!).subscribe(
//       (data) => {
//         this.profesor = data;
//         this.obtenerHorariosProfesor();
//       },
//       (error) => {
//         console.error('Error al obtener el profesor:', error);
//       }
//     );
//   }

//   obtenerHorariosProfesor(): void {
//     this.cursoService.obtenerHorariosPorProfesor(this.profesorId!).subscribe(
//       (data) => {
//         this.horarios = data;
//         this.calendarOptions.events = this.horarios.map((horario) => ({
//           title: horario.titulo,
//           start: horario.fecha + 'T' + horario.hora_inicio,
//           end: horario.fecha + 'T' + horario.hora_fin,
//           extendedProps: {
//             horarioId: horario.id,
//             profesorId: this.profesorId,
//           },
//         }));
//       },
//       (error) => {
//         console.error('Error al obtener los horarios del profesor:', error);
//       }
//     );
//   }

//   navigateToRegistration($event: EventClickArg): void {
//     const eventInfo = $event.event;
//     const extendedProps = eventInfo.extendedProps as ExtendedProps;
//     const horarioId = extendedProps.horarioId;
//     const profesorId = extendedProps.profesorId;

//     console.log('Horario ID:', horarioId);
//     console.log('Profesor ID:', profesorId);

//     this.router.navigate(['/confirmation', horarioId, profesorId]);
//   }
// }
// handleEventClick(arg: EventClickArg) {
//   if (this.usuarioId && this.rol) {
//     this.cursoService.verificarSuscripcion(this.usuarioId, this.rol).subscribe(
//       (suscripcionActiva) => {
//         if (suscripcionActiva) {
//           this.navigateToRegistration(arg);
//         } else {
//           this.router.navigate(['/suscripcion']);
//         }
//       },
//       (error) => {
//         console.error('Error al verificar suscripción:', error);
//         Swal.fire(
//           'Error',
//           'No se pudo verificar la suscripción. Inténtalo más tarde.',
//           'error'
//         );
//       }
//     );
//   } else {
//     console.error('No se pudo obtener el usuario logueado');
//   }
// }
// handleEventClick(arg: EventClickArg) {
//   const usuarioId = this.usuarioId;
//   const rol = this.rol;
//   this.cursoService.verificarSuscripcion(usuarioId, rol).subscribe(
//     (suscripcionActiva) => {
//       if (suscripcionActiva) {
//         this.navigateToRegistration(arg);
//       } else {
//         this.router.navigate(['/suscripcion']);
//       }
//     },
//     (error) => {
//       console.error('Error al verificar suscripción:', error);
//       Swal.fire(
//         'Error',
//         'No se pudo verificar la suscripción. Inténtalo más tarde.',
//         'error'
//       );
//     }
//   );
// }
// handleEventClick(arg: EventClickArg) {
//   const alumnoId = this.alumnoId;
//   this.cursoService.verificarSuscripcion(alumnoId).subscribe(
//     (suscripcionActiva) => {
//       if (suscripcionActiva) {
//         this.navigateToRegistration(arg);
//       } else {
//         this.router.navigate(['/suscripcion']);
//       }
//     },
//     (error) => {
//       console.error('Error al verificar suscripción:', error);
//       Swal.fire('Error', 'No se pudo verificar la suscripción. Inténtalo más tarde.', 'error');
//     }
//   );
// }
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { CursoService } from '../services/courses.service';
// import { CalendarOptions } from '@fullcalendar/core';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import { EventClickArg } from '@fullcalendar/core';
// import { Router, NavigationExtras } from '@angular/router';
// import Swal from 'sweetalert2';

// interface ExtendedProps {
//   horarioId: string;
//   profesorId: string;
// }

// @Component({
//   selector: 'app-teacher-profile',
//   templateUrl: './teacher-profile.component.html',
//   styleUrls: ['./teacher-profile.component.css'],
// })
// export class TeacherProfileComponent implements OnInit {
//   profesorId: string | null = null;
//   profesor: any;
//   horarios: any[] = [];
//   calendarOptions: CalendarOptions = {
//     initialView: 'timeGridWeek',
//     headerToolbar: {
//       left: 'prev,next today',
//       center: 'title',
//       right: 'timeGridWeek,timeGridDay',
//     },
//     slotMinTime: '08:00:00',
//     slotMaxTime: '22:00:00',
//     allDaySlot: false,
//     weekends: false,
//     plugins: [dayGridPlugin, timeGridPlugin],
//     eventClick: this.handleEventClick.bind(this),
//   };

//   constructor(
//     private route: ActivatedRoute,
//     private cursoService: CursoService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.profesorId = this.route.snapshot.paramMap.get('id');
//     if (this.profesorId) {
//       this.obtenerProfesor(); // Llama a la función para obtener los detalles del profesor
//     } else {
//       console.error('ID de profesor no encontrado en la URL');
//     }
//   }

//   obtenerProfesor(): void {
//     this.cursoService.obtenerProfesorPorId(this.profesorId!).subscribe(
//       (data) => {
//         this.profesor = data;
//         this.obtenerHorariosProfesor();
//       },
//       (error) => {
//         console.error('Error al obtener el profesor:', error);
//       }
//     );
//   }

//   handleEventClick(arg: EventClickArg) {
//     this.navigateToRegistration(arg);
//   }
//   obtenerHorariosProfesor(): void {
//     this.cursoService.obtenerHorariosPorProfesor(this.profesorId!).subscribe(
//       (data) => {
//         this.horarios = data;
//         this.calendarOptions.events = this.horarios.map((horario) => ({
//           title: horario.titulo,
//           start: horario.fecha + 'T' + horario.hora_inicio,
//           end: horario.fecha + 'T' + horario.hora_fin,
//           extendedProps: {
//             horarioId: horario.id,
//             profesorId: this.profesorId,
//           },
//         }));
//       },
//       (error) => {
//         console.error('Error al obtener los horarios del profesor:', error);
//       }
//     );
//   }
//   navigateToRegistration($event: EventClickArg): void {
//     const eventInfo = $event.event;
//     const extendedProps = eventInfo.extendedProps as ExtendedProps;
//     const horarioId = extendedProps.horarioId;
//     const profesorId = extendedProps.profesorId;

//     console.log('Horario ID:', horarioId);
//     console.log('Profesor ID:', profesorId);

//     this.router.navigate(['/confirmation', horarioId, profesorId]);
//   }

// }

// obtenerHorariosProfesor(): void {
//   this.cursoService.obtenerHorariosPorProfesor(this.profesorId!).subscribe(
//     (data) => {
//       this.horarios = data;
//       this.calendarOptions.events = this.horarios.map(horario => ({
//         // title: horario.titulo,
//         start: horario.fecha + 'T' + horario.hora_inicio,
//         end: horario.fecha + 'T' + horario.hora_fin
//       }));
//     },
//     (error) => {
//       console.error('Error al obtener los horarios del profesor:', error);
//     }
//   );
// }
