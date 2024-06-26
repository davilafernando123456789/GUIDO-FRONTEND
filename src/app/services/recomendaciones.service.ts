import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecomendacionesService {
  private apiUrl = 'http://3.84.155.125:4000/api/recomendaciones';
  // private apiUrl = 'http://localhost:4000/api/recomendaciones';

  constructor(private http: HttpClient) {}

  createRecomendacion(recomendacion: any): Observable<any> {
    return this.http.post(this.apiUrl, recomendacion);
  }
  obtenerRecomendaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  obtenerRecomendacionesPorProfesorId(profesorId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profesor/${profesorId}`);
  }
}
