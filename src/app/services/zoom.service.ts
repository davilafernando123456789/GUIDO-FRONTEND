// src/app/services/zoom.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {
  private apiUrl = 'http://localhost:4000'; // Ajusta la URL según sea necesario
  private baseUrl = 'http://localhost:4000';
  private baseUrlTeacher = 'http://localhost:4000/api/profe';
  constructor(private http: HttpClient) { }

  authorize(): void {
    window.location.href = `${this.baseUrl}/authorize`;
  }

  createMeeting(topic: string, accessToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-meeting`, { topic, accessToken });
  }



  registerProfesor(nombre: string, email: string): Observable<any> {
    return this.http.post(`${this.baseUrlTeacher}/register`, { nombre, email });
  }

  getAccessTokenFromUrl(): string {
    const params = new URLSearchParams(window.location.search);
    return params.get('access_token') || '';
  }

  // createMeeting(topic: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/create-meeting`, { topic });
  // }

  getRecordings(meetingId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/recordings/${meetingId}`);
  }
}
