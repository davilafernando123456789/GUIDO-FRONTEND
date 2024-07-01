import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seleccion-rol',
  templateUrl: './seleccion-rol.component.html',
  styleUrls: ['./seleccion-rol.component.css', './adminlte.min.css']
})
export class SeleccionRolComponent {
  constructor(private router: Router) {}

  selectRole(role: string): void {
    if (role === 'estudiante') {
      this.router.navigate(['/registerStudent']);
    } else if (role === 'tutor') {
      this.router.navigate(['/registerTeacher']);
    }
  }
}
