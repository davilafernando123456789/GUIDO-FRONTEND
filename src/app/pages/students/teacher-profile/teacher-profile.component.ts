import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from '../services/courses.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventClickArg } from '@fullcalendar/core';
import { Router, NavigationExtras } from '@angular/router';
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
export class TeacherProfileComponent implements OnInit {
  profesorId: string | null = null;
  profesor: any;
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
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profesorId = this.route.snapshot.paramMap.get('id');
    if (this.profesorId) {
      this.obtenerProfesor(); // Llama a la función para obtener los detalles del profesor
    } else {
      console.error('ID de profesor no encontrado en la URL');
    }
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

  handleEventClick(arg: EventClickArg) {
    this.navigateToRegistration(arg);
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