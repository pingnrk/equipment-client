import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { UserService, User } from '../../services/user';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxButtonModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  users: User[] = [];

  // ✅ เอาให้ชัวร์ เลือกตามนี้ (ถ้า DB มีค่าอื่น บอกกูนะ)
  roles = ['Admin', 'Member']; 

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userService.getAll().subscribe({
      next: (data) => {
        // 🔥 Hack: วนลูปแก้ค่า Role ให้ตรงกับ Dropdown เป๊ะๆ (กันพลาดเรื่องตัวเล็ก/ใหญ่)
        this.users = data.map((u: any) => ({
            ...u,
            // ถ้า DB เป็น 'admin' หรือ 'ADMIN' แปลงให้เป็น 'Admin' ตามตัวแปร roles ของเรา
            role: this.roles.find(r => r.toLowerCase() === u.role?.toLowerCase()) || u.role
        }));
      },
      error: (err) => notify('Load users failed', 'error', 2000),
    });
  }

  // 🔥 Insert
  async onRowInserting(e: any) {
    if (!e.data.password) {
        notify('กรุณากรอกรหัสผ่าน', 'error', 2000);
        e.cancel = true; return;
    }
    
    try {
      await lastValueFrom(this.userService.create(e.data));
      notify('เพิ่มผู้ใช้งานสำเร็จ', 'success', 2000);
    } catch (err) {
      notify('เพิ่มข้อมูลล้มเหลว', 'error', 2000);
      e.cancel = true;
    }
  }

  // 🔥 Update
  async onRowUpdating(e: any) {
    const updatedData = { ...e.oldData, ...e.newData };
    
    // ถ้าไม่แก้รหัส ลบ field password ทิ้ง
    if (!e.newData.password) delete updatedData.password;

    try {
      await lastValueFrom(this.userService.update(e.key, updatedData));
      notify('แก้ไขข้อมูลสำเร็จ', 'success', 2000);
    } catch (err) {
      notify('แก้ไขล้มเหลว', 'error', 2000);
      e.cancel = true;
    }
  }

  // 🔥 Delete
  async onRowRemoving(e: any) {
    try {
      await lastValueFrom(this.userService.delete(e.key));
      notify('ลบข้อมูลสำเร็จ', 'success', 2000);
    } catch (err) {
      notify('ลบข้อมูลล้มเหลว', 'error', 2000);
      e.cancel = true;
    }
  }
}