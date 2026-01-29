import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxPieChartModule } from 'devextreme-angular'; // ใช้แค่กราฟ
import { BorrowService } from '../../services/borrow';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, DxPieChartModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  summaryData = { total: 0, pending: 0, approved: 0, returned: 0 };
  chartData: any[] = [];

  constructor(private borrowService: BorrowService) {}

  ngOnInit() {
    // ดึงข้อมูลมาคำนวณกราฟอย่างเดียว
    this.borrowService.getAllRequests().subscribe(data => {
        this.calculateStats(data);
    });
  }

  calculateStats(data: any[]) {
    this.summaryData.total = data.length;
    this.summaryData.pending = data.filter((r: any) => r.status === 1).length;
    this.summaryData.approved = data.filter((r: any) => r.status === 2).length;
    this.summaryData.returned = data.filter((r: any) => r.status === 4).length;

    this.chartData = [
      { status: 'Pending', count: this.summaryData.pending, color: '#f59e0b' },
      { status: 'Active', count: this.summaryData.approved, color: '#10b981' },
      { status: 'Returned', count: this.summaryData.returned, color: '#6b7280' },
      { status: 'Rejected', count: data.filter((r: any) => r.status === 3).length, color: '#ef4444' }
    ];
  }
}