import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private apiUrlHorarios = 'http://localhost:4000/api/horarios';
  private apiUrlProfesores = 'http://localhost:4000/api/profesores';
  private apiUrlInscripciones = 'http://localhost:4000/api/inscripciones'; // Nueva URL para filtrar por inscripciones
  private apiUrlAlumnos = 'http://localhost:4000/api/alumnos';
  private apiUrlSuscripcion = 'http://localhost:4000/api/suscripcion';
  private apiUrlPaypal = 'http://localhost:4000/api';
  private apiUrlProfesoresBuscar =
    'http://localhost:4000/api/profesores/buscar';
  constructor(private http: HttpClient) {}

  obtenerProfesoresPorAlumnoId(alumnoId: string): Observable<any[]> {
    const url = `${this.apiUrlInscripciones}/alumno/${alumnoId}/profesores`;
    return this.http.get<any[]>(url);
  }

  createProfesorPayPalAccount(data: any): Observable<any> {
    return this.http.post(`${this.apiUrlPaypal}/profesorPayPalAccount`, data);
  }

  getProfesorPayPalAccount(id: string): Observable<any> {
    return this.http.get(`${this.apiUrlPaypal}/profesorPayPalAccount/${id}`);
  }

  updateProfesorPayPalAccount(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrlPaypal}/profesorPayPalAccount/${id}`, data);
  }

  deleteProfesorPayPalAccount(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrlPaypal}/profesorPayPalAccount/${id}`);
  }
  getProfesorPayPalAccountByProfesorId(profesorId: number): Observable<any> {
    return this.http.get(`${this.apiUrlPaypal}/profesorPayPalAccount/profesor/${profesorId}`);
  }

  suscribirse(usuarioId: string, rol: String, tipoSuscripcion: string): Observable<any> {
    const body = { usuarioId: usuarioId,rol: rol, tipo_suscripcion: tipoSuscripcion };
    return this.http.post<any>(`${this.apiUrlSuscripcion}`, body);
  }
  verificarSuscripcion(usuarioId: string, rol: string): Observable<boolean> {
    const url = `${this.apiUrlSuscripcion}/${usuarioId}/suscripcion-activa/${rol}`;
    return this.http.get<boolean>(url);
  }
  guardarSuscripcion(suscripcion: any): Observable<any> {
    return this.http.post<any>(this.apiUrlSuscripcion, suscripcion);
  }

  // verificarSuscripcion(usuarioId: string): Observable<boolean> {
  //   return this.http.get<boolean>(`${this.apiUrlSuscripcion}/${usuarioId}/suscripcion-activa/`);
  // }
  
  // suscribirse(alumnoId: string, tipoSuscripcion: string): Observable<any> {
  //   return this.http.post(`${this.apiUrlAlumnos}/alumnos/${alumnoId}/suscribirse`, { tipoSuscripcion });
  // }
  // suscribirse(alumnoId: string, tipoSuscripcion: string): Observable<any> {
  //   const body = { Alumno_id: alumnoId, tipo_suscripcion: tipoSuscripcion };
  //   return this.http.post<any>(`${this.apiUrlSuscripcion}`, body);
  // }
  // Método para obtener todos los profesores
  obtenerProfesores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlProfesores);
  }

  obtenerProfesoresPorEspecialidad(
    especialidades: string[]
  ): Observable<any[]> {
    let params = new HttpParams();
    if (especialidades && especialidades.length > 0) {
      params = params.append('especialidades', especialidades.join(','));
    }
    return this.http.get<any[]>(this.apiUrlProfesoresBuscar, { params });
  }


  // Nuevo método para obtener todos los profesores si no se ha seleccionado ninguna especialidad
  obtenerProfesoresConFiltro(especialidades: string[]): Observable<any[]> {
    if (especialidades && especialidades.length > 0) {
      return this.obtenerProfesoresPorEspecialidad(especialidades);
    } else {
      return this.obtenerProfesores();
    }
  }

  // Método para obtener un profesor por su ID
  obtenerProfesorPorId(id: string): Observable<any> {
    const url = `${this.apiUrlProfesores}/filtrar/${id}`;
    return this.http.get<any>(url);
  }
  // Método para obtener alumnos por ID de usuario (filtrando por inscripciones)
  obtenerAlumnosPorUsuarioId(usuarioId: string): Observable<any[]> {
    const url = `${this.apiUrlInscripciones}/alumno/${usuarioId}`;
    return this.http.get<any[]>(url);
  }

  // Método para obtener profesores por ID de usuario (filtrando por inscripciones)
  obtenerProfesoresPorUsuarioId(usuarioId: string): Observable<any[]> {
    const url = `${this.apiUrlInscripciones}/profesor/${usuarioId}`;
    return this.http.get<any[]>(url);
  }
  obtenerHorariosPorProfesor(idProfesor: string): Observable<any[]> {
    const url = `${this.apiUrlHorarios}/profesor/${idProfesor}`;
    return this.http.get<any[]>(url);
  }
  obtenerHorariosPorId(horarioId: string): Observable<any[]> {
    const url = `${this.apiUrlHorarios}/${horarioId}`;
    return this.http.get<any[]>(url);
  }
  // Método para registrar un horario
  registrarHorario(horario: any): Observable<any> {
    return this.http.post<any>(this.apiUrlHorarios, horario);
  }
  registrarInscripcion(inscripcion: any): Observable<any> {
    const url = 'http://localhost:4000/api/inscripciones';
    return this.http.post(url, inscripcion);
  }
  // Método para obtener un alumno por su ID
  obtenerAlumnoPorId(id: string): Observable<any> {
    const url = `${this.apiUrlAlumnos}/${id}`;
    return this.http.get<any>(url);
  }
  // verificarSuscripcion(alumnoId: string): Observable<boolean> {
  //   return this.http.get<boolean>(`${this.apiUrlAlumnos}/suscripcion/${alumnoId}/suscripcion-activa`);
  // }
  // En el servicio CursoService
  actualizarAlumno(alumnoId: string, datos: any) {
    const url = `${this.apiUrlAlumnos}/editar/${alumnoId}`;
    return this.http.put(url, datos);
  }
  // En el servicio CursoService
  actualizarProfesor(profesorId: string, datos: any) {
    const url = `${this.apiUrlProfesores}/editar/${profesorId}`;
    return this.http.put(url, datos);
  }

  obtenerInscripcionesPorAlumnoId(alumnoId: string): Observable<any[]> {
    const url = `${this.apiUrlInscripciones}/alumno/${alumnoId}`;
    return this.http.get<any[]>(url);
  }
  obtenerHorariosPorIds(horariosIds: string[]): Observable<any[]> {
    const url = `${this.apiUrlHorarios}/filtrar/ids`;
    const params = { ids: horariosIds.join(',') };
    return this.http.get<any[]>(url, { params });
  }

  obtenerHorarios(): Observable<any[]> {
    const url = `${this.apiUrlHorarios}`;
    return this.http.get<any[]>(url);
  }
  obtenerIdsHorariosPorAlumnoId(alumnoId: string): Observable<string[]> {
    const url = `${this.apiUrlInscripciones}/alumno/${alumnoId}`;
    return this.http.get<string[]>(url);
  }
}
