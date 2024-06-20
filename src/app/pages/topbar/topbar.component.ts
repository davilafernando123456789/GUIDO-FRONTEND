import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';

interface UserData {
  usuario: string;
  nombre: string;
  rol: number;
  foto: string;
}

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  usuarioLogueado: UserData | null = null;

  constructor(private router: Router, private menuService: MenuService) {}

  ngOnInit(): void {
    this.getUserData();
    this.syncMenuState();
    this.menuService.menuActive$.subscribe(() => {
      this.syncMenuState();
    });
  }

  toggleMenu(): void {
    this.menuService.toggleMenu();
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
      };
    }
  }

  cerrarSesion() {
    sessionStorage.removeItem('usuario');
    this.usuarioLogueado = null;
    this.router.navigate(['/']);
  }

  syncMenuState() {
    const navigationElement = document.querySelector('.navigation');
    const menuState = this.menuService.getMenuState();
    if (navigationElement) {
      if (menuState) {
        navigationElement.classList.add('active');
      } else {
        navigationElement.classList.remove('active');
      }
    }
  }
}

// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { MenuService } from 'src/app/services/menu.service';

// interface UserData {
//   usuario: string;
//   nombre: string;
//   rol: number;
//   foto: string;
// }

// @Component({
//   selector: 'app-topbar',
//   templateUrl: './topbar.component.html',
//   styleUrls: ['./topbar.component.css']
// })
// export class TopbarComponent implements OnInit {
//   usuarioLogueado: UserData | null = null;

//   constructor(private router: Router, private menuService: MenuService) {}

//   ngOnInit(): void {
//     this.getUserData();
//     this.syncMenuState();
//     this.menuService.menuActive$.subscribe(() => {
//       this.syncMenuState();
//     });
//   }

//   toggleMenu(): void {
//     this.menuService.toggleMenu();
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
//       };
//     }
//   }

//   cerrarSesion() {
//     sessionStorage.removeItem('usuario');
//     this.usuarioLogueado = null;
//     this.router.navigate(['/']);
//   }

//   syncMenuState() {
//     const mainElement = document.querySelector('.main');
//     const navigationElement = document.querySelector('.navigation');
//     const menuState = this.menuService.getMenuState();
//     if (mainElement && navigationElement) {
//       if (menuState) {
//         mainElement.classList.add('active');
//         navigationElement.classList.add('active');
//       } else {
//         mainElement.classList.remove('active');
//         navigationElement.classList.remove('active');
//       }
//     }
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { MenuService } from 'src/app/services/menu.service';

// interface UserData {
//   usuario: string;
//   nombre: string;
//   rol: number;
//   foto: string;
// }

// @Component({
//   selector: 'app-topbar',
//   templateUrl: './topbar.component.html',
//   styleUrls: ['./topbar.component.css']
// })
// export class TopbarComponent implements OnInit {
//   usuarioLogueado: UserData | null = null;

//   constructor(private router: Router, private menuService: MenuService) {}

//   ngOnInit(): void {
//     this.getUserData();
//   }
  

//   toggleMenu(): void {
//     this.menuService.toggleMenu();
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
//       };
//     }
//   }

//   cerrarSesion() {
//     sessionStorage.removeItem('usuario');
//     this.usuarioLogueado = null;
//     this.router.navigate(['/']);
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { Router, NavigationEnd } from '@angular/router';
// interface UserData {
//   usuario: string;
//   nombre: string;
//   rol: number;
//   foto: string;
// }

// @Component({
//   selector: 'app-topbar',
//   templateUrl: './topbar.component.html',
//   styleUrls: ['./topbar.component.css'],
// })
// export class TopbarComponent implements OnInit {
//   mostrarCerrarSesion: boolean = false;
//   toggle: HTMLElement | null = null;
//   navigation: HTMLElement | null = null;
//   main: HTMLElement | null = null;
//   usuarioLogueado: UserData | null = null;

//   constructor(private router: Router) {
//     this.router.events.subscribe((event) => {
//       if (event instanceof NavigationEnd) {
//         this.getUserData();
//       }
//     });
//   }

//   ngOnInit(): void {
//     this.initializeElements();

//   }

//   initializeElements(): void {
//     this.toggle = document.querySelector('.toggle');
//     this.navigation = document.querySelector('.navigation');
//     this.main = document.querySelector('.main');

//     this.addHoverClass();
//     this.toggleNavigation();
//   }

//   addHoverClass(): void {
//     const listItems = document.querySelectorAll('.navigation li');
//     listItems.forEach((item: Element, index: number) => {
//       item.addEventListener('mouseover', () => this.activeLink(item, index));
//     });
//   }
//   // Función para cambiar el valor de mostrarCerrarSesion
//   toggleCerrarSesion() {
//     this.mostrarCerrarSesion = !this.mostrarCerrarSesion;
//   }

//   activeLink(item: Element, index: number): void {
//     const listItems = document.querySelectorAll('.navigation li');
//     listItems.forEach((li: Element, i: number) => {
//       li.classList.remove('hovered');
//       if (i === index) {
//         item.classList.add('hovered');
//       }
//     });
//   }

//   toggleNavigation(): void {
//     if (this.toggle && this.navigation && this.main) {
//       this.toggle.onclick = () => {
//         this.navigation?.classList.toggle('active');
//         this.main?.classList.toggle('active');
//       };
//     }
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
//       };
//     }
//   }

//   cerrarSesion() {
//     sessionStorage.removeItem('usuario');
//     this.usuarioLogueado = null;
//     this.router.navigate(['/']);
//   }
// }
