import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// ✅ 1. เพิ่ม DxPieChartModule ตรงนี้
import { DxPieChartModule } from 'devextreme-angular';
import { BorrowService } from '../../services/borrow';

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

  constructor(private borrowService: BorrowService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.borrowService.getAllRequests().subscribe({
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
      { status: 'Pending', count: this.summaryData.pending },
      { status: 'Active', count: this.summaryData.approved },
      { status: 'Returned', count: requests.filter((r) => r.status === 4).length },
      { status: 'Rejected', count: requests.filter((r) => r.status === 3).length },
    ];
  }

  // ฟังก์ชันจัด Format ป้ายกำกับกราฟ (ที่ผมบอกไปรอบที่แล้ว)
  customizeLabel(arg: any) {
    return `${arg.argumentText}: ${arg.valueText}`;
  }
}
