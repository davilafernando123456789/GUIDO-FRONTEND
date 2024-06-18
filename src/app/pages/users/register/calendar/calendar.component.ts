import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../../students/services/courses.service';
import { CalendarOptions, DateSelectArg, EventApi } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';

interface Horario {
  titulo: string | null;
  dia_semana: number | null;
  hora_inicio: string | null;
  hora_fin: string | null;
  fecha: string | null;
  duracion: number | null;
  profesores_id: number | null;
}

interface EventoSeleccionado {
  startStr: string;
  endStr: string;
  originalColor: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  menuActive = false;
  menuSubscription: Subscription | undefined;

  profesorId: number | null = null;
  selectedEvents: EventoSeleccionado[] = [];
  fechaInicio: string | null = null;
  fechaFin: string | null = null;
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
    height: 'auto', // Ajustar la altura automáticamente
    contentHeight: 'auto',
    plugins: [timeGridPlugin, interactionPlugin],
    selectable: true,
    unselectAuto: false,
    select: this.handleDateSelect.bind(this),
    slotDuration: '01:00:00',
    slotLabelInterval: '01:00:00',
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false,
      hour12: false,
    },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.profesorId = usuario.id as number;
    } else {
      console.log('Invalid usuario');
    }
    this.menuSubscription = this.menuService.menuActive$.subscribe((active) => {
      this.menuActive = active;
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }

  handleDateSelect(selectInfo: DateSelectArg): void {
    console.log('handleDateSelect', selectInfo);
    const start = new Date(selectInfo.startStr);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // Añade 1 hora

    const startStr = start.toISOString();
    const endStr = end.toISOString();

    console.log('Selected range:', startStr, endStr);

    const calendarApi = selectInfo.view.calendar;
    const defaultBackgroundColor = '#FFFFFF'; // Color de fondo predeterminado

    const eventIndex = this.selectedEvents.findIndex((event) => {
      return event.startStr === startStr && event.endStr === endStr;
    });

    if (eventIndex === -1) {
      // Si el evento no está seleccionado, lo añadimos a la lista y lo coloreamos
      this.selectedEvents.push({
        startStr,
        endStr,
        originalColor: defaultBackgroundColor,
      });
      calendarApi.addEvent({
        start: startStr,
        end: endStr,
        display: 'background',
        color: '#fffb00', // Color de selección
      });

      console.log('Evento añadido:', { startStr, endStr });

      // Cambiar el color del espacio seleccionado y mostrar el intervalo de horas
      this.highlightSelectedSlot(selectInfo, '#fffb00', '#FFFFFF'); // Color oscuro con texto blanco
    } else {
      // Si el evento ya está seleccionado, lo eliminamos de la lista y lo descoloreamos
      const deselectedEvent = this.selectedEvents[eventIndex];
      this.selectedEvents.splice(eventIndex, 1);
      const events = calendarApi.getEvents();
      for (let event of events) {
        if (
          event.start?.toISOString() === startStr &&
          event.end?.toISOString() === endStr
        ) {
          event.remove(); // Elimina el evento seleccionado
          console.log('Evento eliminado:', { startStr, endStr });
          break;
        }
      }
    }
  }

  highlightSelectedSlot(
    selectInfo: DateSelectArg,
    bgColor: string,
    textColor: string
  ): void {
    const { start, end } = selectInfo;
    const calendarApi = selectInfo.view.calendar;
    const events = calendarApi.getEvents();
    const matchingEvents = events.filter(
      (event) =>
        event.start && event.end && event.start <= start && event.end >= end
    );

    const startStr = new Date(start).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const endStr = new Date(end).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const title = `${startStr} - ${endStr}`;

    if (matchingEvents.length > 0) {
      matchingEvents.forEach((event) => {
        console.log('Evento encontrado para destacar:', event);
        event.setProp('backgroundColor', bgColor);
        event.setProp('textColor', textColor);
        event.setProp('title', title);
      });
    } else {
      console.log('No se encontró el evento para destacar.');
    }
  }

  guardarHorarios(): void {
    if (!this.profesorId) {
      console.error('Profesores_id no está definido');
      return;
    }

    if (!this.fechaInicio || !this.fechaFin) {
      console.error('Por favor, seleccione las fechas de inicio y fin');
      return;
    }

    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.cursoService.verificarSuscripcion(usuario.id, usuario.rol).subscribe(
        (suscripcionActiva) => {
          if (suscripcionActiva) {
            this.procederConGuardadoDeHorarios();
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
    } else {
      this.router.navigate(['/suscripcion']);
    }
  }

  procederConGuardadoDeHorarios(): void {
    const fechaInicio = new Date(this.fechaInicio!);
    const fechaFin = new Date(this.fechaFin!);
    let horariosRegistrados = true;

    // Envía los horarios seleccionados al servicio
    this.selectedEvents.forEach(async (event) => {
      const diaInicio = new Date(event.startStr);
      const diaFin = new Date(event.endStr);
      const diaSemana = diaInicio.getDay();

      let fechaActual = new Date(fechaInicio);
      while (fechaActual <= fechaFin) {
        if (fechaActual.getDay() === diaSemana) {
          const horaInicioFormateada = diaInicio.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          const horaFinFormateada = diaFin.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          const payload = {
            Profesores_id: this.profesorId,
            horarios: [
              {
                titulo: 'Disponible',
                dia_semana: diaSemana,
                hora_inicio: `${fechaActual
                  .toISOString()
                  .substring(0, 10)} ${horaInicioFormateada}`,
                hora_fin: `${fechaActual
                  .toISOString()
                  .substring(0, 10)} ${horaFinFormateada}`,
                fecha: fechaActual.toISOString().substring(0, 10),
                duracion: null,
                profesores_id: this.profesorId ?? 1,
              },
            ],
          };

          try {
            const response = await this.cursoService
              .registrarHorario(payload)
              .toPromise();
            console.log('Horarios registrados exitosamente:', response);
          } catch (error) {
            console.error('Error al registrar horario:', error);
            horariosRegistrados = false;
          }
        }
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
    });

    // Limpiar campos después de registrar los horarios
    this.selectedEvents = [];
    this.fechaInicio = null;
    this.fechaFin = null;

    if (horariosRegistrados) {
      Swal.fire({
        icon: 'success',
        title: 'Horarios registrados exitosamente',
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        this.router.navigate(['/home']);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar los horarios',
      });
    }
  }
}

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CursoService } from '../../../students/services/courses.service';
// import { CalendarOptions, DateSelectArg, EventApi } from '@fullcalendar/core';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import Swal from 'sweetalert2';

// interface Horario {
//   titulo: string | null;
//   dia_semana: number | null;
//   hora_inicio: string | null;
//   hora_fin: string | null;
//   fecha: string | null;
//   duracion: number | null;
//   profesores_id: number | null;
// }

// interface EventoSeleccionado {
//   startStr: string;
//   endStr: string;
//   originalColor: string; // Nuevo campo para guardar el color original
// }

// @Component({
//   selector: 'app-calendar',
//   templateUrl: './calendar.component.html',
//   styleUrls: ['./calendar.component.css'],
// })
// export class CalendarComponent implements OnInit {
//   profesorId: number | null = null;
//   selectedEvents: EventoSeleccionado[] = [];
//   fechaInicio: string | null = null;
//   fechaFin: string | null = null;
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
//     plugins: [timeGridPlugin, interactionPlugin],
//     selectable: true,
//     unselectAuto: false,
//     select: this.handleDateSelect.bind(this),
//   };

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private cursoService: CursoService
//   ) {}

//   ngOnInit(): void {
//     const usuarioString = sessionStorage.getItem('usuario');
//     if (usuarioString) {
//       const usuario = JSON.parse(usuarioString);
//       this.profesorId = usuario.id as number;
//     } else {
//       console.log('Invalid usuario');
//     }
//   }

//   handleDateSelect(selectInfo: DateSelectArg): void {
//     const startStr = selectInfo.startStr;
//     const endStr = selectInfo.endStr;

//     const calendarApi = selectInfo.view.calendar;
//     const defaultBackgroundColor = '#FBB311'; // Color de fondo predeterminado
//     const alternateBackgroundColor = '#ffc107'; // Color de fondo alternativo

//     const eventIndex = this.selectedEvents.findIndex((event) => {
//       return event.startStr === startStr && event.endStr === endStr;
//     });

//     if (eventIndex === -1) {
//       // Si el evento no está seleccionado, lo añadimos a la lista y lo coloreamos
//       this.selectedEvents.push({
//         startStr,
//         endStr,
//         originalColor: defaultBackgroundColor,
//       });
//       calendarApi.addEvent({
//         start: startStr,
//         end: endStr,
//         display: 'background',
//         color: '#35502d', // Color de selección
//       });
//     } else {
//       // Si el evento ya está seleccionado, lo eliminamos de la lista y lo descoloreamos
//       const deselectedEvent = this.selectedEvents[eventIndex];
//       this.selectedEvents.splice(eventIndex, 1);
//       calendarApi.getEvents().forEach((event: EventApi) => {
//         if (
//           event.start?.toISOString() === startStr &&
//           event.end?.toISOString() === endStr
//         ) {
//           event.setProp('display', false); // Oculta el evento
//           event.setProp('color', deselectedEvent.originalColor); // Restaura el color original
//         }
//       });
//     }
//   }

//   guardarHorarios(): void {
//     if (!this.profesorId) {
//       console.error('Profesores_id no está definido');
//       return;
//     }

//     if (!this.fechaInicio || !this.fechaFin) {
//       console.error('Por favor, seleccione las fechas de inicio y fin');
//       return;
//     }

//     const usuarioString = sessionStorage.getItem('usuario');
//     if (usuarioString) {
//       const usuario = JSON.parse(usuarioString);
//       this.cursoService.verificarSuscripcion(usuario.id, usuario.rol).subscribe(
//         (suscripcionActiva) => {
//           if (suscripcionActiva) {
//             this.procederConGuardadoDeHorarios();
//           } else {
//             this.router.navigate(['/suscripcion']);
//           }
//         },
//         (error) => {
//           console.error('Error al verificar suscripción:', error);
//           Swal.fire(
//             'Error',
//             'No se pudo verificar la suscripción. Inténtalo más tarde.',
//             'error'
//           );
//         }
//       );
//     } else {
//       this.router.navigate(['/suscripcion']);
//     }
//   }

//   procederConGuardadoDeHorarios(): void {
//     const fechaInicio = new Date(this.fechaInicio!);
//     const fechaFin = new Date(this.fechaFin!);
//     let horariosRegistrados = true;

//     // Envía los horarios seleccionados al servicio
//     this.selectedEvents.forEach(async (event) => {
//       const diaInicio = new Date(event.startStr);
//       const diaFin = new Date(event.endStr);
//       const diaSemana = diaInicio.getDay();

//       let fechaActual = new Date(fechaInicio);
//       while (fechaActual <= fechaFin) {
//         if (fechaActual.getDay() === diaSemana) {
//           const horaInicioFormateada = diaInicio.toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           });
//           const horaFinFormateada = diaFin.toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           });

//           const payload = {
//             Profesores_id: this.profesorId,
//             horarios: [
//               {
//                 titulo: 'Disponible',
//                 dia_semana: diaSemana,
//                 hora_inicio: `${fechaActual
//                   .toISOString()
//                   .substring(0, 10)} ${horaInicioFormateada}`,
//                 hora_fin: `${fechaActual
//                   .toISOString()
//                   .substring(0, 10)} ${horaFinFormateada}`,
//                 fecha: fechaActual.toISOString().substring(0, 10),
//                 duracion: null,
//                 profesores_id: this.profesorId ?? 1,
//               },
//             ],
//           };

//           try {
//             const response = await this.cursoService
//               .registrarHorario(payload)
//               .toPromise();
//             console.log('Horarios registrados exitosamente:', response);
//           } catch (error) {
//             console.error('Error al registrar horario:', error);
//             horariosRegistrados = false;
//           }
//         }
//         fechaActual.setDate(fechaActual.getDate() + 1);
//       }
//     });

//     // Limpiar campos después de registrar los horarios
//     this.selectedEvents = [];
//     this.fechaInicio = null;
//     this.fechaFin = null;

//     if (horariosRegistrados) {
//       Swal.fire({
//         icon: 'success',
//         title: 'Horarios registrados exitosamente',
//         showConfirmButton: false,
//         timer: 3000,
//       }).then(() => {
//         this.router.navigate(['/home']);
//       });
//     } else {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error al registrar los horarios',
//       });
//     }
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CursoService } from '../../../students/services/courses.service';
// import { CalendarOptions, DateSelectArg, EventApi } from '@fullcalendar/core';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import Swal from 'sweetalert2';

// interface Horario {
//   titulo: string | null;
//   dia_semana: number | null;
//   hora_inicio: string | null;
//   hora_fin: string | null;
//   fecha: string | null;
//   duracion: number | null;
//   profesores_id: number | null;
// }

// interface EventoSeleccionado {
//   startStr: string;
//   endStr: string;
//   originalColor: string; // Nuevo campo para guardar el color original
// }

// @Component({
//   selector: 'app-calendar',
//   templateUrl: './calendar.component.html',
//   styleUrls: ['./calendar.component.css'],
// })
// export class CalendarComponent implements OnInit {
//   profesorId: number | null = null;
//   selectedEvents: EventoSeleccionado[] = [];
//   fechaInicio: string | null = null;
//   fechaFin: string | null = null;
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
//     plugins: [timeGridPlugin, interactionPlugin],
//     selectable: true,
//     unselectAuto: false,
//     select: this.handleDateSelect.bind(this),
//   };

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private cursoService: CursoService
//   ) {}
//   ngOnInit(): void {
//     const usuarioString = sessionStorage.getItem('usuario');
//     if (usuarioString) {
//       const usuario = JSON.parse(usuarioString);
//       this.profesorId = usuario.id as number;
//     } else {
//       console.log('Invalid usuario');
//     }
//   }
//   handleDateSelect(selectInfo: DateSelectArg): void {
//     const startStr = selectInfo.startStr;
//     const endStr = selectInfo.endStr;

//     const calendarApi = selectInfo.view.calendar;
//     const defaultBackgroundColor = '#FBB311'; // Color de fondo predeterminado
//     const alternateBackgroundColor = '#ffc107'; // Color de fondo alternativo

//     const eventIndex = this.selectedEvents.findIndex((event) => {
//       return event.startStr === startStr && event.endStr === endStr;
//     });

//     if (eventIndex === -1) {
//       // Si el evento no está seleccionado, lo añadimos a la lista y lo coloreamos
//       this.selectedEvents.push({
//         startStr,
//         endStr,
//         originalColor: defaultBackgroundColor,
//       });
//       calendarApi.addEvent({
//         start: startStr,
//         end: endStr,
//         display: 'background',
//         color: '#35502d', // Color de selección
//       });
//     } else {
//       // Si el evento ya está seleccionado, lo eliminamos de la lista y lo descoloreamos
//       const deselectedEvent = this.selectedEvents[eventIndex];
//       this.selectedEvents.splice(eventIndex, 1);
//       calendarApi.getEvents().forEach((event: EventApi) => {
//         if (
//           event.start?.toISOString() === startStr &&
//           event.end?.toISOString() === endStr
//         ) {
//           event.setProp('display', false); // Oculta el evento
//           event.setProp('color', deselectedEvent.originalColor); // Restaura el color original
//         }
//       });
//     }
//   }
//   guardarHorarios(): void {
//     if (!this.profesorId) {
//       console.error('Profesores_id no está definido');
//       return;
//     }

//     if (!this.fechaInicio || !this.fechaFin) {
//       console.error('Por favor, seleccione las fechas de inicio y fin');
//       return;
//     }

//     const fechaInicio = new Date(this.fechaInicio);
//     const fechaFin = new Date(this.fechaFin);
//     let horariosRegistrados = true;

//     // Envía los horarios seleccionados al servicio
//     this.selectedEvents.forEach(async (event) => {
//       const diaInicio = new Date(event.startStr);
//       const diaFin = new Date(event.endStr);
//       const diaSemana = diaInicio.getDay();

//       let fechaActual = new Date(fechaInicio);
//       while (fechaActual <= fechaFin) {
//         if (fechaActual.getDay() === diaSemana) {
//           const horaInicioFormateada = diaInicio.toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           });
//           const horaFinFormateada = diaFin.toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           });

//           const payload = {
//             Profesores_id: this.profesorId,
//             horarios: [
//               {
//                 titulo: 'Disponible',
//                 dia_semana: diaSemana,
//                 hora_inicio: `${fechaActual
//                   .toISOString()
//                   .substring(0, 10)} ${horaInicioFormateada}`,
//                 hora_fin: `${fechaActual
//                   .toISOString()
//                   .substring(0, 10)} ${horaFinFormateada}`,
//                 fecha: fechaActual.toISOString().substring(0, 10),
//                 duracion: null,
//                 profesores_id: this.profesorId ?? 1,
//               },
//             ],
//           };

//           try {
//             const response = await this.cursoService
//               .registrarHorario(payload)
//               .toPromise();
//             console.log('Horarios registrados exitosamente:', response);
//           } catch (error) {
//             console.error('Error al registrar horario:', error);
//             horariosRegistrados = false;
//           }
//         }
//         fechaActual.setDate(fechaActual.getDate() + 1);
//       }
//     });

//     // Limpiar campos después de registrar los horarios
//     this.selectedEvents = [];
//     this.fechaInicio = null;
//     this.fechaFin = null;

//     if (horariosRegistrados) {
//       Swal.fire({
//         icon: 'success',
//         title: 'Horarios registrados exitosamente',
//         showConfirmButton: false,
//         timer: 3000,
//       }).then(() => {
//         this.router.navigate(['/home']);
//       });
//     } else {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error al registrar los horarios',
//       });
//     }
//   }
// }

//   if (horariosRegistrados) {
//     alert('Horarios registrados exitosamente');
//     this.router.navigate(['/home']);
//   } else {
//     alert('Error al registrar los horarios');
//   }
// }
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CursoService } from '../../../students/services/courses.service';
// import { CalendarOptions, DateSelectArg, EventApi } from '@fullcalendar/core';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';

// interface Horario {
//   titulo: string | null;
//   dia_semana: number | null;
//   hora_inicio: string | null;
//   hora_fin: string | null;
//   fecha: string | null;
//   duracion: number | null;
//   profesores_id: number | null;
// }

// interface EventoSeleccionado {
//   startStr: string;
//   endStr: string;
//   originalColor: string; // Nuevo campo para guardar el color original
// }

// @Component({
//   selector: 'app-calendar',
//   templateUrl: './calendar.component.html',
//   styleUrls: ['./calendar.component.css']
// })
// export class CalendarComponent implements OnInit {
//   profesorId: number | null = null;
//   selectedEvents: EventoSeleccionado[] = [];
//   calendarOptions: CalendarOptions = {
//     initialView: 'timeGridWeek',
//     headerToolbar: {
//       left: 'prev,next today',
//       center: 'title',
//       right: 'timeGridWeek,timeGridDay'
//     },
//     slotMinTime: '08:00:00',
//     slotMaxTime: '22:00:00',
//     allDaySlot: false,
//     weekends: false,
//     plugins: [timeGridPlugin, interactionPlugin],
//     selectable: true,
//     unselectAuto: false,
//     select: this.handleDateSelect.bind(this)
//   };

//   constructor(private route: ActivatedRoute, private router: Router, private cursoService: CursoService) { }

//   ngOnInit(): void {
//     const profesorIdParam = this.route.snapshot.paramMap.get('profesorId');
//     if (profesorIdParam !== null) {
//       this.profesorId = parseInt(profesorIdParam, 10);
//     }
//   }
//   handleDateSelect(selectInfo: DateSelectArg): void {
//     const startStr = selectInfo.startStr;
//     const endStr = selectInfo.endStr;

//     const calendarApi = selectInfo.view.calendar;
//     const defaultBackgroundColor = '#FBB311'; // Color de fondo predeterminado
//     const alternateBackgroundColor = '#ffc107'; // Color de fondo alternativo

//     const eventIndex = this.selectedEvents.findIndex(event => {
//       return event.startStr === startStr && event.endStr === endStr;
//     });

//     if (eventIndex === -1) {
//       // Si el evento no está seleccionado, lo añadimos a la lista y lo coloreamos
//       this.selectedEvents.push({ startStr, endStr, originalColor: defaultBackgroundColor });
//       calendarApi.addEvent({
//         start: startStr,
//         end: endStr,
//         display: 'background',
//         color: '#35502d' // Color de selección
//       });
//     } else {
//       // Si el evento ya está seleccionado, lo eliminamos de la lista y lo descoloreamos
//       const deselectedEvent = this.selectedEvents[eventIndex];
//       this.selectedEvents.splice(eventIndex, 1);
//       calendarApi.getEvents().forEach((event: EventApi) => {
//         if (event.start?.toISOString() === startStr && event.end?.toISOString() === endStr) {
//           event.setProp('display', false); // Oculta el evento
//           event.setProp('color', deselectedEvent.originalColor); // Restaura el color original
//         }
//       });
//     }
//   }

//   guardarHorarios(): void {
//     if (!this.profesorId) {
//       console.error('Profesores_id no está definido');
//       return;
//     }

//     // Envía los horarios seleccionados al servicio
//     this.selectedEvents.forEach(async (event) => {
//       const payload = {
//         Profesores_id: this.profesorId,
//         horarios: [{
//           titulo: 'Disponible',
//           dia_semana: new Date(event.startStr).getDay(),
//           hora_inicio: event.startStr,
//           hora_fin: event.endStr,
//           fecha: event.startStr.substring(0, 10),
//           duracion: null,
//           profesores_id: this.profesorId ?? 1
//         }]
//       };

//       try {
//         const response = await this.cursoService.registrarHorario(payload).toPromise();
//         console.log('Horario registrado exitosamente:', response);
//       } catch (error) {
//         console.error('Error al registrar horario:', error);
//       }
//     });

//     // Limpiar la lista de eventos seleccionados después de enviarlos
//     this.selectedEvents = [];
//     this.router.navigate(['/conversations']);
//   }
// }
