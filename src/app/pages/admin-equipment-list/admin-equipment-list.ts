import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { EquipmentService } from '../../services/equipment';
import { confirm } from 'devextreme/ui/dialog';
import { LoadingService } from '../../services/loading.service';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-admin-equipment-list',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-equipment-list.html',
  styleUrl: './admin-equipment-list.css',
})
export class AdminEquipmentList implements OnInit {
  equipments: any[] = [];
  isLoading: Observable<boolean>;

  constructor(
    private service: EquipmentService,
    private equipmentService: EquipmentService,
    private router: Router,
    private loadingService: LoadingService,
  ) {
    this.isLoading = this.loadingService.isLoading;
    this.onEditClick = this.onEditClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.service
      .getAll()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe((data) => (this.equipments = data));
  }

  goToAdd() {
    this.router.navigate(['/admin/items/add']);
  }

  onEditClick(e: any) {
    this.router.navigate(['/admin/items/edit', e.row.data.id]); // ไปหน้า Edit
  }

  onDeleteClick = (e: any) => {
    const itemToDelete = e.row.data; // ดึงข้อมูลแถวนั้นมา
    confirm(`ต้องการลบรายการ "${itemToDelete.name}" ใช่หรือไม่?`, 'ยืนยันการลบ').then((result) => {
      if (result) {
        this.equipmentService.delete(itemToDelete.id).subscribe({
          next: () => {
            notify('ลบข้อมูลสำเร็จ', 'success', 3000);
            this.loadData();
          },
          error: (err) => {
            console.error(err);
            notify('เกิดข้อผิดพลาดในการลบ', 'error', 3000);
          },
        });
      }
    });
  };

  getFullImageUrl(base64String: string): string {
    if (!base64String) {
      return 'assets/no-image.png';
    }
    return base64String;
  }
}
