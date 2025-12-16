import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; // import environment มาใช้
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
    private apiUrl = `${environment.apiUrl}/categories`;

     constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
  // ยิงไปที่ API ที่เราเพิ่งสร้างตะกี้
  return this.http.get<Category[]>(`${this.apiUrl}`); 
  }
}
