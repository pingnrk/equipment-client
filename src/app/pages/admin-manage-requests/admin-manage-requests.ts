import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { BorrowService } from '../../services/borrow';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'app-admin-manage-requests',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-manage-requests.html',
  styleUrls: ['./admin-manage-requests.css']
})
export class AdminManageRequests implements OnInit {
  requests: any[] = [];
  summaryData = {
    total: 0,
    pending: 0,
    approved: 0,
    returned: 0
  };
  chartData: any[] = [];

  constructor(private borrowService: BorrowService) {}

  ngOnInit(): void { 
      this.loadData(); 
  }

  loadData() {
    this.borrowService.getAllRequests().subscribe({
      next: (data) => {
          this.requests = data;
          this.calculateDashboard(); // ✅ เพิ่ม: เรียกคำนวณตัวเลข dashboard
      },
      error: (err) => console.error(err),
    });
  }

  onApprove(id: string) {
    confirm('Confirm Approve? Stock will be deducted.', 'Approve Request').then((result) => {
      if (result) {
        // ถ้ากด Yes ถึงจะทำ
        this.borrowService.approveRequest(id).subscribe({
          next: () => {
            notify('Approved successfully', 'success', 2000);
            this.loadData();
          },
          error: (err) => {
            console.error(err);
            notify(err.error?.message || 'Error approving', 'error', 3000);
          },
        });
      }
    });
  }

  onReject(id: string) {
    confirm('Are you sure you want to reject this request?', 'Reject Request').then((result) => {
      if (result) {
        this.borrowService.rejectRequest(id).subscribe({
          next: () => {
            notify('Rejected', 'success', 2000);
            this.loadData();
          },
          error: (err) => notify('Error rejecting', 'error', 3000),
        });
      }
    });
  }

  onReturn(id: string) {
    confirm('Confirm Return items? Stock will be restored.', 'Return Items').then((result) => {
      if (result) {
        this.borrowService.returnRequest(id).subscribe({
          next: () => {
            notify('Items returned successfully. Stock updated.', 'success', 2000);
            this.loadData();
          },
          error: (err) => {
            console.error(err);
            notify(err.error?.message || 'Error returning item', 'error', 3000);
          },
        });
      }
    });
  }

  getStatusText(status: number) {
    switch (status) {
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 3: return 'Rejected';
      case 4: return 'Returned';
      default: return 'Unknown';
    }
  }

  calculateDashboard() {
    this.summaryData.total = this.requests.length;
    this.summaryData.pending = this.requests.filter(r => r.status === 1).length;
    this.summaryData.approved = this.requests.filter(r => r.status === 2).length;
    this.summaryData.returned = this.requests.filter(r => r.status === 4).length;

    // เตรียมข้อมูลกราฟ (ถ้าอนาคตจะใช้)
    this.chartData = [
      { status: 'Pending', count: this.summaryData.pending, color: '#f59e0b' },
      { status: 'Approved', count: this.summaryData.approved, color: '#10b981' },
      { status: 'Returned', count: this.summaryData.returned, color: '#6b7280' },
      { status: 'Rejected', count: this.requests.filter(r => r.status === 3).length, color: '#ef4444' }
    ];
  }
  
  getFullImageUrl(imageUrl: string): string {
    if (!imageUrl) return 'assets/no-image.png';
    // ✅ เพิ่ม: เช็คว่าถ้าไม่ใช่ base64 หรือ http ให้เติม domain
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) return imageUrl;
    return `https://equipment-api.onrender.com/${imageUrl}`;
  }
}