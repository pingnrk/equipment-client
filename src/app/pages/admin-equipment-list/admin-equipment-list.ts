import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { EquipmentService } from '../../services/equipment';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'app-admin-equipment-list',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-equipment-list.html',
  styleUrl: './admin-equipment-list.css',
})
export class AdminEquipmentList implements OnInit {
  equipments: any[] = [];

  constructor(
    private service: EquipmentService,
    private equipmentService: EquipmentService,
    private router: Router,
  ) {
    this.onEditClick = this.onEditClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe((data) => (this.equipments = data));
  }

  goToAdd() {
    this.router.navigate(['/admin/items/add']); // ไปหน้า Add
  }

  onEditClick(e: any) {
    this.router.navigate(['/admin/items/edit', e.row.data.id]); // ไปหน้า Edit
  }

  onDeleteClick = (e: any) => {
    const itemToDelete = e.row.data; // ดึงข้อมูลแถวนั้นมา
    confirm(`ต้องการลบรายการ "${itemToDelete.name}" ใช่หรือไม่?`, 'ยืนยันการลบ').then((result) => {
      if (result) {
        // ถ้าตอบ Yes -> ยิง API ลบ
        this.equipmentService.delete(itemToDelete.id).subscribe({
          next: () => {
            notify('ลบข้อมูลสำเร็จ', 'success', 3000);
            this.loadData(); // 🔄 โหลดข้อมูลใหม่ตารางจะได้อัปเดต
          },
          error: (err) => {
            console.error(err);
            notify('เกิดข้อผิดพลาดในการลบ', 'error', 3000);
          },
        });
      }
    });
  };
  // ในไฟล์ admin-equipment-list.ts

  getFullImageUrl(base64String: string): string {
    // 1. ถ้าไม่มีข้อมูล หรือเป็น null/empty -> ส่งรูป No Image กลับไป
    if (!base64String) {
      return 'assets/no-image.png';
    }

    // 2. ถ้าเป็น Base64 อยู่แล้ว (มีหัว data:image...) -> ส่งกลับไปเลย จบ!
    // (ไม่ต้องเอา API URL มาต่อหน้ามันอีกแล้ว)
    return base64String;
  }
}
