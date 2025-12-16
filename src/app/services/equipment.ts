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

  getImageUrl(relativePath: string): string {
    if (!relativePath) return 'https://via.placeholder.com/100';

    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${relativePath}`;
  }

  create(data: FormData) {
    return this.http.post(this.apiUrl, data);
  }
}
