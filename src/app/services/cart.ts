import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // เพิ่ม HttpHeaders
import { Equipment } from './equipment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // ควรย้ายไปไว้ใน environment.ts แต่ใส่ตรงนี้ก่อนตามที่ขอ
  private apiUrl = 'https://localhost:7273/api/borrowrequests';

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

  // ฟังก์ชันยิง API
  submitBorrowRequest(payload: any): Observable<any> {
    // 1. ดึง Token จาก LocalStorage (สมมติว่าคุณเก็บไว้ชื่อ 'token')
    const token = localStorage.getItem('token');

    // 2. สร้าง Header แนบ Token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // 3. ยิง POST ไปพร้อม Header
    return this.http.post(this.apiUrl, payload, { headers });
  }
}
