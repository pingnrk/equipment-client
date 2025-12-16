import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { BorrowService } from '../../services/borrow';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  requests: any[] = [];

  constructor(private borrowService: BorrowService) {}

  ngOnInit(): void {
    this.loadData();
  }

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

  getStatusColor(status: number) {
    switch (status) {
      case 1:
        return 'bg-yellow-100 text-yellow-800'; // Pending (เหลือง)
      case 2:
        return 'bg-green-100 text-green-800'; // Approved (เขียว)
      case 3:
        return 'bg-red-100 text-red-800'; // Rejected (แดง)
      case 4:
        return 'bg-gray-100 text-gray-800'; // Returned (เทา)
      default:
        return '';
    }
  }
}
