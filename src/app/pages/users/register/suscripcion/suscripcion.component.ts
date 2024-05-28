import { Component, OnInit } from '@angular/core';
import { CursoService } from '../../../students/services/courses.service';
import { Router } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { PayPalConfigExtended } from '../../../../models/paypal-config.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.css'],
})
export class SuscripcionComponent implements OnInit {
  usuarioLogueado: UsuarioData | null = null;
  showPayPalButtons = false;
  pagoAprobado = false;
  paymentData: any = null;

  public payPalConfig?: PayPalConfigExtended;

  constructor(
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.initPayPalConfig();
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
        id: userData.id,
      };
    }
  }

  suscribirse(tipo: string) {
    if (this.pagoAprobado && this.usuarioLogueado && this.paymentData) {
      const suscripcionData = {
        usuarioId: this.usuarioLogueado.id,
        rol: this.usuarioLogueado.rol,
        tipo_suscripcion: tipo,
        payment_id: this.paymentData.id,
        payment_status: this.paymentData.status,
        payment_amount: this.paymentData.purchase_units[0].amount.value,
        payment_currency: this.paymentData.purchase_units[0].amount.currency_code,
      };

      this.cursoService
        .guardarSuscripcion(suscripcionData)
        .subscribe(
          () => {
            Swal.fire('Éxito', 'Suscripción realizada con éxito', 'success').then(() => {
              this.router.navigate(['/home']);
            });
          },
          (error) => {
            console.error('Error al suscribirse:', error);
            Swal.fire('Error', error.message || 'No se pudo realizar la suscripción. Inténtalo más tarde.', 'error');
          }
        );
    } else {
      console.error('Pago no aprobado o usuario no logueado');
      Swal.fire('Error', 'Debes realizar el pago primero', 'error');
    }
  }
  private initPayPalConfig(): void {
    this.pagoAprobado = true;
    this.paymentData = {
      id: 'TEST_PAYMENT_ID',
      status: 'APPROVED',
      purchase_units: [
        {
          amount: {
            value: '9.99',
            currency_code: 'USD',
          },
        },
      ],
    };

    // Simular llamada a la suscripción con el tipo deseado
    this.suscribirse('Mensual'); 
  }
}


interface UsuarioData {
  usuario: string;
  nombre: string;
  rol: string;
  foto: string;
  id: string;
}

  //private initPayPalConfig(): void {
    // this.payPalConfig = {
    //   currency: 'USD',
    //   clientId: environment.payPalClientId,
    //   createOrderOnClient: (data) =>
    //     <ICreateOrderRequest>{
    //       intent: 'CAPTURE',
    //       purchase_units: [
    //         {
    //           amount: {
    //             currency_code: 'USD',
    //             value: '9.99',
    //             breakdown: {
    //               item_total: {
    //                 currency_code: 'USD',
    //                 value: '9.99',
    //               },
    //             },
    //           },
    //           items: [
    //             {
    //               name: 'Inscripción al curso',
    //               quantity: '1',
    //               category: 'DIGITAL_GOODS',
    //               unit_amount: {
    //                 currency_code: 'USD',
    //                 value: '9.99',
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   advanced: {
    //     commit: 'true',
    //   },
    //   style: {
    //     label: 'paypal',
    //     layout: 'vertical',
    //   },
    //   onApprove: (data, actions) => {
    //     console.log('onApprove', data, actions);
    //     this.pagoAprobado = true;
    //     this.paymentData = data; // Guardar los datos del pago
    //   },
    //   onClientAuthorization: (data) => {
    //     console.log('onClientAuthorization', data);
     //   this.pagoAprobado = true;
    //     this.paymentData = data; // Guardar los datos del pago
    //   },
    //   onCancel: (data, actions) => {
    //     console.log('OnCancel', data, actions);
    //     this.pagoAprobado = false;
    //     this.paymentData = null;
    //   },
    //   onError: (err) => {
    //     console.log('OnError', err);
    //     this.pagoAprobado = false;
    //     this.paymentData = null;
    //   },
    //   onClick: (data, actions) => {
    //     console.log('onClick', data, actions);
    //   },
    // };

   // this.showPayPalButtons = true;
 // }
//}
// import { Component, OnInit } from '@angular/core';
// import { CursoService } from '../../../students/services/courses.service';
// import { Router } from '@angular/router';
// import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
// import { environment } from 'src/environments/environment';
// import { PayPalConfigExtended } from '../../../../models/paypal-config.model';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-suscripcion',
//   templateUrl: './suscripcion.component.html',
//   styleUrls: ['./suscripcion.component.css'],
// })
// export class SuscripcionComponent implements OnInit {
//   usuarioLogueado: UsuarioData | null = null;
//   showPayPalButtons = false;
//   pagoAprobado = false;

//   public payPalConfig?: PayPalConfigExtended;

//   constructor(
//     private cursoService: CursoService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.getUserData();
//     this.initPayPalConfig();
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
//         id: userData.id,
//       };
//     }
//   }

//   suscribirse(tipo: string) {
//     if (this.pagoAprobado && this.usuarioLogueado) {
//       this.cursoService
//         .suscribirse(this.usuarioLogueado.id, this.usuarioLogueado.rol, tipo)
//         .subscribe(
//           () => {
//             Swal.fire('Éxito', 'Suscripción realizada con éxito', 'success').then(() => {
//               this.router.navigate(['/home']);
//             });
//           },
//           (error) => {
//             console.error('Error al suscribirse:', error);
//             Swal.fire('Error', error.message || 'No se pudo realizar la suscripción. Inténtalo más tarde.', 'error');
//           }
//         );
//     } else {
//       console.error('Pago no aprobado o usuario no logueado');
//       Swal.fire('Error', 'Debes realizar el pago primero', 'error');
//     }
//   }

//   private initPayPalConfig(): void {
//     this.payPalConfig = {
//       currency: 'USD',
//       clientId: environment.payPalClientId,
//       createOrderOnClient: (data) =>
//         <ICreateOrderRequest>{
//           intent: 'CAPTURE',
//           purchase_units: [
//             {
//               amount: {
//                 currency_code: 'USD',
//                 value: '9.99',
//                 breakdown: {
//                   item_total: {
//                     currency_code: 'USD',
//                     value: '9.99',
//                   },
//                 },
//               },
//               items: [
//                 {
//                   name: 'Inscripción al curso',
//                   quantity: '1',
//                   category: 'DIGITAL_GOODS',
//                   unit_amount: {
//                     currency_code: 'USD',
//                     value: '9.99',
//                   },
//                 },
//               ],
//             },
//           ],
//         },
//       advanced: {
//         commit: 'true',
//       },
//       style: {
//         label: 'paypal',
//         layout: 'vertical',
//       },
//       onApprovePayment: (data, actions) => {
//         console.log(
//           'onApprovePayment - you should make an AJAX call to your server to complete the payment',
//           data,
//           actions
//         );
//         this.pagoAprobado = true;
//       },
//       onClientAuthorization: (data) => {
//         console.log('onClientAuthorization - you should fire tracking events here', data);
//       },
//       onCancel: (data, actions) => {
//         console.log('OnCancel', data, actions);
//         this.pagoAprobado = false;
//       },
//       onError: (err) => {
//         console.log('OnError', err);
//         this.pagoAprobado = false;
//       },
//       onClick: (data, actions) => {
//         console.log('onClick', data, actions);
//       },
//     };

//     this.showPayPalButtons = true;
//   }
// }

// interface UsuarioData {
//   usuario: string;
//   nombre: string;
//   rol: string;
//   foto: string;
//   id: string;
// }