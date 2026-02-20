import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { finalize, lastValueFrom, Observable } from 'rxjs';
import { CategoryService } from '../../services/categories';
import { Category } from '../../services/equipment.interface';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-categories.html',
  styleUrls: ['./admin-categories.css'], // ถ้ามีไฟล์ css
})
export class AdminCategories implements OnInit {
  categories: Category[] = [];
  isLoading: Observable<boolean>;

  constructor(
    private categoryService: CategoryService,
    private loadingService: LoadingService,
  ) {
    this.isLoading = this.loadingService.isLoading;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.categoryService
      .getCategories()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (data) => (this.categories = data),
      });
  }

  // 🔥 Insert
  async onRowInserting(e: any) {
    try {
      await lastValueFrom(this.categoryService.create(e.data));
      notify('สร้างหมวดหมู่สำเร็จ', 'success', 2000);
      this.loadData();
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
