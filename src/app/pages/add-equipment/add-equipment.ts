import { Component } from '@angular/core';
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

@Component({
  selector: 'app-add-equipment',
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
export class AddEquipment {
  equipmentData = {
    code: '',
    name: '',
    description: '',
    categoryId: 1,
    stock: 1,
    isUnlimited: false,
  };

  selectedFile: File | null = null;
  isLoading = false;

  categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Furniture' },
    { id: 3, name: 'Stationery' },
  ];

  constructor(private equipmentService: EquipmentService, private router: Router) {}

  onFileSelected(e: any) {
    // DevExtreme จะส่ง value มาเป็น Array เสมอ [File1, File2]
    if (e.value && e.value.length > 0) {
      this.selectedFile = e.value[0];
      console.log('File selected:', this.selectedFile); // เช็คใน Console ดูว่ามีข้อมูลไฟล์ไหม
    } else {
      this.selectedFile = null;
    }
  }
  onSubmit(e: any) {
    e.preventDefault();
    this.isLoading = true;

    const formData = new FormData();
    formData.append('code', this.equipmentData.code);
    formData.append('name', this.equipmentData.name);
    formData.append('categoryId', this.equipmentData.categoryId.toString());
    formData.append('stock', this.equipmentData.stock.toString());
    formData.append('isUnlimited', this.equipmentData.isUnlimited.toString());
    formData.append('description', this.equipmentData.description || '');

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile, this.selectedFile.name);
    }

    console.log('--- Checking FormData ---');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.equipmentService.create(formData).subscribe({
      next: () => {
        this.isLoading = false;
        notify('Equipment added successfully!', 'success', 3000);
        this.router.navigate(['/equipments']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Backend Error:', err);

        let errorMessage = 'Failed to add equipment';

        if (typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        notify(errorMessage, 'error', 5000);
      },
    });
  }
}
