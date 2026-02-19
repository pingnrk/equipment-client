import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './user.interface';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      this.toastService.show(`Error ${operation}.`, 'error');
      console.error(`Error during ${operation}:`, error.error);
      return throwError(() => error);
    };
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(this.handleError('fetching users'))
    );
  }

  create(data: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, data).pipe(
      catchError(this.handleError('creating user'))
    );
  }

  update(id: string, data: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data).pipe(
      catchError(this.handleError('updating user'))
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError('deleting user'))
    );
  }
}
