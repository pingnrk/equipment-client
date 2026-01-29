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
import { CategoryService, Category } from '../../services/categories';
// ✅ Import Environment เข้ามา
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // ✅ เพิ่ม Sanitizer สำหรับ Base64

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
  title = 'Add New Equipment';
  btnLabel = 'Save Equipment';
  isLoading = false;

  equipmentData: any = {
    code: '',
    name: '',
    description: '',
    categoryId: null,
    stock: 1,
    isUnlimited: false,
    imageUrl: '',
  };

  selectedFile: File | null = null;
  categories: Category[] = [];

  constructor(
    private equipmentService: EquipmentService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer // ✅ Inject Sanitizer เพื่อความปลอดภัยของ Base64
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.checkEditMode();
  }

  // ✅ แก้ฟังก์ชันนี้ให้ใช้ environment และรองรับ Base64 สมบูรณ์
  getPreviewUrl(relativePath: string): SafeUrl | string {
    if (!relativePath) return '';

    // 1. ถ้าเป็น Base64 (data:image/...) ให้ Bypass Security แล้วส่งกลับเลย
    if (relativePath.startsWith('data:')) {
      return this.sanitizer.bypassSecurityTrustUrl(relativePath);
    }

    // 2. ถ้าเป็น Link เต็มอยู่แล้ว
    if (relativePath.startsWith('http')) return relativePath;

    // 3. จัดการ Path เก่า (เผื่อมี)
    let cleanPath = relativePath.replace(/\\/g, '/');
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }

    // 4. ดึง Domain จาก environment.apiUrl
    // environment.apiUrl ของพี่คือ ".../api" เราต้องตัด "/api" ออกเพื่อให้ได้ Root Domain
    const baseUrl = environment.apiUrl.replace('/api', '');

    return `${baseUrl}/${cleanPath}`;
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
      this.title = 'Edit Equipment';
      this.btnLabel = 'Update Equipment';
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

    const formData = new FormData();
    formData.append('code', this.equipmentData.code);
    formData.append('name', this.equipmentData.name);
    formData.append('categoryId', String(this.equipmentData.categoryId || ''));
    formData.append('stock', this.equipmentData.stock.toString());
    formData.append('isUnlimited', this.equipmentData.isUnlimited.toString());
    formData.append('description', this.equipmentData.description || '');

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile, this.selectedFile.name);
    }

    if (this.isEditMode) {
      this.equipmentService.update(this.equipmentId, formData).subscribe({
        next: () => this.handleSuccess('แก้ไขข้อมูลสำเร็จ!'),
        error: (err) => this.handleError(err),
      });
    } else {
      this.equipmentService.create(formData).subscribe({
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
    this.router.navigate(['/equipments']);
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
    this.router.navigate(['/equipments']);
  }
}
