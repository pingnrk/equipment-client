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
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css',
})
export class AdminReports implements OnInit {
  reportData: any[] = [];
  isLoading: Observable<boolean>;

  constructor(
    private borrowService: BorrowService,
    private loadingService: LoadingService,
  ) {
    this.isLoading = this.loadingService.isLoading;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.borrowService
      .getAllRequests()
      .pipe(finalize(() => this.loadingService.hide()))

      .subscribe((data) => {
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
        return 'รออนุมัติ'; // Pending
      case 2:
        return 'อนุมัติแล้ว'; // Approved
      case 3:
        return 'ไม่อนุมัติ'; // Rejected
      case 4:
        return 'คืนแล้ว'; // Returned
      default:
        return 'ไม่ทราบสถานะ'; // Unknown
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
