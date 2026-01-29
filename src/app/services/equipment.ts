import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipment } from './equipment.interface';
import { environment } from '../../environments/environment'; // import environment มาใช้

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private apiUrl = `${environment.apiUrl}/equipments`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.apiUrl);
  }

  getById(id: string): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.apiUrl}/${id}`);
  }

  update(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  create(data: FormData) {
    return this.http.post(this.apiUrl, data);
  }
}
