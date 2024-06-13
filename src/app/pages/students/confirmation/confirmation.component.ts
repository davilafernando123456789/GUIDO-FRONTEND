import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from '../services/courses.service';
import { PayPalConfigExtended } from '../../../models/paypal-config.model';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent implements OnInit {
  showPayPalButtons = false;
  horarioId: string | null = null;
  profesorId: string | null = null;
  horario: any;
  profesor: any;
  public payPalConfig?: PayPalConfigExtended;
  cardNumber: string = '';
  cardName: string = '';
  expiryDate: string = '';
  cvv: string = '';
  montoPagar: number = 25;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private router: Router
  ) {}
  ngOnInit() {
    this.initConfig();
    this.horarioId = this.route.snapshot.paramMap.get('horarioId');
    this.profesorId = this.route.snapshot.paramMap.get('profesorId');

    if (this.horarioId && this.profesorId) {
      this.obtenerDetallesHorario();
      this.obtenerDetallesProfesor();
    } else {
      console.error(
        'No se encontraron los parámetros horarioId y profesorId en la ruta'
      );
    }
  }

  obtenerDetallesHorario() {
    if (this.horarioId) {
      this.cursoService
        .obtenerHorariosPorId(this.horarioId)
        .subscribe((horario) => (this.horario = horario));
    } else {
      console.error('ID del horario no válido');
    }
  }

  obtenerDetallesProfesor() {
    if (this.profesorId) {
      this.cursoService
        .obtenerProfesorPorId(this.profesorId)
        .subscribe((profesor) => (this.profesor = profesor));
    } else {
      console.error('ID del profesor no válido');
    }
  }

  private initConfig(): void {
    // PayPal config initialization if needed
  }

  registrarInscripcion() {
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
    const alumnoId = usuario.id;

    if (!alumnoId) {
      console.error('No se pudo obtener el ID del alumno logueado');
      return;
    }

    const inscripcion = {
      Alumnos_id: alumnoId,
      Profesores_id: this.profesorId,
      Horario_id: this.horarioId,
    };

    Swal.fire({
      title: '¿Deseas reservar la inscripción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Simulate payment process here
        if (this.cardNumber && this.cardName && this.expiryDate && this.cvv) {
          this.cursoService.registrarInscripcion(inscripcion).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Reservación realizada correctamente',
                showConfirmButton: false,
                timer: 3000,
              });
              this.router.navigate(['/home']);
            },
            (error) => {
              console.error('Error al registrar la inscripción:', error);
              if (
                error.status === 400 &&
                error.error.message ===
                  'Ya existe una inscripción para este horario'
              ) {
                Swal.fire({
                  icon: 'error',
                  title: 'Horario ya reservado',
                  text: 'El horario ya ha sido reservado',
                  showConfirmButton: true,
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al registrar la reservación',
                  text: 'Por favor, inténtalo de nuevo.',
                  showConfirmButton: true,
                });
              }
            }
          );
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de pago',
            text: 'Por favor, completa todos los campos de la tarjeta.',
            showConfirmButton: true,
          });
        }
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Inscripción cancelada',
          text: 'Por favor, completa tus datos y vuelve a intentarlo.',
          showConfirmButton: true,
        });
      }
    });
  }
}


// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { CursoService } from '../services/courses.service';
// import { PayPalConfigExtended } from '../../../models/paypal-config.model';
// import { Router, NavigationExtras } from '@angular/router';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-confirmation',
//   templateUrl: './confirmation.component.html',
//   styleUrls: ['./confirmation.component.css'],
// })
// export class ConfirmationComponent implements OnInit {
//   showPayPalButtons = false;
//   horarioId: string | null = null;
//   profesorId: string | null = null;
//   horario: any;
//   profesor: any;
//   public payPalConfig?: PayPalConfigExtended;
//   constructor(
//     private route: ActivatedRoute,
//     private cursoService: CursoService,
//     private router: Router
//   ) {}
//   ngOnInit() {
//     this.initConfig();
//     this.horarioId = this.route.snapshot.paramMap.get('horarioId');
//     this.profesorId = this.route.snapshot.paramMap.get('profesorId');

//     if (this.horarioId && this.profesorId) {
//       this.obtenerDetallesHorario();
//       this.obtenerDetallesProfesor();
//     } else {
//       console.error(
//         'No se encontraron los parámetros horarioId y profesorId en la ruta'
//       );
//     }
//   }

//   obtenerDetallesHorario() {
//     if (this.horarioId) {
//       this.cursoService
//         .obtenerHorariosPorId(this.horarioId)
//         .subscribe((horario) => (this.horario = horario));
//     } else {
//       console.error('ID del horario no válido');
//     }
//   }

//   obtenerDetallesProfesor() {
//     if (this.profesorId) {
//       this.cursoService
//         .obtenerProfesorPorId(this.profesorId)
//         .subscribe((profesor) => (this.profesor = profesor));
//     } else {
//       console.error('ID del profesor no válido');
//     }
//   }

//   private initConfig(): void {

//   }

//   registrarInscripcion() {
//     const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
//     const alumnoId = usuario.id;

//     if (!alumnoId) {
//       console.error('No se pudo obtener el ID del alumno logueado');
//       return;
//     }

//     const inscripcion = {
//       Alumnos_id: alumnoId,
//       Profesores_id: this.profesorId,
//       Horario_id: this.horarioId,
//     };

//     Swal.fire({
//       title: '¿Deseas reservar la inscripción?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí',
//       cancelButtonText: 'No',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.cursoService.registrarInscripcion(inscripcion).subscribe(
//           () => {
//             Swal.fire({
//               icon: 'success',
//               title: 'Reservación realizada correctamente',
//               showConfirmButton: false,
//               timer: 3000,
//             });
//             this.router.navigate(['/home']);
//           },
//           (error) => {
//             console.error('Error al registrar la inscripción:', error);
//             if (
//               error.status === 400 &&
//               error.error.message ===
//                 'Ya existe una inscripción para este horario'
//             ) {
//               Swal.fire({
//                 icon: 'error',
//                 title: 'Horario ya reservado',
//                 text: 'El horario ya ha sido reversado',
//                 showConfirmButton: true,
//               });
//             } else {
//               Swal.fire({
//                 icon: 'error',
//                 title: 'Error al registrar la reservación',
//                 text: 'Por favor, inténtalo de nuevo.',
//                 showConfirmButton: true,
//               });
//             }
//           }
//         );
//       } else {
//         Swal.fire({
//           icon: 'info',
//           title: 'Inscripción cancelada',
//           text: 'Por favor, completa tus datos y vuelve a intentarlo.',
//           showConfirmButton: true,
//         });
//       }
//     });
//   }
// }

// private initConfig(): void {
//   this.payPalConfig = {
//     currency: 'USD',
//     clientId: environment.payPalClientId, // Reemplaza con tu ID de cliente de PayPal
//     createOrderOnClient: (data) =>
//       <ICreateOrderRequest>{
//         intent: 'CAPTURE',
//         purchase_units: [
//           {
//             amount: {
//               currency_code: 'USD',
//               value: '9.99', // Reemplaza con el monto a pagar
//               breakdown: {
//                 item_total: {
//                   currency_code: 'USD',
//                   value: '9.99', // Reemplaza con el monto a pagar
//                 },
//               },
//             },
//             items: [
//               {
//                 name: 'Inscripción al curso', // Reemplaza con la descripción del pago
//                 quantity: '1',
//                 category: 'DIGITAL_GOODS',
//                 unit_amount: {
//                   currency_code: 'USD',
//                   value: '9.99', // Reemplaza con el monto a pagar
//                 },
//               },
//             ],
//           },
//         ],
//       },
//     advanced: {
//       commit: 'true',
//     },
//     style: {
//       label: 'paypal',
//       layout: 'vertical',
//     },
//     onApprovePayment: (data, actions) => {
//       console.log(
//         'onApprovePayment - you should make an AJAX call to your server to complete the payment',
//         data,
//         actions
//       );
//       this.registrarInscripcion(); // Llama al método registrarInscripcion después de un pago exitoso
//     },
//     onClientAuthorization: (data) => {
//       console.log(
//         'onClientAuthorization - you should fire tracking events here',
//         data
//       );
//     },
//     onCancel: (data, actions) => {
//       console.log('OnCancel', data, actions);
//     },
//     onError: (err) => {
//       console.log('OnError', err);
//     },
//     onClick: (data, actions) => {
//       console.log('onClick', data, actions);
//     },
//   };

//   this.showPayPalButtons = true;
// }


 // registrarInscripcion() {
  //   // Obtener el ID del alumno logueado desde sessionStorage
  //   const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
  //   const alumnoId = usuario.id;

  //   if (!alumnoId) {
  //     console.error('No se pudo obtener el ID del alumno logueado');
  //     return;
  //   }
  //   const inscripcion = {
  //     Alumnos_id: alumnoId,
  //     Profesores_id: this.profesorId,
  //     Horario_id: this.horarioId,
  //   };

  //   this.cursoService.registrarInscripcion(inscripcion).subscribe(
  //     () => {
  //       console.log('Inscripción registrada correctamente');
  //       this.router.navigate(['/home']);
  //     },
  //     (error) => {
  //       console.error('Error al registrar la inscripción:', error);
  //       alert(
  //         'Error al registrar la inscripción. Por favor, inténtalo de nuevo.'
  //       );
  //     }
  //   );

  // }
//PARA EL METODO DE PAGO
