import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Category } from './equipment.interface';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      this.toastService.show(`Error ${operation}.`, 'error');
      console.error(`Error during ${operation}:`, error.error);
      return throwError(() => error);
    };
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}`).pipe(
      catchError(this.handleError('fetching categories'))
    );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError(`fetching category with id=${id}`))
    );
  }

  create(data: any): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, data).pipe(
      catchError(this.handleError('creating category'))
    );
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data).pipe(
      catchError(this.handleError('updating category'))
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError('deleting category'))
    );
  }
}
