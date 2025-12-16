import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // ลบ HttpHeaders ออก
import { environment } from '../../environments/environment';
import { Equipment } from './equipment.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/borrowrequests`;
  private selectedItems = new BehaviorSubject<Equipment[]>([]);
  selectedItems$ = this.selectedItems.asObservable();

  constructor(private http: HttpClient) {}

  setItems(items: Equipment[]) {
    this.selectedItems.next(items);
  }

  getItems(): Equipment[] {
    return this.selectedItems.getValue();
  }

  clearCart() {
    this.selectedItems.next([]);
  }

  submitBorrowRequest(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
