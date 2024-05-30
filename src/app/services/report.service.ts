import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:4000/api/reportes'; // Cambia esta URL si es necesario

  constructor(private http: HttpClient) {}

  obtenerInscripcionesPorProfesorId(profesorId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:4000/api/inscripciones/profesor/${profesorId}`); // Cambia la URL si es necesario
  }

  obtenerAlumnoPorId(alumnoId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:4000/api/alumnos/${alumnoId}`); // Cambia la URL si es necesario
  }

  createReport(report: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, report);
  }
}
