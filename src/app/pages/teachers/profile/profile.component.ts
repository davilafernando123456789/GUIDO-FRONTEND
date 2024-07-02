import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CursoService } from '../../students/services/courses.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventClickArg } from '@fullcalendar/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  menuActive = false;
  menuSubscription: Subscription | undefined;

  profesorId: string | null = null;
  profesor: any;
  horarios: any[] = [];
  editMode = false;
  selectedFile: File | null = null;

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay',
    },
    slotMinTime: '08:00:00', // Hora de inicio personalizada
    slotMaxTime: '22:00:00', // Hora de finalización personalizada
    allDaySlot: false,
    weekends: false, // Ocultar los fines de semana
    plugins: [dayGridPlugin, timeGridPlugin],
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cursoService: CursoService,
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.profesorId = usuario.id as string;
      this.obtenerProfesor(); // Llama a la función para obtener los detalles del profesor
    } else {
      console.error('ID de profesor no encontrado en la sesión');
    }
    this.menuSubscription = this.menuService.menuActive$.subscribe((active) => {
      this.menuActive = active;
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
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

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  guardarCambios() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      this.http
        .post<any>('http://3.84.155.125:4000/api/imagen/upload-image', formData)
        .subscribe(
          (response) => {
            this.profesor.foto = response.imageUrl;
            this.actualizarProfesor();
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
      this.actualizarProfesor();
    }
  }

  actualizarProfesor() {
    this.cursoService
      .actualizarProfesor(this.profesorId!, this.profesor)
      .subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Perfil actualizado correctamente',
            showConfirmButton: false,
            timer: 3000,
          });
          this.editMode = false; // Salir del modo de edición
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar perfil',
            showConfirmButton: false,
            timer: 3000,
          });
          console.error(error);
        }
      );
  }

  handleEventClick(arg: EventClickArg) {
    // this.navigateToRegistration(arg);
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
}