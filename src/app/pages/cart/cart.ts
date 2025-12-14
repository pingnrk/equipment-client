import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router';
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

  minDate = new Date();

  // ลบ HttpClient ออกจาก Constructor
  constructor(private cartService: CartService, private router: Router) {
    this.minDate.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    const items = this.cartService.getItems();

    if (items.length === 0) {
      this.router.navigate(['/equipments']);
      return;
    }

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

    // 2. เตรียมข้อมูล (Payload)
    // หมายเหตุ: Backend C# รับ DateTime การส่งเป็น ISO String ปลอดภัยกว่า
    // แต่ถ้าแบบเดิม FormatDate คุณตรงกับ Backend ก็ใช้ได้ครับ
    const payload = {
      startDate: this.bookingData.startDate, // ส่งเป็น Date Object เลย เดี๋ยว JSON.stringify แปลงเป็น ISO ให้เอง
      endDate: this.bookingData.endDate,
      items: this.selectedItems.map((i) => ({
        equipmentId: i.id,
        quantity: i.quantityRequest,
      })),
    };

    // 3. เรียกใช้ Service
    this.cartService.submitBorrowRequest(payload).subscribe({
      next: (res) => {
        notify('Request submitted successfully!', 'success', 3000);
        this.cartService.clearCart();
        this.router.navigate(['/equipments']); // หรือไปหน้า History
      },
      error: (err) => {
        console.error(err);
        // แสดง Error ที่ Backend ส่งมาจริงๆ
        const errorMsg = err.error?.message || err.error || 'Submit failed';
        notify(errorMsg, 'error', 5000);
      },
    });
  }
}
