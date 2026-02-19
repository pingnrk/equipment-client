import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BorrowRequest, BorrowRequestDto } from './borrow.interface';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class BorrowService {
  private apiUrl = `${environment.apiUrl}/borrowrequests`;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      this.toastService.show(`Error ${operation}. Please try again.`, 'error');
      console.error(`Error during ${operation}:`, error.error);
      return throwError(() => error);
    };
  }

  submitRequest(data: BorrowRequestDto): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      catchError(this.handleError('submitting request'))
    );
  }

  getAllRequests(): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(this.apiUrl).pipe(
      catchError(this.handleError('fetching all requests'))
    );
  }

  approveRequest(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {}).pipe(
      catchError(this.handleError('approving request'))
    );
  }

  rejectRequest(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, {}).pipe(
      catchError(this.handleError('rejecting request'))
    );
  }

  returnRequest(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/return`, {}).pipe(
      catchError(this.handleError('returning request'))
    );
  }

  getMyRequests(): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(`${this.apiUrl}/my-requests`).pipe(
      catchError(this.handleError('fetching your requests'))
    );
  }
}
