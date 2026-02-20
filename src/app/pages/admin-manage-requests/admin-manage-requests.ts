import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DxDataGridModule, DxButtonModule, DxTemplateModule } from 'devextreme-angular';
import { BorrowService } from '../../services/borrow';
import { ToastService } from '../../services/toast.service';
import { LoadingService } from '../../services/loading.service';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-admin-manage-requests',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule, DxTemplateModule],
  templateUrl: './admin-manage-requests.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AdminManageRequests implements OnInit {
  pageType: 'approve' | 'return' = 'approve';
  requests: any[] = [];
  isLoading: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private borrowService: BorrowService,
    private toastService: ToastService,
    private loadingService: LoadingService,
  ) {
    this.isLoading = this.loadingService.isLoading;
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.pageType = data['type'] || 'approve';
      this.loadData();
    });
  }

  loadData() {
    this.loadingService.show();
    this.borrowService
      .getAllRequests()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (data) => {
          if (this.pageType === 'approve') {
            // ✅ หน้า Approve: เอาเฉพาะ Status 1 (Pending)
            this.requests = data.filter((r) => r.status === 1);
          } else {
            // 🔄 หน้า Return: เอาเฉพาะ Status 2 (Approved/Borrowed)
            this.requests = data.filter((r) => r.status === 2);
          }
        },
        error: (err) => {
          console.error(err);
          this.toastService.show('Failed to load data', 'error');
        },
      });
  }

  onApprove(id: string) {
    this.borrowService.approveRequest(id).subscribe({
      next: () => {
        this.toastService.show('Approved successfully', 'success');
        this.loadData(); // รีเฟรชตาราง
      },
      error: () => this.toastService.show('Error approving request', 'error'),
    });
  }

  onReject(id: string) {
    this.borrowService.rejectRequest(id).subscribe({
      next: () => {
        this.toastService.show('Rejected request', 'warning');
        this.loadData();
      },
      error: () => this.toastService.show('Error rejecting request', 'error'),
    });
  }

  onReturn(id: string) {
    this.borrowService.returnRequest(id).subscribe({
      next: () => {
        this.toastService.show('Item returned successfully', 'success');
        this.loadData();
      },
      error: () => this.toastService.show('Error returning item', 'error'),
    });
  }
}
