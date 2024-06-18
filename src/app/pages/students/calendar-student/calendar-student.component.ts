import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventClickArg } from '@fullcalendar/core';
import { Router } from '@angular/router';
import { CursoService } from '../services/courses.service';

@Component({
  selector: 'app-calendar-student',
  templateUrl: './calendar-student.component.html',
  styleUrls: ['./calendar-student.component.css'],
})
export class CalendarStudentComponent implements OnInit, OnDestroy {
  menuActive = false;
  menuSubscription: Subscription | undefined;

  alumnoId: string | null = null;
  horarios: any[] = [];
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
    private cursoService: CursoService,
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.getAlumnoIdFromSession();
    this.menuSubscription = this.menuService.menuActive$.subscribe((active) => {
      this.menuActive = active;
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }

  getAlumnoIdFromSession(): void {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.alumnoId = usuario.id as string;
      console.log('ID del alumno:', this.alumnoId);
      this.obtenerHorariosAlumno();
    } else {
      console.error('ID de alumno no encontrado en la sesión');
    }
  }

  obtenerHorariosAlumno(): void {
    this.cursoService.obtenerInscripcionesPorAlumnoId(this.alumnoId!).subscribe(
      (inscripciones: any[]) => {
        console.log('Inscripciones obtenidas:', inscripciones);
        const horarioIds = inscripciones.map(
          (inscripcion) => inscripcion.Horario_id
        );
        console.log('IDs de horarios obtenidos:', horarioIds);

        this.cursoService.obtenerHorariosPorIds(horarioIds).subscribe(
          (horarios: any[]) => {
            console.log('Horarios obtenidos:', horarios);
            this.horarios = horarios;
            this.calendarOptions.events = this.horarios.map((horario) => ({
              //title: "Reservada",
              title: horario.titulo,
              start: horario.fecha + 'T' + horario.hora_inicio,
              end: horario.fecha + 'T' + horario.hora_fin,
            }));
          },
          (error) => {
            console.error('Error al obtener detalles de los horarios:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener inscripciones del alumno:', error);
      }
    );
  }

  handleEventClick(arg: EventClickArg) {
    this.navigateToRegistration(arg);
  }

  navigateToRegistration($event: EventClickArg): void {
    this.router.navigate(['/meetings']);
  }
}
