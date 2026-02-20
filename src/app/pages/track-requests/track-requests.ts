import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular'; // ใช้แค่ Grid ส่วนปุ่มใช้ Bootstrap button ธรรมดาได้
import { BorrowService } from '../../services/borrow';
import { BorrowRequest } from '../../services/borrow.interface';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-track-requests',
  standalone: true,
  imports: [CommonModule, DxDataGridModule], // ไม่ต้อง import DxButtonModule ถ้าใช้ button ของ html/bootstrap
  templateUrl: './track-requests.html',
  styleUrl: './track-requests.css',
})
export class TrackRequests implements OnInit {
  pendingRequests: BorrowRequest[] = [];
  isLoading: Observable<boolean>;

  constructor(
    private borrowService: BorrowService,
    private LoadingService: LoadingService,
  ) {
    this.isLoading = this.LoadingService.isLoading;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.LoadingService.show();
    this.borrowService
      .getMyRequests()
      .pipe(finalize(() => this.LoadingService.hide()))
      .subscribe({
        next: (res) => {
          this.pendingRequests = res.filter((item) => item.status === 1 || item.status === 2);
        },
        error: (err) => {
          console.error('Error loading requests:', err);
        },
      });
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1:
        return 'Pending Approval';
      case 2:
        return 'Approved / To Pick up';
      case 3:
        return 'Rejected';
      case 4:
        return 'Returned';
      default:
        return 'Unknown';
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
