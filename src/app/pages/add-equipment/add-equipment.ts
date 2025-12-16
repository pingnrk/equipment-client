import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  DxFormModule,
  DxButtonModule,
  DxFileUploaderModule,
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxNumberBoxModule,
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { EquipmentService } from '../../services/equipment';
import { Category, CategoryService } from '../../services/categories';

// Import Service และ Interface ที่เราสร้างในข้อ 1

@Component({
  selector: 'app-add-equipment',
  standalone: true,
  imports: [
    CommonModule,
    DxFormModule,
    DxButtonModule,
    DxFileUploaderModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxNumberBoxModule,
  ],
  templateUrl: './add-equipment.html',
  styleUrl: './add-equipment.css',
})
export class AddEquipment implements OnInit {
  
  // ตัวแปรสำหรับเก็บข้อมูลที่จะส่งไปบันทึก
  equipmentData = {
    code: '',
    name: '',
    description: '',
    categoryId: null, // เริ่มต้นเป็น null บังคับให้ user เลือก
    stock: 1,
    isUnlimited: false,
  };

  selectedFile: File | null = null;
  isLoading = false;

  // ตัวแปรสำหรับเก็บรายการใน Dropdown
  categories: Category[] = [];

  constructor(private equipmentService: EquipmentService, private router: Router,private categoryService: CategoryService) {}

  // ทำงานทันทีเมื่อหน้าเว็บโหลด
  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        notify('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้', 'error', 3000);
      }
    });
  }

  onFileSelected(e: any) {
    if (e.value && e.value.length > 0) {
      this.selectedFile = e.value[0];
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit(e: any) {
    e.preventDefault();

    // 1. ตรวจสอบ Validation (DevExtreme Rules)
    if (e.validationGroup && !e.validationGroup.validate().isValid) {
      notify('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning', 2000);
      return;
    }

    // 2. ตรวจสอบ Category ว่าเลือกหรือยัง (กรณี Dropdown)
    if (!this.equipmentData.categoryId) {
        notify('กรุณาเลือกหมวดหมู่ (Category)', 'warning', 2000);
        return;
    }

    this.isLoading = true;

    // 3. เตรียม FormData
    const formData = new FormData();
    formData.append('code', this.equipmentData.code);
    formData.append('name', this.equipmentData.name);
    formData.append('categoryId', String(this.equipmentData.categoryId || ''));
    formData.append('stock', this.equipmentData.stock.toString());
    formData.append('isUnlimited', this.equipmentData.isUnlimited.toString());
    formData.append('description', this.equipmentData.description || '');

    // ชื่อ 'ImageFile' ต้องตรงกับ Property ใน C# (ระวังตัวพิมพ์เล็ก/ใหญ่)
    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile, this.selectedFile.name);
    }

    // 4. ส่งข้อมูลไปที่ Service
    this.equipmentService.create(formData).subscribe({
      next: () => {
        this.isLoading = false;
        notify('เพิ่มอุปกรณ์สำเร็จ!', 'success', 3000);
        this.router.navigate(['/equipments']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Backend Error:', err);
        let errorMessage = 'เกิดข้อผิดพลาดในการบันทึก';
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (typeof err.error === 'string') {
          errorMessage = err.error;
        }
        notify(errorMessage, 'error', 5000);
      },
    });
  }
}