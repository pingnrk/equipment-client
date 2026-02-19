import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { lastValueFrom } from 'rxjs';
import { CategoryService } from '../../services/categories';
import { Category } from '../../services/equipment.interface';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-categories.html',
  styleUrls: ['./admin-categories.css'] // ถ้ามีไฟล์ css
})
export class AdminCategories implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => notify('โหลดข้อมูลหมวดหมู่ล้มเหลว', 'error', 2000)
    });
  }

  // 🔥 Insert
async onRowInserting(e: any) {
    try {
      // 1. ส่งข้อมูลไปสร้าง (รอจนเสร็จ)
      await lastValueFrom(this.categoryService.create(e.data));

      notify('สร้างหมวดหมู่สำเร็จ', 'success', 2000);

      // ✅ 2. เพิ่มบรรทัดนี้! สั่งให้โหลดข้อมูลใหม่จาก DB ทันที
      // Grid จะได้รู้ว่า ID จริงๆ คืออะไร
      this.loadData();

      // 💡 หมายเหตุ: e.cancel = false (ค่า default)
      // DevExtreme จะพยายามเพิ่มแถวเอง แต่พอเรา loadData ทับ มันจะเนียนไปเลย

    } catch (err) {
      notify('สร้างล้มเหลว (ชื่ออาจซ้ำ)', 'error', 2000);
      e.cancel = true; // ถ้าพัง สั่งยกเลิกการเพิ่มแถว
    }
  }

  // 🔥 Update
  async onRowUpdating(e: any) {
    const updatedData = { ...e.oldData, ...e.newData };
    try {
      await lastValueFrom(this.categoryService.update(e.key, updatedData));
      notify('แก้ไขสำเร็จ', 'success', 2000);
    } catch (err) {
      notify('แก้ไขล้มเหลว', 'error', 2000);
      e.cancel = true;
    }
  }

  // 🔥 Delete
  async onRowRemoving(e: any) {
    try {
      await lastValueFrom(this.categoryService.delete(e.key));
      notify('ลบสำเร็จ', 'success', 2000);
    } catch (err) {
      notify('ลบไม่ได้ (อาจมีอุปกรณ์ใช้อยู่)', 'error', 2000);
      e.cancel = true;
    }
  }
}
