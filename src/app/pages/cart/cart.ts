import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import notify from 'devextreme/ui/notify';
import {
  DxDataGridModule,
  DxFormModule,
  DxButtonModule,
  DxDateBoxModule,
} from 'devextreme-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, DxDataGridModule, DxFormModule, DxButtonModule, DxDateBoxModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  selectedItems: any[] = [];

  bookingData = {
    startDate: new Date(),
    endDate: new Date(),
  };

  minDate = new Date(); // วันปัจจุบัน (ห้ามเลือกอดีต)

  constructor(private cartService: CartService, private router: Router, private http: HttpClient) {
    // เซ็ตให้เป็นเวลาเที่ยงคืน เพื่อไม่ให้ติดปัญหา Timezone
    this.minDate.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    const items = this.cartService.getItems();

    // ถ้าไม่มีของในตะกร้า ให้ดีดกลับ
    if (items.length === 0) {
      this.router.navigate(['/equipments']);
      return;
    }

    // แปลงข้อมูล: เพิ่ม field 'quantityRequest' เริ่มต้นเป็น 1
    this.selectedItems = items.map((item) => ({
      ...item,
      quantityRequest: 1,
    }));
  }

  goBack() {
    this.router.navigate(['/equipments']);
  }

  onSubmit() {
    // 1. Validation วันที่
    if (this.bookingData.endDate < this.bookingData.startDate) {
      notify('End Date must be after Start Date', 'error', 3000);
      return;
    }

    // 2. เตรียมข้อมูลส่ง Backend (ตาม DTO ที่เราแก้ไว้ล่าสุด)
    const payload = {
      startDate: this.formatDate(this.bookingData.startDate),
      endDate: this.formatDate(this.bookingData.endDate),
      items: this.selectedItems.map((i) => ({
        equipmentId: i.id,
        quantity: i.quantityRequest,
      })),
    };

    // 3. ยิง API (API_URL ควรแยก config แต่ใส่ตรงนี้ไปก่อนเพื่อความไว)
    this.http.post('http://localhost:5032/api/borrowrequests', payload).subscribe({
      next: (res) => {
        notify('Request submitted successfully!', 'success', 3000);
        this.cartService.clearCart(); // ล้างตะกร้า
        this.router.navigate(['/equipments']); // หรือไปหน้า History
      },
      error: (err) => {
        console.error(err);
        notify(err.error || 'Submit failed', 'error', 5000);
      },
    });
  }

  // Helper แปลง Date Object -> "YYYY-MM-DD"
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
