import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // ไม่ต้องใช้ HttpHeaders แล้ว
import { Observable } from 'rxjs';
import { BorrowRequest } from './borrow.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BorrowService {
  private apiUrl = `${environment.apiUrl}/borrowrequests`;

  constructor(private http: HttpClient) {}

  getAllRequests(): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(this.apiUrl);
  }

  approveRequest(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectRequest(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, {});
  }

  returnRequest(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/return`, {});
  }

  getMyRequests(): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(`${this.apiUrl}/my-requests`);
  }
}
