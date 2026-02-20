import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxPieChartModule } from 'devextreme-angular';
import { BorrowService } from '../../services/borrow';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, DxPieChartModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  summaryData = {
    total: 0,
    pending: 0,
    approved: 0,
    returned: 0,
  };
  chartData: any[] = [];
  isLoading: Observable<boolean>;

  constructor(
    private borrowService: BorrowService,
    private loadingService: LoadingService,
  ) {
    this.isLoading = this.loadingService.isLoading;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.borrowService
      .getAllRequests()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (data) => {
          this.calculateDashboard(data);
        },
        error: (err) => console.error(err),
      });
  }

  calculateDashboard(requests: any[]) {
    this.summaryData.total = requests.length;
    this.summaryData.pending = requests.filter((r) => r.status === 1).length;
    this.summaryData.approved = requests.filter((r) => r.status === 2).length; // Active

    // สร้างข้อมูลกราฟ
    this.chartData = [
      { status: 'รออนุมัติ', count: this.summaryData.pending },
      { status: 'อนุมัติแล้ว', count: this.summaryData.approved },
      { status: 'คืนแล้ว', count: requests.filter((r) => r.status === 4).length },
      { status: 'ไม่อนุมัติ', count: requests.filter((r) => r.status === 3).length },
    ];
  }

  // ฟังก์ชันจัด Format ป้ายกำกับกราฟ (ที่ผมบอกไปรอบที่แล้ว)
  customizeLabel(arg: any) {
    return `${arg.argumentText}: ${arg.valueText}`;
  }
}
