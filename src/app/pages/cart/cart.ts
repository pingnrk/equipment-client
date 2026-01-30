import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxFormModule, DxButtonModule, DxDateBoxModule } from 'devextreme-angular';
import { Equipment } from '../../services/equipment.interface'; // หรือ path ที่คุณเก็บ interface ไว้

interface CartItem extends Equipment {
  quantityRequest: number;
}
@Component({
  selector: 'app-cart',
  imports: [CommonModule, DxDataGridModule, DxFormModule, DxButtonModule, DxDateBoxModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  
  selectedItems: CartItem[] = [];

  bookingData = {
    startDate: new Date(),
    endDate: new Date(),
  };
  minDate = new Date();

  constructor(private cartService: CartService, private router: Router) {
    this.minDate.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems() {
    const items = this.cartService.getItems();

    if (items.length === 0) {
      this.router.navigate(['/equipments']);
      return;
    }

    this.selectedItems = items.map((item) => {
      return {
        ...item,                 // ก๊อปปี้ข้อมูลเดิม (id, name, imageUrl, etc.)
        quantityRequest: 1       // เพิ่มค่า default จำนวนที่ยืมเป็น 1
      } as CartItem;             // *** บังคับบอกมันว่า นี่คือ CartItem นะ ***
    });
  }

  onRowRemoved(e: any) {
    this.cartService.setItems(this.selectedItems); 
    
    if (this.selectedItems.length === 0) {
        this.cartService.clearCart();
        this.router.navigate(['/equipments']);
    }
  }

  goBack() {
    this.cartService.clearCart(); 
    this.router.navigate(['/equipments']);
  }

  onSubmit() {
    if (this.bookingData.endDate < this.bookingData.startDate) {
      notify('End Date must be after Start Date', 'error', 3000);
      return;
    }

    const payload = {
      startDate: this.bookingData.startDate, 
      endDate: this.bookingData.endDate,
      items: this.selectedItems.map((i) => ({
        equipmentId: i.id,
        quantity: i.quantityRequest,
      })),
    };

    this.cartService.submitBorrowRequest(payload).subscribe({
      next: (res) => {
        notify('Request submitted successfully!', 'success', 3000);
        this.cartService.clearCart();
        this.router.navigate(['/equipments']); 
      },
      error: (err) => {
        console.error(err);
        const errorMsg = err.error?.message || err.error || 'Submit failed';
        notify(errorMsg, 'error', 5000);
      },
    });
  }

  getFullImageUrl(base64String: string): string {
    if (!base64String) return 'assets/no-image.png';
    if (base64String.startsWith('data:') || base64String.startsWith('http')) return base64String;
    return `https://equipment-api.onrender.com/${base64String}`;
  }
}