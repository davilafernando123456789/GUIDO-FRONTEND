import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css'],
})
export class SchedulesComponent implements OnInit {
  horarios: any[] = [];
  selectedHorario: any | null = null;
  editingHorario: any | null = null;
  currentPage = 1;
  itemsPerPage = 5;
  key: string = '';
  searchTerm: string = '';
  reverse: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getHorarios();
  }

  getHorarios(): void {
    this.adminService.obtenerHorarios().subscribe(
      (response) => {
        this.horarios = response;
      },
      (error) => {
        console.error('Error al obtener los horarios:', error);
      }
    );
  }

  selectHorario(horario: any): void {
    this.selectedHorario = horario;
  }

  deselectHorario(): void {
    this.selectedHorario = null;
  }

  editHorario(horario: any): void {
    this.editingHorario = { ...horario }; // Clonar el horario para evitar cambios directos
  }

  guardarEdicion(): void {
    // Lógica para guardar la edición
    if (this.editingHorario) {
      this.adminService.guardarHorarioEditado(this.editingHorario).subscribe(
        () => {
          // Actualizar la lista de horarios después de guardar la edición
          this.getHorarios();
          this.editingHorario = null;
          alert('El horario ha sido actualizado exitosamente.');
        },
        (error) => {
          console.error('Error al guardar la edición del horario:', error);
          alert('Error al actualizar el horario.');
        }
      );
    }
  }

  cancelarEdicion(): void {
    this.editingHorario = null; // Limpiar el horario en edición
  }

  eliminarHorario(id: number): void {
    // Lógica para eliminar el horario
    this.adminService.eliminarHorario(id.toString()).subscribe(
      () => {
        // Actualizar la lista de horarios después de la eliminación
        this.horarios = this.horarios.filter((horario) => horario.id !== id);
        alert('El horario ha sido eliminado exitosamente.');
      },
      (error) => {
        console.error('Error al eliminar el horario:', error);
        alert('Error al eliminar el horario');
      }
    );
  }

  search(): void {
    console.log('search');
    // Filtrar los horarios según el término de búsqueda en el campo de fecha
    this.adminService.buscarHorariosPorFecha(this.searchTerm).subscribe(
      (response) => {
        console.log('Response de búsqueda:', response);
        this.horarios = response;
      },
      (error) => {
        console.error('Error al buscar los horarios:', error);
      }
    );
  }

  onPageChange(pageNumber: number): void {
    console.log('Número de página:', pageNumber);
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

  get totalPages(): number {
    return Math.ceil(this.horarios.length / this.itemsPerPage);
  }

  // Devuelve los elementos correspondientes a la página actual
  get currentPageData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.horarios.slice(startIndex, endIndex);
  }
}
