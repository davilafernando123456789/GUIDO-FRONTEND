import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { CursoService } from '../services/courses.service';
import { Router } from '@angular/router';
import { RecomendacionesService } from 'src/app/services/recomendaciones.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  menuActive = false;
  menuSubscription: Subscription | undefined;

  profesores: any[] = [];
  mostrarCantidad: number = 10;
  cargandoMas: boolean = false;
  filtroEspecialidad: string = '';
  usuarioLogueado: any | null = null;

  constructor(
    private router: Router,
    private cursoService: CursoService,
    private recomendacionesService: RecomendacionesService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.obtenerProfesores();
    this.menuSubscription = this.menuService.menuActive$.subscribe((active) => {
      this.menuActive = active;
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }

  obtenerProfesores(): void {
    this.cursoService.obtenerProfesores().subscribe(
      (data) => {
        this.profesores = data
          .filter((profesor) =>
            profesor.especialidad
              .toLowerCase()
              .includes(this.filtroEspecialidad.toLowerCase())
          )
          .slice(0, this.mostrarCantidad);
        this.obtenerRecomendaciones();
      },
      (error) => {
        console.error('Error al obtener profesores:', error);
      }
    );
  }

  obtenerRecomendaciones(): void {
    this.recomendacionesService.obtenerRecomendaciones().subscribe(
      (data) => {
        this.profesores.forEach((profesor) => {
          const recomendaciones = data.filter(
            (recomendacion) => recomendacion.Profesores_id === profesor.id
          );
          const totalEstrellas = recomendaciones.reduce(
            (acc, recomendacion) => acc + recomendacion.estrellas,
            0
          );
          const promedioEstrellas = recomendaciones.length
            ? totalEstrellas / recomendaciones.length
            : 0;
          profesor.estrellas = promedioEstrellas;
        });
      },
      (error) => {
        console.error('Error al obtener recomendaciones:', error);
      }
    );
  }

  cargarMasProfesores(): void {
    this.cargandoMas = true;
    this.mostrarCantidad += 10;
    this.obtenerProfesores();
    this.cargandoMas = false;
  }

  filtrarPorEspecialidad(especialidad: string): void {
    this.filtroEspecialidad = especialidad;
    this.mostrarCantidad = 10;
    this.obtenerProfesores();
  }

  buscarPorEspecialidad(): void {
    this.obtenerProfesores();
  }

  irAPerfil(id: string): void {
    this.router.navigate(['/teacherProfile', id]);
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
    }
  }
}

// import { Component, OnInit } from '@angular/core';
// import { CursoService } from '../services/courses.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css'],
// })
// export class HomeComponent implements OnInit {
//   profesores: any[] = [];
//   mostrarCantidad: number = 10;
//   cargandoMas: boolean = false;
//   filtroEspecialidad: string = ''; // Variable para almacenar la especialidad seleccionada
//   usuarioLogueado: any | null = null; // Definición de la propiedad usuarioLogueado

//   constructor(private router: Router, private cursoService: CursoService) {}

//   ngOnInit(): void {
//     this.getUserData(); // Llamada al método para obtener los datos del usuario logueado
//     this.obtenerProfesores();
//   }

//   obtenerProfesores(): void {
//     this.cursoService.obtenerProfesores().subscribe(
//       (data) => {
//         this.profesores = data.filter(profesor =>
//           profesor.especialidad.toLowerCase().includes(this.filtroEspecialidad.toLowerCase())
//         ).slice(0, this.mostrarCantidad);
//       },
//       (error) => {
//         console.error('Error al obtener profesores:', error);
//       }
//     );
//   }

//   cargarMasProfesores(): void {
//     this.cargandoMas = true;
//     this.mostrarCantidad += 10;
//     this.obtenerProfesores();
//     this.cargandoMas = false;
//   }

//   filtrarPorEspecialidad(especialidad: string): void {
//     this.filtroEspecialidad = especialidad;
//     this.mostrarCantidad = 10; // Resetear la cantidad mostrada al aplicar el filtro
//     this.obtenerProfesores();
//   }

//   buscarPorEspecialidad(): void {
//     this.obtenerProfesores();
//   }

//   irAPerfil(id: string): void {
//     this.router.navigate(['/teacherProfile', id]);
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
//     }
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { CursoService } from '../services/courses.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css'],
// })
// export class HomeComponent implements OnInit {
//   profesores: any[] = [];
//   mostrarCantidad: number = 10;
//   cargandoMas: boolean = false;
//   filtroEspecialidad: string = ''; // Variable para almacenar la especialidad seleccionada

//   constructor(private router: Router, private cursoService: CursoService) {}

//   ngOnInit(): void {
//     this.obtenerProfesores();
//   }

//   obtenerProfesores(): void {
//     this.cursoService.obtenerProfesores().subscribe(
//       (data) => {
//         this.profesores = data.filter(profesor =>
//           profesor.especialidad.toLowerCase().includes(this.filtroEspecialidad.toLowerCase())
//         ).slice(0, this.mostrarCantidad);
//       },
//       (error) => {
//         console.error('Error al obtener profesores:', error);
//       }
//     );
//   }

//   cargarMasProfesores(): void {
//     this.cargandoMas = true;
//     this.mostrarCantidad += 10;
//     this.obtenerProfesores();
//     this.cargandoMas = false;
//   }

//   filtrarPorEspecialidad(especialidad: string): void {
//     this.filtroEspecialidad = especialidad;
//     this.mostrarCantidad = 10; // Resetear la cantidad mostrada al aplicar el filtro
//     this.obtenerProfesores();
//   }

//   buscarPorEspecialidad(): void {
//     this.obtenerProfesores();
//   }
//   irAPerfil(id: string): void {
//     this.router.navigate(['/teacherProfile', id]);
//   }
// }

// this.obtenerCursos();
// cursos: any[] = []; // Inicialización en el lugar
// obtenerCursos(): void {
//   this.cursoService.obtenerCursos().subscribe(
//     data => {
//       this.cursos = data;
//     },
//     error => {
//       console.error('Error al obtener cursos:', error);
//     }
//   );
// }
