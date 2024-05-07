import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

interface UserData {
  usuario: string;
  nombre: string; 
  rol: number;
  foto: string; 
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  usuarioLogueado: UserData | null = null; 

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getUserData();
      }
    });
  }

  ngOnInit() {
    // No es necesario hacer nada aquí
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
    sessionStorage.removeItem('usuario'); // Elimina el usuario de la sesión
    this.usuarioLogueado = null; // Limpia los datos del usuario en el componente
    this.router.navigate(['/']); // Redirecciona al usuario a la página de inicio de sesión
  }
}
