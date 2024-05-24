// src/app/services/twilio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from 'twilio-video';
import * as Video from 'twilio-video';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {
  private apiUrl = 'http://localhost:4000'; // Ajusta la URL según sea necesario

  constructor(private http: HttpClient) { }

  createRoom(roomName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-room`, { roomName });
  }

  generateToken(identity: string, roomName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-token`, { identity, roomName });
  }

  createComposition(roomSid: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-composition`, { roomSid });
  }

  connectToRoom(token: string, roomName: string): Promise<Room> {
    return Video.connect(token, { name: roomName });
  }
}
