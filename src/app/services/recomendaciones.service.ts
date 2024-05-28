import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecomendacionesService {
  private apiUrl = 'http://localhost:4000/api/recomendaciones';

  constructor(private http: HttpClient) {}

  createRecomendacion(recomendacion: any): Observable<any> {
    return this.http.post(this.apiUrl, recomendacion);
  }
}
