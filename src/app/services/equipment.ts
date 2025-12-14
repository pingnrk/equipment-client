import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

const API_URL = 'https://localhost:7273/api';

export interface Equipment {
  id: string;
  code: string;
  name: string;
  description: string;
  categoryId: number;
  stock: number;
  status: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${API_URL}/equipments`);
  }

  // ดึงรูปภาพ (Helper function เอาไว้ต่อ URL ให้ครบ)
  getImageUrl(relativePath: string): string {
    if (!relativePath) return 'https://via.placeholder.com/100';
    return `${API_URL.replace('/api', '')}${relativePath}`;
  }

  create(data: FormData) {
    return this.http.post(`${API_URL}/equipments`, data);
  }
}
