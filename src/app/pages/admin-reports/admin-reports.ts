import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import { BorrowService } from '../../services/borrow';

// ❌ ลบอันเก่าออก
// import { Workbook } from 'exceljs';
// import { saveAs } from 'file-saver';

// ✅ ใส่อันใหม่เข้าไปแทน (แก้ import ให้รองรับทุกเครื่อง)
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css',
})
export class AdminReports implements OnInit {
  reportData: any[] = [];

  constructor(private borrowService: BorrowService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.borrowService.getAllRequests().subscribe((data) => {
      this.reportData = data.map((req: any) => ({
        ...req,
        itemsText: req.items.map((i: any) => `${i.equipment.name} (${i.quantity})`).join(', '),
        statusText: this.getStatusText(req.status),
      }));
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

  onExporting(e: any) {
    // ✅ แก้ตรงนี้: เรียกผ่าน ExcelJS.Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('BorrowData');

    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'BorrowReport.xlsx');
      });
    });

    e.cancel = true;
  }
}
