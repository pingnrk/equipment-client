import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Equipment } from './equipment.interface';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/borrowrequests`;
  private selectedItems = new BehaviorSubject<Equipment[]>([]);
  selectedItems$ = this.selectedItems.asObservable();

  constructor(private http: HttpClient, private toastService: ToastService) {}

  setItems(items: Equipment[]) {
    this.selectedItems.next(items);
  }

  getItems(): Equipment[] {
    return this.selectedItems.getValue();
  }

  clearCart() {
    this.selectedItems.next([]);
  }

  // NOTE: This method duplicates functionality in BorrowService.
  // Consider refactoring to have components call BorrowService directly.
  submitBorrowRequest(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastService.show('Error submitting borrow request.', 'error');
        return throwError(() => error);
      })
    );
  }
}
