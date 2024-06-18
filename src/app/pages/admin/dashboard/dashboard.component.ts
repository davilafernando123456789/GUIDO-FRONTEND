
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';

import { AdminService } from '../admin.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  menuActive = false;
  menuSubscription: Subscription | undefined;

  profesoresPorMes: { mes: string, total: number }[] = [];
  alumnosPorMes: { mes: string, total: number }[] = [];
  totalProfesores: number = 0;
  totalInscripciones: number = 0;
  totalAlumnos: number = 0;
  ultimosProfesoresInscritos: number = 0;
  ultimosAlumnosInscritos: number = 0;

  constructor(private adminService: AdminService, private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuSubscription = this.menuService.menuActive$.subscribe(active => {
      this.menuActive = active;
    });
    this.getTotalProfesores();
    this.getTotalInscripciones();
    this.getTotalAlumnos();
    this.getUltimosProfesoresInscritos();
    this.getUltimosAlumnosInscritos();
    this.getProfesoresInscritosPorMes();
    this.getAlumnosInscritosPorMes();
  }
 ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }
  getTotalProfesores(): void {
    this.adminService.obtenerProfesores().subscribe(
      (response) => {
        this.totalProfesores = response.length;
      },
      (error) => {
        console.error('Error al obtener el total de profesores:', error);
      }
    );
  }

  getTotalInscripciones(): void {
    this.adminService.obtenerInscripciones().subscribe(
      (response) => {
        this.totalInscripciones = response.length;
      },
      (error) => {
        console.error('Error al obtener el total de inscripciones:', error);
      }
    );
  }

  getTotalAlumnos(): void {
    this.adminService.obtenerAlumnos().subscribe(
      (response) => {
        this.totalAlumnos = response.length;
      },
      (error) => {
        console.error('Error al obtener el total de alumnos:', error);
      }
    );
  }
  getUltimosProfesoresInscritos(): void {
    // Fecha de inicio de la última semana
    const fechaInicioSemana = new Date();
    fechaInicioSemana.setDate(fechaInicioSemana.getDate() - 7);

    this.adminService.obtenerProfesores().subscribe(
      (response) => {
        // Filtrar los profesores inscritos en la última semana
        this.ultimosProfesoresInscritos = response.filter((profesor: any) => {
          const fechaCreacion = new Date(profesor.createdAt);
          return fechaCreacion >= fechaInicioSemana;
        }).length;
      },
      (error) => {
        console.error(
          'Error al obtener la cantidad de últimos profesores inscritos:',
          error
        );
      }
    );
  }

  getUltimosAlumnosInscritos(): void {
    // Fecha de inicio de la última semana
    const fechaInicioSemana = new Date();
    fechaInicioSemana.setDate(fechaInicioSemana.getDate() - 7);

    this.adminService.obtenerAlumnos().subscribe(
      (response) => {
        // Filtrar los alumnos inscritos en la última semana
        this.ultimosAlumnosInscritos = response.filter((alumno: any) => {
          const fechaCreacion = new Date(alumno.createdAt);
          return fechaCreacion >= fechaInicioSemana;
        }).length;
      },
      (error) => {
        console.error(
          'Error al obtener la cantidad de últimos alumnos inscritos:',
          error
        );
      }
    );
  }
  getProfesoresInscritosPorMes(): void {
    const data: { [key: string]: number } = {};

    // Obtener datos de inscripción de profesores por mes
    this.adminService.obtenerProfesores().subscribe(
      (response) => {
        response.forEach((profesor: any) => {
          const fechaCreacion = new Date(profesor.createdAt);
          const mes = fechaCreacion.toLocaleString('default', {
            month: 'long',
          });

          // Incrementar el contador para el mes correspondiente
          if (data[mes]) {
            data[mes]++;
          } else {
            data[mes] = 1;
          }
        });

        // Convertir los datos a un formato adecuado para la tabla
        this.profesoresPorMes = Object.keys(data).map(mes => ({ mes, total: data[mes] }));
      },
      (error) => {
        console.error(
          'Error al obtener los datos de inscripción de profesores:',
          error
        );
      }
    );
  }
  getAlumnosInscritosPorMes(): void {
    const data: { [key: string]: number } = {};

    // Obtener datos de inscripción de alumno por mes
    this.adminService.obtenerAlumnos().subscribe(
      (response) => {
        response.forEach((alumno: any) => {
          const fechaCreacion = new Date(alumno.createdAt);
          const mes = fechaCreacion.toLocaleString('default', {
            month: 'long',
          });

          // Incrementar el contador para el mes correspondiente
          if (data[mes]) {
            data[mes]++;
          } else {
            data[mes] = 1;
          }
        });

        // Convertir los datos a un formato adecuado para la tabla
        this.alumnosPorMes = Object.keys(data).map(mes => ({ mes, total: data[mes] }));
      },
      (error) => {
        console.error(
          'Error al obtener los datos de inscripción de alumno:',
          error
        );
      }
    );
  }
}
