import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../students/services/courses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profesor-paypal-account',
  templateUrl: './profesor-paypal-account.component.html',
  styleUrls: ['./profesor-paypal-account.component.css'],
})
export class ProfesorPaypalAccountComponent implements OnInit, OnDestroy {
  menuActive = false;
  menuSubscription: Subscription | undefined;

  form: FormGroup;
  isEditMode = false;
  profesorId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService
  ) {
    this.form = this.fb.group({
      paypal_email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
    this.profesorId = usuario.id;

    // Verificar si ya existe una cuenta de PayPal asociada al profesor
    if (this.profesorId !== null) {
      this.cursoService
        .getProfesorPayPalAccountByProfesorId(this.profesorId)
        .subscribe(
          (data) => {
            if (data) {
              this.isEditMode = true;
              this.form.patchValue(data);
            }
          },
          (error) => {
            console.error(
              'Error al obtener la cuenta de PayPal del profesor:',
              error
            );
          }
        );
    }
    this.menuSubscription = this.menuService.menuActive$.subscribe((active) => {
      this.menuActive = active;
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const formData = {
      ...this.form.value,
      profesor_id: this.profesorId,
    };

    if (this.isEditMode) {
      this.cursoService
        .updateProfesorPayPalAccount(formData.profesor_id!, formData)
        .subscribe(
          () => {
            Swal.fire(
              'Success',
              'Cuenta de PayPal actualizada correctamente',
              'success'
            );
            this.router.navigate(['/']);
          },
          (error) => {
            console.error('Error al actualizar la cuenta de PayPal:', error);
            Swal.fire(
              'Error',
              'Error al actualizar la cuenta de PayPal',
              'error'
            );
          }
        );
    } else {
      this.cursoService.createProfesorPayPalAccount(formData).subscribe(
        () => {
          Swal.fire(
            'Success',
            'Cuenta de PayPal creada correctamente',
            'success'
          );
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error al crear la cuenta de PayPal:', error);
          Swal.fire('Error', 'Error al crear la cuenta de PayPal', 'error');
        }
      );
    }
  }
}
