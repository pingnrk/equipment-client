import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular'; // ใช้แค่ Grid ส่วนปุ่มใช้ Bootstrap button ธรรมดาได้
import { BorrowService } from '../../services/borrow';
import { BorrowRequest } from '../../services/borrow.interface';

@Component({
  selector: 'app-track-requests',
  standalone: true,
  imports: [CommonModule, DxDataGridModule], // ไม่ต้อง import DxButtonModule ถ้าใช้ button ของ html/bootstrap
  templateUrl: './track-requests.html',
  styleUrl: './track-requests.css'
})
export class TrackRequests implements OnInit {

  // ตัวแปรเก็บข้อมูลที่จะเอามาโชว์
  pendingRequests: BorrowRequest[] = [];

  constructor(private borrowService: BorrowService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.borrowService.getMyRequests().subscribe({
      next: (res) => {
        // *** ไฮไลท์สำคัญ: กรองเอาเฉพาะที่ยังไม่จบกระบวนการ ***
        // 1 = Pending (รออนุมัติ)
        // 2 = Approved (อนุมัติแล้ว รอรับของ/กำลังใช้)
        this.pendingRequests = res.filter(item => item.status === 1 || item.status === 2);
      },
      error: (err) => {
        console.error('Error loading requests:', err);
      }
    });
  }

  // แปลงตัวเลขสถานะเป็นข้อความ
  getStatusText(status: number): string {
    switch (status) {
      case 1: return 'Pending Approval';
      case 2: return 'Approved / To Pick up';
      case 3: return 'Rejected';
      case 4: return 'Returned';
      default: return 'Unknown';
    }
  }

  // ฟังก์ชันจัดการรูปภาพ (เหมือนที่แก้ไปตะกี้)
  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return 'assets/no-image.png';

    // ถ้าเป็น Base64 หรือ Link เต็มอยู่แล้ว
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) {
        return imageUrl;
    }

    // เผื่อไว้กรณีส่งมาแค่ชื่อไฟล์
    return `https://equipment-api.onrender.com/${imageUrl}`;
  }
}
