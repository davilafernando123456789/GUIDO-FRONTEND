import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit, OnDestroy {
  menuActive = false;
  menuSubscription: Subscription | undefined;
  mensajes: any[] = [];
  editingMensaje: any | null = null;
  selectedMensaje: any | null = null;
  currentPage = 1;
  itemsPerPage = 5;
  key: string = '';
  searchTerm: string = '';
  searchTerm2: string = '';
  reverse: boolean = false;

  constructor(private adminService: AdminService, private menuService: MenuService) { }

  ngOnInit(): void {
   
    this.getMensajes();
    this.menuSubscription = this.menuService.menuActive$.subscribe(active => {
      this.menuActive = active;
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }

  getMensajes(): void {
    this.adminService.obtenerMensajes().subscribe(
      (response) => {
        this.mensajes = response;
      },
      (error) => {
        console.error('Error al obtener los mensajes:', error);
      }
    );
  }

  selectMensaje(mensaje: any): void {
    this.selectedMensaje = mensaje;
  }

  deselectMensaje(): void {
    this.selectedMensaje = null;
  }

  editMensaje(mensaje: any): void {
    this.editingMensaje = { ...mensaje }; // Clonar el mensaje para evitar cambios directos
  }

  guardarEdicion(): void {
    // Lógica para guardar la edición
    if (this.editingMensaje) {
      this.adminService.guardarMensajeEditado(this.editingMensaje).subscribe(
        () => {
          // Actualizar la lista de mensajes después de guardar la edición
          this.getMensajes();
          this.editingMensaje = null;
          alert('El mensaje ha sido actualizado exitosamente.');
        },
        (error) => {
          console.error('Error al guardar la edición del mensaje:', error);
          alert('Error al actualizar el mensaje.');
        }
      );
    }
  }

  cancelarEdicion(): void {
    this.editingMensaje = null; // Limpiar el mensaje en edición
  }

  eliminarMensaje(id: number): void {
    // Lógica para eliminar el mensaje
    this.adminService.eliminarMensaje(id.toString()).subscribe(
      () => {
        // Actualizar la lista de mensajes después de la eliminación
        this.mensajes = this.mensajes.filter(
          (mensaje) => mensaje.id !== id
        );
        alert('El mensaje ha sido eliminado exitosamente.');
      },
      (error) => {
        console.error('Error al eliminar el mensaje:', error);
        alert('Error al eliminar el mensaje');
      }
    );
  }

  sort(key: string): void {
    this.key = key;
    this.reverse = !this.reverse;
  }

  search(): void {
    console.log('search');
    this.adminService.obtenerMensajePorAlumnoId(this.searchTerm).subscribe(
      (response) => {
        console.log('Response de búsqueda:', response);
        this.mensajes = response;
      },
      (error) => {
        console.error('Error al buscar los mensajes:', error);
      }
    );
  }
  search2(): void {
    console.log('search');
    this.adminService.obtenerMensajePorProfesorId(this.searchTerm2).subscribe(
      (response) => {
        console.log('Response de búsqueda:', response);
        this.mensajes = response;
      },
      (error) => {
        console.error('Error al buscar los mensajes:', error);
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
    return Math.ceil(this.mensajes.length / this.itemsPerPage);
  }

  // Devuelve los elementos correspondientes a la página actual
  get currentPageData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.mensajes.slice(startIndex, endIndex);
  }
}
