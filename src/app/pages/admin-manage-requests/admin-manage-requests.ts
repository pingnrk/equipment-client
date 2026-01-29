import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { BorrowService } from '../../services/borrow';

@Component({
  selector: 'app-admin-manage-requests',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-manage-requests.html', // แยกไฟล์ html
  styleUrls: ['./admin-manage-requests.css']   // แยกไฟล์ css
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

  ngOnInit(): void { this.loadData(); }

  loadData() {
    this.borrowService.getAllRequests().subscribe({
      next: (data) => (this.requests = data),
      error: (err) => console.error(err),
    });
  }
  onApprove(id: string) {
    if (!confirm('Confirm Approve? Stock will be deducted.')) return;

    this.borrowService.approveRequest(id).subscribe({
      next: () => {
        notify('Approved successfully', 'success', 2000);
        this.loadData(); // โหลดข้อมูลใหม่เพื่ออัปเดตสถานะ
      },
      error: (err) => {
        console.error(err);
        notify(err.error?.message || 'Error approving', 'error', 3000);
      },
    });
  }

  onReject(id: string) {
    if (!confirm('Confirm Reject?')) return;

    this.borrowService.rejectRequest(id).subscribe({
      next: () => {
        notify('Rejected', 'success', 2000);
        this.loadData();
      },
      error: (err) => notify('Error rejecting', 'error', 3000),
    });
  }

  onReturn(id: string) {
    if (!confirm('Confirm Return? Stock will be restored.')) return;

    this.borrowService.returnRequest(id).subscribe({
      next: () => {
        notify('Items returned successfully. Stock updated.', 'success', 2000);
        this.loadData(); // โหลดข้อมูลใหม่ สถานะจะเปลี่ยนเป็น Returned (4)
      },
      error: (err) => {
        console.error(err);
        notify(err.error?.message || 'Error returning item', 'error', 3000);
      },
    });
  }
    getStatusText(status: number) {
    switch (status) {
      case 1:
        return 'Pending';
      case 2:
        return 'Approved';
      case 3:
        return 'Rejected';
      case 4:
        return 'Returned';
      default:
        return 'Unknown';
    }
  }
  calculateDashboard() {
    // 1. นับจำนวนตามสถานะ
    this.summaryData.total = this.requests.length;
    this.summaryData.pending = this.requests.filter(r => r.status === 1).length;
    this.summaryData.approved = this.requests.filter(r => r.status === 2).length;
    this.summaryData.returned = this.requests.filter(r => r.status === 4).length; // สมมติ 4 คือคืนแล้ว

    // 2. เตรียมข้อมูลใส่กราฟ
    this.chartData = [
      { status: 'Pending', count: this.summaryData.pending, color: '#f59e0b' },  // เหลือง
      { status: 'Approved', count: this.summaryData.approved, color: '#10b981' }, // เขียว
      { status: 'Returned', count: this.summaryData.returned, color: '#6b7280' }, // เทา
      { status: 'Rejected', count: this.requests.filter(r => r.status === 3).length, color: '#ef4444' } // แดง
    ];
  }
}