import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RecomendacionesService } from '../../services/recomendaciones.service';

@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.component.html',
  styleUrls: ['./recomendaciones.component.css']
})
export class RecomendacionesComponent {
  estrellas: number = 0;
  comentario: string = '';
  Alumnos_id: number = 0;
  Profesores_id: number = 0;

  constructor(private recomendacionesService: RecomendacionesService) {}

  setEstrellas(rating: number): void {
    this.estrellas = rating;
  }

  submitRecomendacion(form: NgForm): void {
    if (form.valid) {
      const newRecomendacion = {
        estrellas: this.estrellas,
        comentario: this.comentario,
        Alumnos_id: this.Alumnos_id,
        Profesores_id: this.Profesores_id
      };

      this.recomendacionesService.createRecomendacion(newRecomendacion).subscribe(data => {
        console.log('Recomendación creada:', data);
        // Aquí puedes agregar lógica para notificar al usuario o limpiar el formulario
      });
    }
  }
}
