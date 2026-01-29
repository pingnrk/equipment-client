import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import { BorrowService } from '../../services/borrow';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver'; // ใช้ file-saver ธรรมดา (ลบ -es ออก)
import { exportDataGrid } from 'devextreme/excel_exporter';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css'
})
export class AdminReports implements OnInit {
  reportData: any[] = [];

  constructor(private borrowService: BorrowService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.borrowService.getAllRequests().subscribe(data => {
      this.reportData = data.map((req: any) => ({
        ...req,
        // แปลง Array ของ items ให้เป็น String ยาวๆ
        itemsText: req.items.map((i: any) => `${i.equipment.name} (${i.quantity})`).join(', '),
        statusText: this.getStatusText(req.status)
      }));
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

  // ✅ 2. แก้ฟังก์ชัน Export (เอา require ออก)
  onExporting(e: any) {
    // สร้าง Workbook ใหม่จาก Class ที่ Import มาเลย
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('BorrowData');

    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      autoFilterEnabled: true
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'BorrowReport.xlsx');
      });
    });
    
    // บอก Grid ว่าไม่ต้อง Export แบบ Default (เพราะเราจัดการเองแล้ว)
    e.cancel = true;
  }
}