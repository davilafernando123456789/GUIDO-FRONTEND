import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';
import { CursoService } from '../../../students/services/courses.service';
import { Router } from '@angular/router';
import { swalWithCustomOptions } from 'src/app/sweetalert2-config'; // Importa la instancia personalizada

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.css'],
})
export class SuscripcionComponent implements OnInit, OnDestroy {
  menuActive = false;
  menuSubscription: Subscription | undefined;

  @ViewChild('paymentForm') paymentFormElement: ElementRef | undefined;
  usuarioLogueado: UsuarioData | null = null;
  showPayPalButtons = false;
  pagoAprobado = false;
  paymentData: any = null;
  suscripcionTipo: string = '';
  selectedCard: string = '';
  montoPagar: number | null = null;

  cardNumber: string = '';
  cardName: string = '';
  expiryDate: string = '';
  cvv: string = '';

  constructor(
    private cursoService: CursoService,
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.menuSubscription = this.menuService.menuActive$.subscribe((active) => {
      this.menuActive = active;
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
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

  showPaymentForm(tipo: string, monto: number) {
    this.selectedCard = tipo;
    this.montoPagar = monto;
    this.showPayPalButtons = true;
    this.suscripcionTipo = tipo;
    setTimeout(() => {
      if (this.paymentFormElement) {
        this.paymentFormElement.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 0);
  }

  onSubmitPayment() {
    if (this.cardNumber && this.cardName && this.expiryDate && this.cvv) {
      this.initPayPalConfig();
      this.suscribirse(this.suscripcionTipo);
    } else {
      swalWithCustomOptions.fire(
        'Error',
        'Por favor, llena todos los campos de la tarjeta',
        'error'
      );
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
        payment_currency:
          this.paymentData.purchase_units[0].amount.currency_code,
      };

      this.cursoService.guardarSuscripcion(suscripcionData).subscribe(
        () => {
          swalWithCustomOptions.fire('Éxito', 'Suscripción realizada con éxito', 'success').then(
            () => {
              this.router.navigate(['/home']);
            }
          );
        },
        (error) => {
          console.error('Error al suscribirse:', error);
          swalWithCustomOptions.fire(
            'Error',
            error.message ||
              'No se pudo realizar la suscripción. Inténtalo más tarde.',
            'error'
          );
        }
      );
    } else {
      console.error('Pago no aprobado o usuario no logueado');
      swalWithCustomOptions.fire('Error', 'Debes realizar el pago primero', 'error');
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
  }
}

interface UsuarioData {
  usuario: string;
  nombre: string;
  rol: string;
  foto: string;
  id: string;
}

// import {
//   Component,
//   OnInit,
//   OnDestroy,
//   ElementRef,
//   ViewChild,
// } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { MenuService } from 'src/app/services/menu.service';
// import { CursoService } from '../../../students/services/courses.service';
// import { Router } from '@angular/router';

// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-suscripcion',
//   templateUrl: './suscripcion.component.html',
//   styleUrls: ['./suscripcion.component.css'],
// })
// export class SuscripcionComponent implements OnInit, OnDestroy {
//   menuActive = false;
//   menuSubscription: Subscription | undefined;

//   @ViewChild('paymentForm') paymentFormElement: ElementRef | undefined;
//   usuarioLogueado: UsuarioData | null = null;
//   showPayPalButtons = false;
//   pagoAprobado = false;
//   paymentData: any = null;
//   suscripcionTipo: string = '';
//   selectedCard: string = '';
//   montoPagar: number | null = null;

//   cardNumber: string = '';
//   cardName: string = '';
//   expiryDate: string = '';
//   cvv: string = '';

//   constructor(
//     private cursoService: CursoService,
//     private router: Router,
//     private menuService: MenuService
//   ) {}

//   ngOnInit(): void {
//     this.getUserData();
//     this.menuSubscription = this.menuService.menuActive$.subscribe((active) => {
//       this.menuActive = active;
//     });
//   }

//   ngOnDestroy(): void {
//     this.menuSubscription?.unsubscribe();
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

//   showPaymentForm(tipo: string, monto: number) {
//     this.selectedCard = tipo;
//     this.montoPagar = monto;
//     this.showPayPalButtons = true;
//     this.suscripcionTipo = tipo;
//     setTimeout(() => {
//       if (this.paymentFormElement) {
//         this.paymentFormElement.nativeElement.scrollIntoView({
//           behavior: 'smooth',
//           block: 'start',
//         });
//       }
//     }, 0);
//   }

//   onSubmitPayment() {
//     if (this.cardNumber && this.cardName && this.expiryDate && this.cvv) {
//       this.initPayPalConfig();
//       this.suscribirse(this.suscripcionTipo);
//     } else {
//       Swal.fire(
//         'Error',
//         'Por favor, llena todos los campos de la tarjeta',
//         'error'
//       );
//     }
//   }

//   suscribirse(tipo: string) {
//     if (this.pagoAprobado && this.usuarioLogueado && this.paymentData) {
//       const suscripcionData = {
//         usuarioId: this.usuarioLogueado.id,
//         rol: this.usuarioLogueado.rol,
//         tipo_suscripcion: tipo,
//         payment_id: this.paymentData.id,
//         payment_status: this.paymentData.status,
//         payment_amount: this.paymentData.purchase_units[0].amount.value,
//         payment_currency:
//           this.paymentData.purchase_units[0].amount.currency_code,
//       };

//       this.cursoService.guardarSuscripcion(suscripcionData).subscribe(
//         () => {
//           Swal.fire('Éxito', 'Suscripción realizada con éxito', 'success').then(
//             () => {
//               this.router.navigate(['/home']);
//             }
//           );
//         },
//         (error) => {
//           console.error('Error al suscribirse:', error);
//           Swal.fire(
//             'Error',
//             error.message ||
//               'No se pudo realizar la suscripción. Inténtalo más tarde.',
//             'error'
//           );
//         }
//       );
//     } else {
//       console.error('Pago no aprobado o usuario no logueado');
//       Swal.fire('Error', 'Debes realizar el pago primero', 'error');
//     }
//   }

//   private initPayPalConfig(): void {
//     this.pagoAprobado = true;
//     this.paymentData = {
//       id: 'TEST_PAYMENT_ID',
//       status: 'APPROVED',
//       purchase_units: [
//         {
//           amount: {
//             value: '9.99',
//             currency_code: 'USD',
//           },
//         },
//       ],
//     };
//   }
// }

// interface UsuarioData {
//   usuario: string;
//   nombre: string;
//   rol: string;
//   foto: string;
//   id: string;
// }
