import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';

import { AdminService } from '../admin.service';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.css'],
})
export class MastersComponent  implements OnInit, OnDestroy {
  menuActive = false;
  menuSubscription: Subscription | undefined;

  profesores: any[] = [];
  currentPage = 1; // Página actual
  itemsPerPage = 5; // Cambia esto según la cantidad de elementos por página que desees
  key: string = '';
  searchTerm: string = '';
  reverse: boolean = false;
  editingProfesor: any | null = null;

  constructor(private adminService: AdminService , private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuSubscription = this.menuService.menuActive$.subscribe(active => {
      this.menuActive = active;
    });
    this.getProfesores();
  }
  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }
  getProfesores(): void {
    this.adminService.obtenerProfesores().subscribe(
      (response) => {
        this.profesores = response;
      },
      (error) => {
        console.error('Error al obtener los profesores:', error);
      }
    );
  }

  sort(key: string): void {
    this.key = key;
    this.reverse = !this.reverse;
  }

  editProfesor(profesor: any): void {
    this.editingProfesor = { ...profesor }; // Clonar el profesor para evitar cambios directos
  }

  guardarEdicion(): void {
    // Lógica para guardar la edición
    if (this.editingProfesor) {
      this.adminService.guardarProfesorEditado(this.editingProfesor).subscribe(
        () => {
          // Actualizar la lista de profesores después de guardar la edición
          this.getProfesores();
          this.editingProfesor = null;
          alert('El profesor ha sido actualizado exitosamente.');
        },
        (error) => {
          console.error('Error al guardar la edición del profesor:', error);
          alert('Error al actualizar profesor.');
        }
      );
    }
  }

  cancelarEdicion(): void {
    this.editingProfesor = null; // Limpiar el profesor en edición
  }

  eliminarProfesor(id: number): void {
    // Lógica para eliminar el profesor
    this.adminService.eliminarProfesor(id.toString()).subscribe(
      () => {
        // Actualizar la lista de profesores después de la eliminación
        this.profesores = this.profesores.filter(
          (profesor) => profesor.id !== id
        );
        alert('El profesor ha sido eliminado exitosamente.');
      },
      (error) => {
        console.error('Error al eliminar el profesor:', error);
        alert('Error al eliminar el profesor');
      }
    );
  }

  search(): void {
    console.log('search');
    // Filtrar los profesores según el término de búsqueda
    this.adminService.buscarProfesoresPorNombre(this.searchTerm).subscribe(
      (response) => {
        console.log('Response de búsqueda:', response);
        this.profesores = response;
      },
      (error) => {
        console.error('Error al buscar los profesores:', error);
      }
    );
  }

  onPageChange(pageNumber: number): void {
    console.log('Número de página:', pageNumber); // Agregamos este console.log
    this.currentPage = pageNumber;
  }
  goToFirstPage(): void {
    this.currentPage = 1;
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Calcula el número total de páginas
  get totalPages(): number {
    return Math.ceil(this.profesores.length / this.itemsPerPage);
  }

  // Devuelve los elementos correspondientes a la página actual
  get currentPageData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.profesores.slice(startIndex, endIndex);
  }
}
