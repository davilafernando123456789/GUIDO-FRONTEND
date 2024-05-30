import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private apiUrl = 'http://localhost:4000/api/notificaciones';

  constructor(private http: HttpClient) {}

  crearNotificacion(notificacion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, notificacion);
  }

  obtenerNotificaciones(usuario_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${usuario_id}`);
  }

  marcarComoLeido(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/marcar-como-leido/${id}`, {});
  }
}
