import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridModule, DxButtonModule, DxDataGridComponent } from 'devextreme-angular';
import { EquipmentService } from '../../services/equipment';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { Equipment } from '../../services/equipment.interface'; // ตรวจสอบ path ให้ถูกต้องตามโปรเจกต์จริง

@Component({
  selector: 'app-equipments',
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './equipments.html',
  styleUrl: './equipments.css',
})
export class Equipments implements OnInit {
  equipments: Equipment[] = [];
  selectedItemKeys: string[] = [];
  isAdmin = false;

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid!: DxDataGridComponent;

  constructor(
    private equipmentService: EquipmentService,
    public authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    // ⚠️ สำคัญ: ต้อง Bind this ไม่งั้น DevExtreme จะเรียก function แล้วหา router ไม่เจอ
    this.onEditClick = this.onEditClick.bind(this);
  }

  ngOnInit(): void {
    this.loadData();
    // เช็คสิทธิ์ Admin
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'Admin';
  }

  loadData() {
    this.equipmentService.getAll().subscribe({
      next: (data) => {
        this.equipments = data;
      },
      error: (err) => console.error('Error fetching data:', err),
    });
  }

  getFullImageUrl(relativePath: string): string {
    return this.equipmentService.getImageUrl(relativePath);
  }

  // ✅ ฟังก์ชันสำหรับปุ่ม Edit ในตาราง
  onEditClick(e: any) {
    if (e.row && e.row.data && e.row.data.id) {
       const id = e.row.data.id;
       this.router.navigate(['/equipments/edit', id]);
    }
  }

  async onProceed() {
    if (!this.authService.getToken()) {
      notify('Please login to continue borrowing.', 'warning', 2000);
      this.router.navigate(['/login']);
      return;
    }

    const selectedData = await this.dataGrid.instance.getSelectedRowsData();
    if (selectedData.length === 0) {
      notify('Please select at least one item', 'warning', 2000);
      return;
    }
    this.cartService.setItems(selectedData);
    this.router.navigate(['/cart']);
  }

  goToAddPage() {
    // ปรับ URL ให้ตรงกับ Routing ที่ตั้งไว้ (Add/Edit ใช้ Component เดียวกัน)
    this.router.navigate(['/equipments/add']);
  }
}