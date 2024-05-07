import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-scholars',
  templateUrl: './scholars.component.html',
  styleUrls: ['./scholars.component.css'],
})
export class ScholarsComponent implements OnInit {
  alumnos: any[] = [];
  selectedAlumno: any | null = null;
  currentPage = 1; // Página actual
  itemsPerPage = 5; // Cambia esto según la cantidad de elementos por página que desees
  key: string = '';
  searchTerm: string = '';
  reverse: boolean = false;
  editingAlumno: any | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getAlumnos();
  }

  getAlumnos(): void {
    this.adminService.obtenerAlumnos().subscribe(
      (response) => {
        this.alumnos = response;
      },
      (error) => {
        console.error('Error al obtener los alumnos:', error);
      }
    );
  }

  selectAlumno(alumno: any): void {
    this.selectedAlumno = alumno;
  }

  deselectAlumno(): void {
    this.selectedAlumno = null;
  }

  sort(key: string): void {
    this.key = key;
    this.reverse = !this.reverse;
  }

  editAlumno(alumno: any): void {
    this.editingAlumno = { ...alumno }; // Clonar el profesor para evitar cambios directos
  }

  guardarEdicion(): void {
    // Lógica para guardar la edición
    if (this.editingAlumno) {
      this.adminService.guardarAlumnoEditado(this.editingAlumno).subscribe(
        () => {
          // Actualizar la lista de alumno después de guardar la edición
          this.getAlumnos();
          this.editingAlumno = null;
          alert('El alumno ha sido actualizado exitosamente.');
        },
        (error) => {
          console.error('Error al guardar la edición del alumno:', error);
          alert('Error al actualizar alumno.');
        }
      );
    }
  }

  cancelarEdicion(): void {
    this.editingAlumno = null; // Limpiar el alumno en edición
  }

  eliminarAlumno(id: number): void {
    // Lógica para eliminar el alumno
    this.adminService.eliminarAlumno(id.toString()).subscribe(
      () => {
        // Actualizar la lista de alumno después de la eliminación
        this.alumnos = this.alumnos.filter(
          (alumno) => alumno.id !== id
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
    // Filtrar los alumnos según el término de búsqueda
    this.adminService.buscarAlumnosPorNombre(this.searchTerm).subscribe(
      (response) => {
        console.log('Response de búsqueda:', response);
        this.alumnos = response;
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
    return Math.ceil(this.alumnos.length / this.itemsPerPage);
  }

  // Devuelve los elementos correspondientes a la página actual
  get currentPageData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.alumnos.slice(startIndex, endIndex);
  }
}
