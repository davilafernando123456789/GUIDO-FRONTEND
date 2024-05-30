import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  notificaciones: any[] = [];
  usuarioId: number | null = null; // ID del usuario actualmente logueado
  rolId: number | null = null; // Rol del usuario actualmente logueado

  constructor(
    private notificacionesService: NotificacionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener los datos de usuario desde sessionStorage
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.usuarioId = usuario.id;
      this.rolId = usuario.rol;
      this.obtenerNotificaciones();
    } else {
      console.error('No se encontró información de usuario en la sesión.');
    }
  }

  obtenerNotificaciones(): void {
    if (this.usuarioId) {
      this.notificacionesService.obtenerNotificaciones(this.usuarioId).subscribe(
        (data: any[]) => {
          this.filtrarNotificaciones(data);
        },
        (error) => {
          console.error('Error al obtener notificaciones:', error);
        }
      );
    } else {
      console.error('No se pudo obtener el ID del usuario.');
    }
  }

  filtrarNotificaciones(data: any[]): void {
    if (this.rolId === 1) {
      // Mostrar solo notificaciones de tipo 'mensaje_nuevo' para rol 1
      this.notificaciones = data.filter(notificacion => notificacion.tipo === 'mensaje_nuevo');
    } else if (this.rolId === 2) {
      // Mostrar todas las notificaciones para rol 2
      this.notificaciones = data;
    } else {
      console.error('Rol no reconocido:', this.rolId);
    }

    // Ordenar notificaciones por fecha de creación (más recientes primero)
    this.notificaciones.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  marcarComoLeido(id: number): void {
    this.notificacionesService.marcarComoLeido(id).subscribe(
      (response) => {
        this.obtenerNotificaciones();
      },
      (error) => {
        console.error('Error al marcar como leído:', error);
      }
    );
  }

  handleNotificacionClick(notificacion: any): void {
    if (this.rolId === 1) {
      this.router.navigate(['/conversation']);
    } else if (this.rolId === 2) {
      if (notificacion.tipo === 'clase_registrada') {
        this.router.navigate(['/calendarTeacher']);
      } else {
        this.router.navigate(['/conversations']);
      }
    }
  }

  formatFecha(fecha: string): string {
    return moment(fecha).format('hh:mm A - DD/MM/YYYY');
  }
}

// import { Component, OnInit } from '@angular/core';
// import { NotificacionesService } from 'src/app/services/notificaciones.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-notificaciones',
//   templateUrl: './notificaciones.component.html',
//   styleUrls: ['./notificaciones.component.css']
// })
// export class NotificacionesComponent implements OnInit {
//   notificaciones: any[] = [];
//   usuarioId: number | null = null; // ID del usuario actualmente logueado
//   rolId: number | null = null; // Rol del usuario actualmente logueado

//   constructor(
//     private notificacionesService: NotificacionesService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     // Obtener los datos de usuario desde sessionStorage
//     const usuarioString = sessionStorage.getItem('usuario');
//     if (usuarioString) {
//       const usuario = JSON.parse(usuarioString);
//       this.usuarioId = usuario.id;
//       this.rolId = usuario.rol;
//       this.obtenerNotificaciones();
//     } else {
//       console.error('No se encontró información de usuario en la sesión.');
//     }
//   }

//   obtenerNotificaciones(): void {
//     if (this.usuarioId) {
//       this.notificacionesService.obtenerNotificaciones(this.usuarioId).subscribe(
//         (data: any[]) => {
//           this.filtrarNotificaciones(data);
//         },
//         (error) => {
//           console.error('Error al obtener notificaciones:', error);
//         }
//       );
//     } else {
//       console.error('No se pudo obtener el ID del usuario.');
//     }
//   }

//   filtrarNotificaciones(data: any[]): void {
//     if (this.rolId === 1) {
//       // Mostrar solo notificaciones de tipo 'mensaje_nuevo' para rol 1
//       this.notificaciones = data.filter(notificacion => notificacion.tipo === 'mensaje_nuevo');
//     } else if (this.rolId === 2) {
//       // Mostrar todas las notificaciones para rol 2
//       this.notificaciones = data;
//     } else {
//       console.error('Rol no reconocido:', this.rolId);
//     }
//   }

//   marcarComoLeido(id: number): void {
//     this.notificacionesService.marcarComoLeido(id).subscribe(
//       (response) => {
//         this.obtenerNotificaciones();
//       },
//       (error) => {
//         console.error('Error al marcar como leído:', error);
//       }
//     );
//   }

//   handleNotificacionClick(notificacion: any): void {
//     if (this.rolId === 1) {
//       this.router.navigate(['/conversation']);
//     } else if (this.rolId === 2) {
//       if (notificacion.tipo === 'clase_registrada') {
//         this.router.navigate(['/calendarTeacher']);
//       } else {
//         this.router.navigate(['/conversations']);
//       }
//     }
//   }
// }
