import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://3.84.155.125:4000/api/reportes';
  // private apiUrl = 'http://localhost:4000/api/reportes';

  constructor(private http: HttpClient) {}

  obtenerInscripcionesPorProfesorId(profesorId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://3.84.155.125:4000/api/inscripciones/profesor/${profesorId}`);
    // return this.http.get<any[]>(`http://localhost:4000/api/inscripciones/profesor/${profesorId}`);
  }

  obtenerAlumnoPorId(alumnoId: string): Observable<any> {
    return this.http.get<any>(`http://3.84.155.125:4000/api/alumnos/${alumnoId}`); 
    // return this.http.get<any>(`http://localhost:4000/api/alumnos/${alumnoId}`); 
  }

  createReport(report: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, report);
  }
}
