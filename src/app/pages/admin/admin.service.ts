import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrlHorarios = 'http://localhost:4000/api/horarios';
  private apiUrlProfesores = 'http://localhost:4000/api/profesores';
  private apiUrlInscripciones = 'http://localhost:4000/api/inscripciones';
  private apiUrlAlumnos = 'http://localhost:4000/api/alumnos';
  private apiUrlMensajes = 'http://localhost:4000/api/mensajes';
  constructor(private http: HttpClient) {}

  //PROFESORES
  // Método para obtener todos los profesores
  obtenerProfesores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlProfesores);
  }

  buscarProfesoresPorNombre(nombre: string): Observable<any[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<any[]>(`${this.apiUrlProfesores}/search`, { params });
  }

  // Método para eliminar un profesor por su ID
  eliminarProfesor(id: string): Observable<any> {
    const url = `${this.apiUrlProfesores}/${id}`;
    return this.http.delete<any>(url);
  }

  // Método para guardar la edición de un profesor
  guardarProfesorEditado(profesor: any): Observable<any> {
    const url = `${this.apiUrlProfesores}/editar/${profesor.id}`;
    return this.http.put<any>(url, profesor);
  }

  //Inscripciones
  // Método para obtener todos las inscripciones
  obtenerInscripciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlInscripciones);
  }
  // Método para eliminar un profesor por su ID
  eliminarInscripcion(id: string): Observable<any> {
    const url = `${this.apiUrlInscripciones}/${id}`;
    return this.http.delete<any>(url);
  }
  // Método para obtener inscripciones por ID de 
  obtenerInscripcionesById(InscripcionId: string): Observable<any[]> {
    const url = `${this.apiUrlInscripciones}/${InscripcionId}`;
    return this.http.get<any[]>(url);
  }

  // Método para guardar la edición de un inscripcion
  guardarInscripcionEditada(inscripcion: any): Observable<any> {
    const url = `${this.apiUrlInscripciones}/editar/${inscripcion.id}`;
    return this.http.put<any>(url, inscripcion);
  }

  //Mensajes
  // Método para obtener todos los mensajes
  obtenerMensajes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlMensajes);
  }
  buscarMensajesPorContenido(contenido: string): Observable<any[]> {
    const params = new HttpParams().set('contenido', contenido);
    return this.http.get<any[]>(`${this.apiUrlMensajes}/search`, { params });
  }
  // Método para obtener alumnos por ID de usuario (filtrando por inscripciones)
  obtenerMensajePorAlumnoId(usuarioId: string): Observable<any[]> {
    const url = `${this.apiUrlMensajes}/remitente/${usuarioId}`;
    return this.http.get<any[]>(url);
  }
  // Método para obtener profesores por ID de usuario (filtrando por inscripciones)
  obtenerMensajePorProfesorId(usuarioId: string): Observable<any[]> {
    const url = `${this.apiUrlMensajes}/destinatario/${usuarioId}`;
    return this.http.get<any[]>(url);
  }

  // Método para eliminar un mensaje por su ID
  eliminarMensaje(id: string): Observable<any> {
    const url = `${this.apiUrlMensajes}/${id}`;
    return this.http.delete<any>(url);
  }
  // Método para guardar la edición de un mensaje
  guardarMensajeEditado(mensaje: any): Observable<any> {
    const url = `${this.apiUrlMensajes}/editar/${mensaje.id}`;
    return this.http.put<any>(url, mensaje);
  }

  //Horarios
  obtenerHorarios(): Observable<any[]> {
    const url = `${this.apiUrlHorarios}`;
    return this.http.get<any[]>(url);
  }
  buscarHorariosPorFecha(fecha: string): Observable<any[]> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<any[]>(`${this.apiUrlHorarios}/buscar?fecha=`, {
      params,
    });
  }

  // Método para eliminar un horario por su ID
  eliminarHorario(id: string): Observable<any> {
    const url = `${this.apiUrlHorarios}/${id}`;
    return this.http.delete<any>(url);
  }
  // Método para guardar la edición de un horario
  guardarHorarioEditado(horario: any): Observable<any> {
    const url = `${this.apiUrlHorarios}/${horario.id}`;
    return this.http.put<any>(url, horario);
  }

  ///Alumnos
  // Método para obtener todos los alumnos
  obtenerAlumnos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlAlumnos);
  }

  buscarAlumnosPorNombre(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlAlumnos}/nombre/${nombre}`);
  }

  // Método para eliminar un alumno por su ID
  eliminarAlumno(id: string): Observable<any> {
    const url = `${this.apiUrlAlumnos}/${id}`;
    return this.http.delete<any>(url);
  }

  // Método para guardar la edición de un alumno
  guardarAlumnoEditado(alumno: any): Observable<any> {
    const url = `${this.apiUrlAlumnos}/editar/${alumno.id}`;
    return this.http.put<any>(url, alumno);
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

  // En el servicio CursoService
  actualizarAlumno(alumnoId: string, datos: any) {
    const url = `${this.apiUrlAlumnos}/${alumnoId}`;
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

  obtenerIdsHorariosPorAlumnoId(alumnoId: string): Observable<string[]> {
    const url = `${this.apiUrlInscripciones}/alumno/${alumnoId}`;
    return this.http.get<string[]>(url);
  }
}
