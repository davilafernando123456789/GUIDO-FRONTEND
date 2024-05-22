import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from '../services/courses.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
})
export class StudentProfileComponent implements OnInit {
  alumno: any;
  alumnoId!: string;
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAlumnoIdFromSession();
  }

  getAlumnoIdFromSession() {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.alumnoId = usuario.id as string;
      this.getAlumno();
    } else {
      // Manejar el caso en el que no se encuentre un usuario en la sesión
    }
  }

  getAlumno() {
    this.cursoService
      .obtenerAlumnoPorId(this.alumnoId)
      .subscribe((alumno: any) => {
        this.alumno = alumno;
      });
  }

  guardarCambios() {
    this.cursoService.actualizarAlumno(this.alumnoId, this.alumno).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Perfil actualizado correctamente',
          showConfirmButton: false,
          timer: 3000,
        });
        this.editMode = false;
      },
      (error) => {
        // Manejar el error
        Swal.fire({
          icon: 'error',
          title: 'Hubo un error al editar perfil',
          showConfirmButton: false,
          timer: 3000,
        });
        console.error(error);
      }
    );
  }
}
