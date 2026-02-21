import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DxFormModule,
  DxButtonModule,
  DxFileUploaderModule,
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxNumberBoxModule,
  DxTextAreaModule,
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import { EquipmentService } from '../../services/equipment';
import { CategoryService } from '../../services/categories';
import { Category, CreateEquipmentDto } from '../../services/equipment.interface';

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
    DxTextAreaModule,
  ],
  templateUrl: './add-equipment.html',
  styleUrl: './add-equipment.css',
})
export class AddEquipment implements OnInit {
  newImagePreview: string | ArrayBuffer | null = null;

  equipmentId: string = '';
  isEditMode = false;
  title = 'เพิ่มครุภัณฑ์ใหม่';
  btnLabel = 'บันทึกข้อมูล';
  isLoading = false;

  equipmentData: any = {
    code: '',
    name: '',
    categoryId: null,
    stock: 1,
    imageUrl: '',
  };

  selectedFile: File | null = null;
  categories: Category[] = [];

  constructor(
    private equipmentService: EquipmentService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.checkEditMode();
  }
  get imageSource(): string | null {
    // 1. ถ้ามีการอัปโหลดใหม่ ให้ใช้รูปใหม่
    if (this.newImagePreview) {
      return this.newImagePreview as string;
    }
    // 2. ถ้ามีรูปเดิมจาก DB ให้ใช้รูปเดิม
    if (this.equipmentData.imageUrl) {
      return this.equipmentData.imageUrl;
    }
    // 3. ถ้าไม่มีห่าไรเลย ส่ง null (HTML จะได้ไปโชว์กล่อง Placeholder)
    return null;
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => {
        console.error('Error loading categories:', err);
        notify('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้', 'error', 3000);
      },
    });
  }

  checkEditMode() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.equipmentId = idParam;
      this.isEditMode = true;
      this.title = 'แก้ไขรายละเอียดครุภัณฑ์ใหม่';
      this.btnLabel = 'บันทึกข้อมูล';
      this.loadEquipmentData(this.equipmentId);
    }
  }

  loadEquipmentData(id: string) {
    this.equipmentService.getById(id).subscribe({
      next: (data) => {
        this.equipmentData = { ...data };
      },
      error: (err) => {
        notify('หาข้อมูลอุปกรณ์ไม่เจอ', 'error', 3000);
        this.router.navigate(['/equipments']);
      },
    });
  }

  onFileSelected(e: any) {
    if (e.value && e.value.length > 0) {
      this.selectedFile = e.value[0];

      const reader = new FileReader();
      reader.onload = (event) => {
        this.newImagePreview = event.target?.result ?? null;
      };
      reader.readAsDataURL(this.selectedFile!);
    } else {
      this.selectedFile = null;
      this.newImagePreview = null;
    }
  }

  onSubmit(e: any) {
    e.preventDefault();

    if (e.validationGroup && !e.validationGroup.validate().isValid) {
      notify('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning', 2000);
      return;
    }

    if (!this.equipmentData.categoryId) {
      notify('กรุณาเลือกหมวดหมู่ (Category)', 'warning', 2000);
      return;
    }

    this.isLoading = true;

    const dto: CreateEquipmentDto = {
      code: this.equipmentData.code,
      name: this.equipmentData.name,
      categoryId: this.equipmentData.categoryId,
      stock: this.equipmentData.stock,
      imageFile: this.selectedFile ?? undefined,
    };

    if (this.isEditMode) {
      this.equipmentService.update(this.equipmentId, dto).subscribe({
        next: () => this.handleSuccess('แก้ไขข้อมูลสำเร็จ!'),
        error: (err) => this.handleError(err),
      });
    } else {
      this.equipmentService.create(dto).subscribe({
        next: () => this.handleSuccess('เพิ่มอุปกรณ์สำเร็จ!'),
        error: (err) => this.handleError(err),
      });
    }
  }

  onDelete() {
    confirm('Are you sure you want to delete this item?', 'Confirm Delete').then((result) => {
      if (result) {
        this.isLoading = true;
        this.equipmentService.delete(this.equipmentId).subscribe({
          next: () => {
            notify('ลบข้อมูลสำเร็จ', 'success', 3000);
            this.router.navigate(['/equipments']);
          },
          error: (err) => {
            this.isLoading = false;
            notify('เกิดข้อผิดพลาดในการลบ', 'error', 3000);
          },
        });
      }
    });
  }
  handleSuccess(msg: string) {
    this.isLoading = false;
    notify(msg, 'success', 3000);
    this.router.navigate(['/admin/items']);
  }

  handleError(err: any) {
    this.isLoading = false;
    console.error('Backend Error:', err);
    let errorMessage = 'เกิดข้อผิดพลาดในการบันทึก';
    if (err.error?.message) {
      errorMessage = err.error.message;
    } else if (typeof err.error === 'string') {
      errorMessage = err.error;
    }
    notify(errorMessage, 'error', 5000);
  }

  onCancel() {
    this.router.navigate(['/admin/items']);
  }
}
